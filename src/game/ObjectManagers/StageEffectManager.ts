// src/managers/StageEffectManager.ts
import Phaser from 'phaser';
import store, { RootState } from '../../store/store';
import { StageType } from '../../types/GameTypes';
import { PlayerManager } from './PlayerManager';
import { IStageEffect } from '../../interface/StageInterface';
import { GlennStageEffect } from '../StageEffects/GlennStageEffect';

export class StageEffectManager {
  private scene: Phaser.Scene;
  private playerManager: PlayerManager;
  private currentStage: StageType | null = null;
  private unsubscribe: () => void;
  private currentStageEffect: IStageEffect | null = null;

  constructor(scene: Phaser.Scene, playerManager: PlayerManager) {
    this.scene = scene;
    this.playerManager = playerManager;
    this.unsubscribe = store.subscribe(this.handleStageChange.bind(this));
    this.handleStageChange();
  }

  private handleStageChange(): void {
    const state: RootState = store.getState();
    const newStage: StageType = state.game.selectedStage;
    if (newStage !== this.currentStage) {
      this.currentStage = newStage;
      this.applyStageEffect(newStage);
    }
  }

  private applyStageEffect(stage: StageType): void {
    // Destroy current stage effect if it exists.
    if (this.currentStageEffect) {
      this.currentStageEffect.destroy();
      this.currentStageEffect = null;
    }

    // Create a new stage effect based on the stage.
    if (stage === 'GlennHM') {
      this.currentStageEffect = new GlennStageEffect(this.scene, this.playerManager);
    }
    // else if (stage === 'AnotherStageType') {
    //   this.currentStageEffect = new AnotherStageEffect(this.scene, this.playerManager);
    // }
  }

  public update(time: number, delta: number): void {
    if (this.currentStageEffect) {
      this.currentStageEffect.update(time, delta);
    }
  }

  public destroy(): void {
    if (this.currentStageEffect) {
      this.currentStageEffect.destroy();
    }
    this.unsubscribe();
  }
}
