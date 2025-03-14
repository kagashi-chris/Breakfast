import Phaser from 'phaser';
import { BaseEnemy } from './BaseEnemy';
import { PlayerManager } from '../ObjectManagers/PlayerManager';
import { shootSingleLaser } from '../util/laser-attack';
import { teleportToTarget } from '../util/teleport';
import { moveToTargetFixedDistance } from '../util/move';

export type GlennBossMoves = 'GroupLaser' | 'Slash' | 'Teleport' | 'Sword' | 'SummonTornado' | 'ShotgunLaser' | 'TornadoSlash';

export class GlennBoss extends BaseEnemy {
  public gameObject: Phaser.GameObjects.Arc;
  private delayBetweenEachAttack: number = 1000;
  private previousAttack: GlennBossMoves | null = null;
  private canAttack: boolean = false;
  private playerManager: PlayerManager;
  private nextAttackTime: number = 0; 
  private laserNumbers: number = 24;
  private laserRadius: number = 300;

  private teleportDistance: number = 400;

  private swordSlashDistance: number = 400;
  private attackPauseDuration: number = 400;

  private readonly attackDurations: Record<GlennBossMoves, number> = {
    GroupLaser: 3000,
    Slash: 3000,
    Teleport: 1000,
    Sword: 1200,
    TornadoSlash: 2500,
    ShotgunLaser: 1000,
    SummonTornado: 3000,
  };

  constructor(scene: Phaser.Scene, x: number, y: number, playerManager: PlayerManager) {
    super(scene);
    // Create a red circle for the boss.
    this.gameObject = scene.add.circle(x, y, 30, 0xADD8E6);
    this.playerManager = playerManager;
    
    // Enable physics for the enemy.
    scene.physics.add.existing(this.gameObject);
    const body = this.gameObject.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    // Allow the enemy to move and collide with world bounds.
    body.setCollideWorldBounds(true);

    // Initialize next move time to trigger immediately on first update.
    this.canAttack = true;
  }

  getDistanceFromPlayer(): number {
    const bossPos = new Phaser.Math.Vector2(this.gameObject.x, this.gameObject.y);
    const currentPlayerPos = this.playerManager.getPlayerPosition();
    return Phaser.Math.Distance.Between(bossPos.x, bossPos.y, currentPlayerPos.x, currentPlayerPos.y);
  }

  attack(currentTime: number): void {
    const moves: GlennBossMoves[] = [
      'GroupLaser',
      'Teleport',
      'ShotgunLaser',
      'Slash',
      // 'Sword',
      // 'SummonTornado',
      // 'TornadoSlash'
    ];
    const randomIndex = Phaser.Math.Between(0, moves.length - 1);
    const selectedMove = moves[randomIndex];
    console.log('GlennBoss attack move:', selectedMove);

    if(selectedMove === this.previousAttack) return;

    if (selectedMove === 'GroupLaser') {
      this.executeGroupLaser();
    }

    if (selectedMove === 'Teleport') {
      if (this.getDistanceFromPlayer() <= this.teleportDistance) return;
      this.executeTeleportToPlayer();
    }

    if (selectedMove === 'ShotgunLaser') {
      this.executeShotgunLaser();
    }

    if (selectedMove === 'Slash') {
      if (this.getDistanceFromPlayer() >= this.swordSlashDistance) return;
      this.executeSlashAttack();
    }

    this.previousAttack = selectedMove;

    const duration = this.attackDurations[selectedMove];
    this.nextAttackTime = currentTime + duration + this.delayBetweenEachAttack;
  }

