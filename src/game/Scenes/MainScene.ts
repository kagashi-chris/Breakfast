import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private speed: number = 500;
  private targetPosition: Phaser.Math.Vector2 | null = null;
  private keys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Preload assets if needed.
  }

  create() {
    // Set a background color to better see the scene.
    this.cameras.main.setBackgroundColor('#24252A');

    // Create the player as a green circle at a starting position.
    this.player = this.add.circle(50, 50, 20, 0x00ff00);
    console.log('Player created at:', this.player.x, this.player.y);

    // Set up WASD input using Phaser's key codes.
    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    }) as {
      up: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };

    // Listen for pointer (mouse/touch) clicks to set a movement target.
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.targetPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
      console.log('New target position:', pointer.x, pointer.y);
    });
  }

  update(time: number, delta: number) {
    const dt = delta / 1000;
    let moved = false;

    // WASD movement: move the player if any key is pressed.
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

    // If WASD movement occurred, cancel any pointer-based target.
    if (moved) {
      this.targetPosition = null;
    } else if (this.targetPosition) {
      // Move the player toward the target position.
      const direction = new Phaser.Math.Vector2(
        this.targetPosition.x - this.player.x,
        this.targetPosition.y - this.player.y
      );
      const distance = direction.length();

      // Only move if the player is more than 5 pixels away from the target.
      if (distance > 5) {
        direction.normalize();
        this.player.x += direction.x * this.speed * dt;
        this.player.y += direction.y * this.speed * dt;
      } else {
        // Clear the target when the player gets close enough.
        this.targetPosition = null;
      }
    }
  }
}
