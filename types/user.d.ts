export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  userId: string;
  mostPlayedGame: string;
  totalPlaytime: number;
  favoriteCategory: string;
  highScores: { [gameId: string]: number };
}