  executeSlashAttack(): void {
    const attackDur = (this.attackDurations.Slash - (this.attackPauseDuration * 3)-100) / 3;
  
    if (this.getDistanceFromPlayer() >= this.swordSlashDistance) {
      teleportToTarget(this.scene, this.gameObject, this.playerManager.player, 200);
    }
    
    // Delay before the first move.
    this.scene.time.delayedCall(this.attackPauseDuration, () => {
      // Chain three sequential moves with pauses between them.
      moveToTargetFixedDistance(
        this.scene,
        this.gameObject,
        this.playerManager.getPlayerPosition(), // get fresh position
        this.swordSlashDistance,
        attackDur,
        () => {
          // Wait for attackPauseDuration before starting the second move.
          this.scene.time.delayedCall(this.attackPauseDuration, () => {
            moveToTargetFixedDistance(
              this.scene,
              this.gameObject,
              this.playerManager.getPlayerPosition(), // update target again
              this.swordSlashDistance,
              attackDur,
              () => {
                // Wait again before the third move.
                this.scene.time.delayedCall(this.attackPauseDuration, () => {
                  moveToTargetFixedDistance(
                    this.scene,
                    this.gameObject,
                    this.playerManager.getPlayerPosition(), // update for the third move
                    this.swordSlashDistance,
                    attackDur
                  );
                });
              }
            );
          });
        }
      );
    });
  }
  
  executeTeleportToPlayer(): void {
    teleportToTarget(this.scene, this.gameObject, this.playerManager.player, 200);
  }

  executeShotgunLaser(): void {
  // Get the boss's position.
  const bossPos = new Phaser.Math.Vector2(this.gameObject.x, this.gameObject.y);
  // Get the player's current position.
  const playerPos = this.playerManager.getPlayerPosition();
  
  // Compute the normalized direction from the boss to the player.
  const direction = new Phaser.Math.Vector2(
    playerPos.x - bossPos.x,
    playerPos.y - bossPos.y
  ).normalize();
  
  // Compute a perpendicular vector to the direction.
  const perpendicular = new Phaser.Math.Vector2(-direction.y, direction.x);
  
  const numberOfLasers = 7;
  const spacing = 100; // pixels between each laser origin
  
  // Spawn all 7 lasers simultaneously.
  for (let i = 0; i < numberOfLasers; i++) {
    // Calculate the offset along the perpendicular.
    const offset = (i - Math.floor(numberOfLasers / 2)) * spacing;
    const origin = bossPos.clone().add(perpendicular.clone().scale(offset));
    const target = playerPos.clone(); // Laser always targets the player.
    
    shootSingleLaser(
      this.scene,
      origin,
      target,
      5, 
      1000,
      1500,
      0xff0000,
      this.playerManager.player
    );
  }

  }  

  executeGroupLaser(): void {
    for (let i = 0; i < this.laserNumbers; i++) {
      this.scene.time.delayedCall(i * 150, () => {
        let randomPoint: Phaser.Math.Vector2;
        let target: Phaser.Math.Vector2;
        if (Phaser.Math.Between(1, 8) === 1) {
          target = this.playerManager.getPlayerPosition();
          const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const distance = Phaser.Math.FloatBetween(0, this.laserRadius);
          randomPoint = new Phaser.Math.Vector2(
            target.x + Math.cos(angle) * distance,
            target.y + Math.sin(angle) * distance
          );
        } 
        else {
          const playerPos = this.playerManager.getPlayerPosition();
          const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const distance = Phaser.Math.FloatBetween(0, this.laserRadius);
          const angle2 = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const distance2 = Phaser.Math.FloatBetween(0, this.laserRadius);
          target = new Phaser.Math.Vector2(
            playerPos.x + Math.cos(angle) * distance,
            playerPos.y + Math.sin(angle) * distance
          );
          randomPoint = new Phaser.Math.Vector2(
            playerPos.x + Math.cos(angle2) * distance2,
            playerPos.y + Math.sin(angle2) * distance2
          );
        }
        shootSingleLaser(this.scene, randomPoint, target, 5, 500, 1500, 0xff0000, this.playerManager.player);
      }, undefined, this);
    }
  }
  
  

  update(time: number, delta: number): void {
    if (this.canAttack && time >= this.nextAttackTime) {
      this.attack(time);
    }
  }
}
