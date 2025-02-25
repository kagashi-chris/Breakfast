// src/enemies/GlennBoss.ts
import Phaser from 'phaser';
import { BaseEnemy } from './BaseEnemy';

export class GlennBoss extends BaseEnemy {
  public gameObject: Phaser.GameObjects.Arc;
  private canAttack: boolean = false;


  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene);
    // Create a red circle for the boss.
    this.gameObject = scene.add.circle(x, y, 30, 0xff0000);
    
    // Enable physics for the enemy.
    scene.physics.add.existing(this.gameObject);
    const body = this.gameObject.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    // Allow the enemy to move and collide with world bounds.
    body.setCollideWorldBounds(true);

    // Initialize next move time to trigger immediately on first update.
    this.canAttack = true;
  }

  update(time: number, delta: number): void {

  }
}
