export function lineWarning(
    scene: Phaser.Scene,
    origin: Phaser.Math.Vector2,
    targetPos: Phaser.Math.Vector2,
    width: number,
    distance: number,
    color: number
  ): Phaser.GameObjects.Graphics {
    const warning = scene.add.graphics();
    warning.lineStyle(width, color, 0.3);
    // Calculate the angle from origin to target.
    const angle = Phaser.Math.Angle.Between(origin.x, origin.y, targetPos.x, targetPos.y);
    // Compute the end point using the given distance.
    const endX = origin.x + Math.cos(angle) * distance;
    const endY = origin.y + Math.sin(angle) * distance;
    // Draw the line.
    warning.strokeLineShape(new Phaser.Geom.Line(origin.x, origin.y, endX, endY));
    return warning;
  }


  export function createLaser(
    scene: Phaser.Scene,
    origin: Phaser.Math.Vector2,
    targetPos: Phaser.Math.Vector2,
    width: number,
    distance: number,
    color: number
  ): Phaser.GameObjects.Graphics {
    const laser = scene.add.graphics();
    laser.fillStyle(color, 1);
    // Draw a rectangle starting at (0, -width/2) with width=distance and height=width.
    const rect = new Phaser.Geom.Rectangle(0, -width / 2, distance, width);
    laser.fillRectShape(rect);
    // Position the laser at the origin.
    laser.setPosition(origin.x, origin.y);
    // Rotate the laser to point toward the target.
    const angle = Phaser.Math.Angle.Between(origin.x, origin.y, targetPos.x, targetPos.y);
    laser.setRotation(angle);
    return laser;
  }



  export function shootSingleLaser(
    scene: Phaser.Scene,
    origin: Phaser.Math.Vector2,
    targetPos: Phaser.Math.Vector2,
    width: number,
    distance: number,
    warningDuration: number,
    color: number,
    player?: Phaser.GameObjects.GameObject
  ): void {
    // 1. Create the line warning.
    const warning = lineWarning(scene, origin, targetPos, width, distance, color);
  
    // 2. After the warning duration, remove the warning and spawn the laser.
    scene.time.delayedCall(warningDuration, () => {
      // Destroy the warning.
      warning.destroy();
  
      // Create the actual laser.
      const laser = createLaser(scene, origin, targetPos, width, distance, color);
  
      // Enable physics on the laser for collision detection.
      scene.physics.add.existing(laser);
      
      // Set the laser's physics body to be immovable and not affected by gravity.
      const laserBody = laser.body as Phaser.Physics.Arcade.Body;
      laserBody.setAllowGravity(false);
      laserBody.setImmovable(true);
  
      // 3. Set up an overlap check between the player and the laser.
      scene.physics.add.overlap(player, laser, (playerObj, laserObj) => {
        console.log('Player hit by laser!');
        // Insert your damage logic here (e.g., reduce HP).
      });
  
      // Optionally, destroy the laser after a fixed duration (e.g., 1000ms).
      scene.time.delayedCall(200, () => {
        laser.destroy();
      });
    });
  }