import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const submitScore = mutation({
  args: { game: v.string(), userId: v.string(), score: v.number() },
  handler: async (ctx, args) => {
    const { game, userId, score } = args;
    await ctx.db.insert('scores', { game, userId, score, createdAt: new Date() });
  },
});

export const getLeaderboard = query({
  args: { game: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { game, limit = 10 } = args;
    return await ctx.db
      .query('scores')
      .filter((q) => q.eq(q.field('game'), game))
      .order('desc')
      .take(limit);
  },
});
