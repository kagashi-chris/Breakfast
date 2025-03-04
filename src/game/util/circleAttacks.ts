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
export function spawnCircleOutline(
  scene: Phaser.Scene,
  center: Phaser.Math.Vector2,
  radius: number,
  borderThickness: number,
  color: number,
  alpha: number = 1
): Phaser.GameObjects.Graphics {
  const outline = scene.add.graphics();
  outline.lineStyle(borderThickness, color, alpha);
  outline.strokeCircle(center.x, center.y, radius);
  return outline;
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
): Phaser.GameObjects.Graphics {
  const fill = scene.add.graphics();
  fill.fillStyle(fillColor, fillAlpha);
  // Start with radius 0.
  fill.fillCircle(center.x, center.y, 0);

  const tweenObj = { radius: 0 };

  scene.tweens.add({
    targets: tweenObj,
    radius: finalRadius,
    duration: duration,
    ease: 'Linear',
    onUpdate: () => {
      fill.clear();
      fill.fillStyle(fillColor, fillAlpha);
      fill.fillCircle(center.x, center.y, tweenObj.radius);
    },
    onComplete: () => {
      // Optionally perform additional actions on complete.
    }
  });

  return fill;
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