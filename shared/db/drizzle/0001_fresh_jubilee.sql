ALTER TABLE "servers" DROP CONSTRAINT "servers_online_battle_mention_role_id_unique";--> statement-breakpoint
ALTER TABLE "servers" DROP CONSTRAINT "servers_online_battle_tracker_channel_id_unique";--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "online_battle_mention_role_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "online_battle_tracker_channel_id" SET NOT NULL;