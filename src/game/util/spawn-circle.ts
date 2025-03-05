// src/utils/spawnTemporaryCircle.ts
import Phaser from 'phaser';

/**
 * Spawns a temporary physics-enabled circle.
 * When the player overlaps with it, the provided callback is executed.
 *
 * @param scene The Phaser scene.
 * @param x X-coordinate for the circle.
 * @param y Y-coordinate for the circle.
 * @param radius Radius of the circle.
 * @param color Fill color for the circle.
 * @param player The physics-enabled player object.
 * @param onOverlap Callback function to run when the overlap occurs.
 *                  Receives the player and the circle as Arcade-enabled objects.
 * @param duration Duration (in ms) the circle stays in the scene (default 2000ms).
 */
export function spawnCircle(
  scene: Phaser.Scene,
  x: number,
  y: number,
  radius: number,
  color: number,
  intersectObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  duration: number = 0,
  onOverlap: (
    affectedObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) => void,
): void {
  // Create the circle
  const circle = scene.add.circle(x, y, radius, color);

  // Add a physics body to the circle for overlap detection
  scene.physics.add.existing(circle);
  const circleBody = circle.body as Phaser.Physics.Arcade.Body;
  circleBody.setAllowGravity(false);
  circleBody.setImmovable(true);

  // Set up an overlap check between the player and the circle.
  scene.physics.add.overlap(
    intersectObj,
    circle,
    (affectedObj) => {
      // Execute the provided callback
      onOverlap(affectedObj as Phaser.Types.Physics.Arcade.GameObjectWithBody);
      // Optionally, destroy the circle immediately to prevent repeated triggers.
      circle.destroy();
    },
    undefined,
    scene
  );

  // Destroy the circle after the specified duration if it hasn't been overlapped.
  scene.time.delayedCall(duration, () => {
    if (circle.active) {
      circle.destroy();
    }
  });
}
