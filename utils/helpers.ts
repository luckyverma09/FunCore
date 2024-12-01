import { Game, Score } from '../types/game';
import { User, UserStats } from '../types/user';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function calculateLevel(score: number): number {
  // Example level calculation, adjust as needed
  return Math.floor(Math.sqrt(score / 100)) + 1;
}

export function sortGamesByPopularity(games: Game[]): Game[] {
  // This is a placeholder implementation. In a real app, you'd need to track game popularity.
  return [...games].sort((a, b) => b.title.localeCompare(a.title));
}

export function getTopScores(scores: Score[], limit: number = 10): Score[] {
  return [...scores].sort((a, b) => b.score - a.score).slice(0, limit);
}

export function calculateUserStats(user: User, scores: Score[], games: Game[]): UserStats {
  // This is a simplified implementation. Adjust based on your actual data structure and requirements.
  const userScores = scores.filter((score) => score.userId === user.id);
  const gamePlays = userScores.reduce((acc, score) => {
    acc[score.gameId] = (acc[score.gameId] || 0) + 1;
    return acc;
  }, {} as { [gameId: string]: number });

  const mostPlayedGameId = Object.keys(gamePlays).reduce((a, b) =>
    gamePlays[a] > gamePlays[b] ? a : b
  );
  const mostPlayedGame = games.find((game) => game.id === mostPlayedGameId)?.title || 'Unknown';

  const totalPlaytime = userScores.length * 10; // Assuming each game takes 10 minutes

  const gameCategories = userScores.map((score) => {
    const game = games.find((g) => g.id === score.gameId);
    return game ? game.category : 'Unknown';
  });
  const favoriteCategory =
    gameCategories
      .sort(
        (a, b) =>
          gameCategories.filter((v) => v === a).length -
          gameCategories.filter((v) => v === b).length
      )
      .pop() || 'Unknown';

  const highScores = userScores.reduce((acc, score) => {
    if (!acc[score.gameId] || score.score > acc[score.gameId]) {
      acc[score.gameId] = score.score;
    }
    return acc;
  }, {} as { [gameId: string]: number });

  return {
    userId: user.id,
    mostPlayedGame,
    totalPlaytime,
    favoriteCategory,
    highScores,
  };
}
