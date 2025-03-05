// src/utils/movement.ts
import Phaser from 'phaser';

/**
 * Moves the boss to a specified target position over the given duration.
 *
 * @param scene - The current Phaser scene.
 * @param boss - The boss GameObject that will be moved.
 * @param target - The target position as a Phaser.Math.Vector2.
 * @param duration - The time in milliseconds over which to move the boss.
 */
export function moveTargetTo(
    scene: Phaser.Scene,
    targetObj: Phaser.GameObjects.GameObject,
    targetPos: Phaser.Math.Vector2,
    duration: number,
    onComplete?: () => void
  ): Phaser.Tweens.Tween {
    return scene.tweens.add({
      targets: targetObj,
      x: targetPos.x,
      y: targetPos.y,
      duration: duration,
      ease: 'Linear',
      onComplete: onComplete
    });
  }


  export function moveToTargetFixedDistance(
    scene: Phaser.Scene,
    obj: Phaser.GameObjects.GameObject,
    target: Phaser.Math.Vector2,
    fixedDistance: number,
    duration: number,
    onComplete?: () => void
  ): Phaser.Tweens.Tween {
    // Get the object's current position.
    const currentPos = new Phaser.Math.Vector2(obj.x, obj.y);
    // Compute the direction from current position to target.
    const direction = target.clone().subtract(currentPos).normalize();
    // Compute the new target: move fixedDistance in that direction.
    const newTarget = currentPos.clone().add(direction.scale(fixedDistance));
    
    // Now use the existing moveTargetTo function to tween to the new target.
    return moveTargetTo(scene, obj, newTarget, duration, onComplete);
  }