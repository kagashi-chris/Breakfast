// src/managers/EnemyManager.ts
import Phaser from 'phaser';
import { BaseEnemy } from '../Enemies/BaseEnemy';
import { GlennBoss } from '../Enemies/GlennBoss';
import store, { RootState } from '../../store/store';
import { StageType } from '../../types/GameTypes';
import { PlayerManager } from './PlayerManager';

export class EnemyManager {
  private scene: Phaser.Scene;
  private unsubscribe: () => void;
  private enemies: BaseEnemy[] = [];
  private currentStage: StageType | null = null;
  private playerManager: PlayerManager;

  constructor(scene: Phaser.Scene, playerManager: PlayerManager) {
    this.scene = scene;
    this.playerManager = playerManager;
    this.unsubscribe = store.subscribe(this.handleStageChange.bind(this));
    // Manually trigger the handler so that the initial state is processed.
    this.handleStageChange();
  }
  

  private handleStageChange(): void {
    const state: RootState = store.getState();
    const newStage: StageType = state.game.selectedStage;
    if (newStage !== this.currentStage) {
      this.currentStage = newStage;
      this.clearEnemies();
      this.spawnEnemiesForStage(newStage);
    }
  }

  private spawnEnemiesForStage(stage: StageType): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;
    if (stage === 'GlennHM') {
      this.spawnEnemy(centerX, centerY, 9999999);
    }
  }

  spawnEnemy(x: number, y: number, duration: number = 2000): void {
    const enemy = new GlennBoss(this.scene, x, y, this.playerManager);
    this.enemies.push(enemy);

    this.scene.time.delayedCall(duration, () => {
      enemy.destroy();
      this.enemies = this.enemies.filter((e) => e !== enemy);
    });
  }

  clearEnemies(): void {
    this.enemies.forEach((enemy) => enemy.destroy());
    this.enemies = [];
  }

  update(time: number, delta: number): void {
    this.enemies.forEach((enemy) => enemy.update(time, delta));
  }

  destroy(): void {
    this.unsubscribe();
    this.clearEnemies();
  }
}
