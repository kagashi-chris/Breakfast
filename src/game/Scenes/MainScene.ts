// src/game/Scenes/MainScene.ts
import Phaser from 'phaser';
import { PlayerManager } from '../ObjectManagers/PlayerManager';
import { EnemyManager } from '../ObjectManagers/EnemyManager';
import { StageEffectManager } from '../ObjectManagers/StageEffectManager';
// import { EnemyManager } from '../../managers/EnemyManager';

export class MainScene extends Phaser.Scene {
  private playerManager!: PlayerManager;
  private enemyManager!: EnemyManager;
  private stageManager!: StageEffectManager;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // Preload assets if needed.
  }

  create(): void {
    // Create and initialize the player manager.
    this.playerManager = new PlayerManager(this);
    this.enemyManager = new EnemyManager(this, this.playerManager);
    this.stageManager = new StageEffectManager(this, this.playerManager);
  }

  update(time: number, delta: number): void {
    // Delegate update calls to the managers.
    this.playerManager.update(delta);
    this.enemyManager.update(time, delta);
    this.stageManager.update(time, delta);
  }
}
