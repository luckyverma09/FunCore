export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
}

export interface Score {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  createdAt: Date;
}
