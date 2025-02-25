// src/enemies/BaseEnemy.ts
import Phaser from 'phaser';

export abstract class BaseEnemy {
  protected scene: Phaser.Scene;
  public abstract gameObject: Phaser.GameObjects.GameObject;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // All enemy types should implement their own update logic.
  abstract update(time: number, delta: number): void;

  // A common destroy method.
  destroy(): void {
    this.gameObject.destroy();
  }
}
