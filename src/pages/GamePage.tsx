import React from 'react';
import GameCanvas from '../components/GameCanvas';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const GamePage: React.FC = () => {
  const hp = useSelector((state: RootState) => state.player.hp);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <p className="text-xl">HP: {hp}</p>
      <div style={{ flex: 1 }}>
        <GameCanvas />
      </div>
    </div>
  );
};

export default GamePage;
