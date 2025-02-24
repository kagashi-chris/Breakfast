import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../game/Scenes/MainScene';

const GameCanvas: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      const width = gameRef.current.clientWidth;
      const height = gameRef.current.clientHeight;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width,
        height,
        parent: gameRef.current,
        scene: [MainScene],
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0, x: 0 },
          },
        },
      };

      const game = new Phaser.Game(config);
      return () => {
        game.destroy(true);
      };
    }
  }, []);

  return (
    <div
      ref={gameRef}
      style={{ width: '100%', height: '100%', border: '1px solid #fff' }}
    />
  );
};

export default GameCanvas;
