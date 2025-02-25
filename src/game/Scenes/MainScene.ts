// src/game/Scenes/MainScene.ts
import Phaser from 'phaser';
import { PlayerManager } from '../ObjectManagers/PlayerManager';
import { EnemyManager } from '../ObjectManagers/EnemyManager';
// import { EnemyManager } from '../../managers/EnemyManager';

export class MainScene extends Phaser.Scene {
  private playerManager!: PlayerManager;
  private enemyManager!: EnemyManager;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // Preload assets if needed.
  }

  create(): void {
    // Set background color.
    this.cameras.main.setBackgroundColor('#24252A');

    // Create and initialize the player manager.
    this.playerManager = new PlayerManager(this);
    this.enemyManager = new EnemyManager(this);
  }

  update(time: number, delta: number): void {
    // Delegate update calls to the managers.
    this.playerManager.update(delta);
    this.enemyManager.update(time, delta);
  }
}
