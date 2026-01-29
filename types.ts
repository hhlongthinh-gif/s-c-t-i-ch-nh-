
export interface Buckets {
  spending: number;
  saving: number;
  sharing: number;
}

export type GameState = 'SETUP' | 'PLAYING' | 'RESULT';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  impact: (current: Buckets) => Partial<Buckets> & { totalImpact: number };
}
