import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const servers = pgTable('servers', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	guildId: text('guild_id').unique().notNull(),
	onlineBattleMentionRoleId: text('online_battle_mention_role_id').notNull(),
	onlineBattleTrackerChannelId: text('online_battle_tracker_channel_id').notNull()
});
