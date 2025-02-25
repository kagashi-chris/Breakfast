// src/enemies/GlennBoss.ts
import Phaser from 'phaser';
import { BaseEnemy } from './BaseEnemy';

export class GlennBoss extends BaseEnemy {
  public gameObject: Phaser.GameObjects.Arc;
  private nextMoveTime: number = 0;

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
    this.nextMoveTime = 0;
  }

  update(time: number, delta: number): void {
    // Rotate the enemy for visual effect.
    this.gameObject.rotation += 0.01 * delta;

    // When it's time to update movement:
    if (time >= this.nextMoveTime) {
      const body = this.gameObject.body as Phaser.Physics.Arcade.Body;
      // Choose a random angle (0 to 2π).
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      // Choose a random speed between 50 and 150 pixels per second.
      const speed = Phaser.Math.Between(50, 150);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      // Set the new velocity.
      body.setVelocity(vx, vy);
      
      // Schedule the next move: random interval between 1000ms and 2000ms.
      this.nextMoveTime = time + Phaser.Math.Between(1000, 2000);
    }
  }
}
