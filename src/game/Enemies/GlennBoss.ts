import Phaser from 'phaser';
import { BaseEnemy } from './BaseEnemy';
import { PlayerManager } from '../ObjectManagers/PlayerManager';
import { lineWarning } from '../util/attackIndicators';
import { shootSingleLaser } from '../util/laserAttack';
import { teleportToTarget } from '../util/teleport';

export type GlennBossMoves = 'GroupLaser' | 'Slash' | 'Teleport' | 'Sword' | 'SummonTornado' | 'ShotgunLaser' | 'TornadoSlash';

export class GlennBoss extends BaseEnemy {
  public gameObject: Phaser.GameObjects.Arc;
  private canAttack: boolean = false;
  private playerManager: PlayerManager;
  private nextAttackTime: number = 0; 
  private laserNumbers: number = 24;
  private laserRadius: number = 300;
  private laserOffset: number = 100;

  private readonly attackDurations: Record<GlennBossMoves, number> = {
    GroupLaser: 5000,
    Slash: 1000,
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

  attack(currentTime: number): void {
    const moves: GlennBossMoves[] = [
      'GroupLaser',
      // 'Slash',
      'Teleport',
      // 'Sword',
      // 'SummonTornado',
      // 'ShotgunLaser',
      // 'TornadoSlash'
    ];
    const randomIndex = Phaser.Math.Between(0, moves.length - 1);
    const selectedMove = moves[randomIndex];
    console.log('GlennBoss attack move:', selectedMove);

    if (selectedMove === 'GroupLaser') {
      this.executeGroupLaser();
    }

    if (selectedMove === 'Teleport') {
      this.teleportToPlayer();
    }

    const duration = this.attackDurations[selectedMove];
    this.nextAttackTime = currentTime + duration;
  }

  teleportToPlayer(): void {
    teleportToTarget(this.scene, this.gameObject, this.playerManager.player, 200);
  }

  executeGroupLaser(): void {
    console.log('executing group laser');
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
