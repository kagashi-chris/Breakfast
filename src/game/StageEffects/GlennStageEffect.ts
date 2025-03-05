// src/managers/GlennStageEffect.ts
import Phaser from 'phaser';
import { PlayerManager } from '../ObjectManagers/PlayerManager';
import { animateFillCircle, createDamageCircle, spawnCircleOutlineContainer } from  '../util/circle-attacks';

export class GlennStageEffect {
  private scene: Phaser.Scene;
  private playerManager: PlayerManager;
  private redElapsed: number = 0;
  private chillElapsed: number = 0;

  //redCircleDur and redDamageCircleDuration should add up to redCircleSpawnInterval so new ones spawn as they get deleted
  // private redCircleSpawnInterval: number = 20000;
  private redCircleDur: number = 3000;
  private redCircleAmount: number = 8;
  private redCircleRadius: number = 150;
  private redCircleThickness: number = 2;
  private redDamageCircleDuration: number = 17000;

  private chillCircleSpawnInterval: number = 12000;
  private chillCircleDur: number = 4000;
  private chillCircleRadius: number = 150;
  private chillCircleThickness: number = 4;

  private followPlayerList: Phaser.GameObjects.Container[] = [];

  constructor(scene: Phaser.Scene, playerManager: PlayerManager) {
    this.scene = scene;
    this.playerManager = playerManager;
  }

  private spawnChillCircle(): void {
    const chillCircleContainer = spawnCircleOutlineContainer(
      this.scene,
      this.playerManager.getPlayerPosition(),
      this.chillCircleRadius,
      this.chillCircleThickness,
      0xffffff,
      0.8
    );

    const chillFill = animateFillCircle(
      this.scene,
      this.playerManager.getPlayerPosition(),
      this.redCircleRadius,
      0xffffff,
      0.5,
      this.chillCircleDur
    );
    
    this.followPlayerList.push(chillCircleContainer);
    this.followPlayerList.push(chillFill);
    this.scene.time.delayedCall(this.chillCircleDur, () => {
      const index = this.followPlayerList.indexOf(chillCircleContainer);
      if (index > -1) {
        this.followPlayerList.splice(index, 1);
      }
      const index2 = this.followPlayerList.indexOf(chillFill);
      if (index2 > -1) {
        this.followPlayerList.splice(index2, 1);
      }
      chillCircleContainer.destroy();
      spawnCircleOutlineContainer(
        this.scene,
        this.playerManager.getPlayerPosition(),
        this.chillCircleRadius,
        this.chillCircleThickness,
        0xffffff,
        0.8
      );
    });
  }

  private spawnRedCircles(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;
    
    for (let i = 0; i < this.redCircleAmount; i++) {
      // Generate a random offset biased towards the center using squared random values.
      const offsetX = (Math.random() ** 2) * centerX * (Math.random() < 0.5 ? -1 : 1);
      const offsetY = (Math.random() ** 2) * centerY * (Math.random() < 0.5 ? -1 : 1);
      const center = new Phaser.Math.Vector2(centerX + offsetX, centerY + offsetY);
      
      const outline = spawnCircleOutlineContainer(
        this.scene,
        center,
        this.redCircleRadius,
        this.redCircleThickness,
        0xff0000,
        0.5
      );
      
      const fill = animateFillCircle(
        this.scene,
        center,
        this.redCircleRadius,
        0xff0000,
        0.5,
        this.redCircleDur
      );
      
      // After the fill duration, destroy outline and fill, then create the damage circle.
      this.scene.time.delayedCall(this.redCircleDur, () => {
        outline.destroy();
        fill.destroy();
        
        // Create the damage circle.
        const damageCircle = createDamageCircle(
          this.scene,
          center,
          this.redCircleRadius,
          this.redCircleThickness,
          0xff0000,
          0.5,
          this.playerManager.player
        );
        
        // Destroy the damage circle after redredDamageCircleDuration.
        this.scene.time.delayedCall(this.redDamageCircleDuration, () => {
          damageCircle.destroy();
        });
      });
    }
  }

  public update(time: number, delta: number): void {
    this.redElapsed += delta;
    if (this.redElapsed >= this.redCircleDur + this.redDamageCircleDuration) {
      this.spawnRedCircles();
      this.redElapsed = 0;
    }
  
    this.chillElapsed += delta;
    if (this.chillElapsed >= this.chillCircleSpawnInterval) {
      this.spawnChillCircle();
      this.chillElapsed = 0;
    }

    const playerPos = this.playerManager.getPlayerPosition();

    for (let i = 0; i < this.followPlayerList.length; i++) {
      // Assuming these are Containers, you can use setPosition.
      (this.followPlayerList[i] as Phaser.GameObjects.Container).setPosition(
        playerPos.x,
        playerPos.y
      );
    }
  }

  public destroy(): void {
    // Clean up if necessary.
  }
}
