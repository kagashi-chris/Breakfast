// src/utils/teleport.ts
import Phaser from 'phaser';

/**
 * Teleports the source object to a random position relative to the target.
 * The new position is chosen randomly within a circle centered on the target,
 * with a radius up to maxDistance. The position is clamped to the scene bounds.
 *
 * @param scene - The current Phaser scene.
 * @param source - The game object to teleport (must have Transform methods).
 * @param target - The target game object (must have Transform methods).
 * @param maxDistance - The maximum distance from the target.
 */
export function teleportToTarget(
  scene: Phaser.Scene,
  source: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform,
  target: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform,
  maxDistance: number
): void {
  // Choose a random angle (0 to 2π) and a random distance (0 to maxDistance)
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const distance = Phaser.Math.FloatBetween(0, maxDistance);

  // Calculate the new position based on the target's position.
  let newX = target.x + Math.cos(angle) * distance;
  let newY = target.y + Math.sin(angle) * distance;

  // Clamp the new position so it stays within the scene bounds.
  newX = Phaser.Math.Clamp(newX, 0, scene.scale.width);
  newY = Phaser.Math.Clamp(newY, 0, scene.scale.height);

  // Teleport the source to the new position.
  source.setPosition(newX, newY);

  // If the source has an Arcade physics body, reset its position.
  const body = source.body as Phaser.Physics.Arcade.Body | undefined;
  if (body && typeof body.reset === 'function') {
    body.reset(newX, newY);
  }
}
