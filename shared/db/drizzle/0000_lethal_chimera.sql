CREATE TABLE "servers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "servers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"guild_id" text NOT NULL,
	"online_battle_mention_role_id" text,
	"online_battle_tracker_channel_id" text,
	CONSTRAINT "servers_guild_id_unique" UNIQUE("guild_id"),
	CONSTRAINT "servers_online_battle_mention_role_id_unique" UNIQUE("online_battle_mention_role_id"),
	CONSTRAINT "servers_online_battle_tracker_channel_id_unique" UNIQUE("online_battle_tracker_channel_id")
);
