export interface IStageEffect {
    update(time: number, delta: number): void;
    destroy(): void;
  }