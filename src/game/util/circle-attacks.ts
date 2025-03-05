// Example utility functions in src/utils/circleEffects.ts

import Phaser from 'phaser';

/**
 * Spawns a circle outline (warning) at the specified center.
 *
 * @param scene - The current Phaser scene.
 * @param center - The center of the circle.
 * @param radius - The radius of the circle.
 * @param borderThickness - The thickness of the circle's border.
 * @param color - The color of the circle (hex value).
 * @param alpha - The opacity of the outline.
 * @returns A Graphics object representing the circle outline.
 */
// export function spawnCircleOutline(
//   scene: Phaser.Scene,
//   center: Phaser.Math.Vector2,
//   radius: number,
//   borderThickness: number,
//   color: number,
//   alpha: number = 1
// ): Phaser.GameObjects.Graphics {
//   const outline = scene.add.graphics();
//   outline.lineStyle(borderThickness, color, alpha);
//   outline.strokeCircle(center.x, center.y, radius);
//   return outline;
// }

export function spawnCircleOutlineContainer(
  scene: Phaser.Scene,
  center: Phaser.Math.Vector2,
  radius: number,
  borderThickness: number,
  color: number,
  alpha: number = 1
): Phaser.GameObjects.Container {
  // Create a container.
  const container = scene.add.container(center.x, center.y);
  
  // Create the outline graphics, but draw the circle at (0,0).
  const outline = scene.add.graphics();
  outline.lineStyle(borderThickness, color, alpha);
  outline.strokeCircle(0, 0, radius);
  
  // Add the outline to the container.
  container.add(outline);
  
  return container;
}

/**
 * Animates a fill circle that grows from 0 to the final radius.
 *
 * @param scene - The current Phaser scene.
 * @param center - The center of the circle.
 * @param finalRadius - The final radius of the fill circle.
 * @param fillColor - The fill color (hex value).
 * @param fillAlpha - The opacity of the fill.
 * @param duration - The duration (in ms) for the fill to grow.
 * @returns A Graphics object representing the animated fill circle.
 */
export function animateFillCircle(
  scene: Phaser.Scene,
  center: Phaser.Math.Vector2,
  finalRadius: number,
  fillColor: number,
  fillAlpha: number,
  duration: number
): Phaser.GameObjects.Container {
  // Create a container at the specified center.
  const container = scene.add.container(center.x, center.y);

  // Create a graphics object for the fill, drawn at (0, 0) in the container.
  const fill = scene.add.graphics();
  fill.fillStyle(fillColor, fillAlpha);
  fill.fillCircle(0, 0, 0); // Start with radius 0.

  // Add the fill graphics to the container.
  container.add(fill);

  // Object to tween the radius value.
  const tweenObj = { radius: 0 };

  // Tween the radius from 0 to finalRadius over the specified duration.
  scene.tweens.add({
    targets: tweenObj,
    radius: finalRadius,
    duration: duration,
    ease: 'Linear',
    onUpdate: () => {
      fill.clear();
      fill.fillStyle(fillColor, fillAlpha);
      fill.fillCircle(0, 0, tweenObj.radius);
    },
    onComplete: () => {
      // Optionally perform additional actions when complete.
    }
  });

  return container;
}


export function createDamageCircle(
  scene: Phaser.Scene,
  center: Phaser.Math.Vector2,
  radius: number,
  borderThickness: number,
  color: number,
  alpha: number,
  player: Phaser.GameObjects.GameObject
): Phaser.GameObjects.Graphics {
  const damageCircle = scene.add.graphics();
    // Draw the fill.
    damageCircle.fillStyle(color, alpha - 0.1);
    damageCircle.fillCircle(center.x, center.y, radius);
  
    // Draw the outline.
    damageCircle.lineStyle(borderThickness, color, alpha);
    damageCircle.strokeCircle(center.x, center.y, radius);

  // scene.physics.add.existing(damageCircle);
  // const body = damageCircle.body as Phaser.Physics.Arcade.Body;
  // body.setCircle(radius, -radius, -radius);

  // scene.physics.add.overlap(player, damageCircle, (playerObj, circleObj) => {
  //   console.log('Player stepped in damage circle!');
  //   // Damage logic can be added here later.
  // });

  return damageCircle;
}