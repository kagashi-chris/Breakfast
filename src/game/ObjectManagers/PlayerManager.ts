// src/managers/PlayerManager.ts
import Phaser from 'phaser';

export class PlayerManager {
  public player: Phaser.GameObjects.Arc;
  private scene: Phaser.Scene;
  private speed: number = 500;
  private targetPosition: Phaser.Math.Vector2 | null = null;
  private playerKnockedBack: boolean = false;
  private knockDownDuration: number = 0;

  private keys: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Create the player as a green circle.
    this.player = scene.add.circle(50, 50, 14, 0xA4A4A4);

    // Set up WASD keys.
    this.keys = scene.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as {
      up: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };

    // Listen for pointer clicks to set a target position.
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.targetPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
    });
  }

  // knockDownPlayer(origin, duration, knockDownDistance, knockDownVelocity,) {

  // }

  getPlayerPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.player.x, this.player.y);
  }

  update(delta: number): void {
    const dt = delta / 1000;
    let moved = false;

    // WASD movement.
    if (this.keys.left.isDown) {
      this.player.x -= this.speed * dt;
      moved = true;
    }
    if (this.keys.right.isDown) {
      this.player.x += this.speed * dt;
      moved = true;
    }
    if (this.keys.up.isDown) {
      this.player.y -= this.speed * dt;
      moved = true;
    }
    if (this.keys.down.isDown) {
      this.player.y += this.speed * dt;
      moved = true;
    }

    // If keyboard movement occurs, ignore pointer-based target.
    if (moved) {
      this.targetPosition = null;
    } else if (this.targetPosition) {
      // Move the player toward the pointer target.
      const direction = new Phaser.Math.Vector2(
        this.targetPosition.x - this.player.x,
        this.targetPosition.y - this.player.y
      );
      const distance = direction.length();
      if (distance > 5) {
        direction.normalize();
        this.player.x += direction.x * this.speed * dt;
        this.player.y += direction.y * this.speed * dt;
      } else {
        this.targetPosition = null;
      }
    }
  }
}
