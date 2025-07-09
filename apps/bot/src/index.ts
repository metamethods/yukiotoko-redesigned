import { db } from '@yukiotoko-redesigned/db';
import { servers } from '@yukiotoko-redesigned/db/src/schema';
import { YukiotokoWebSocket, YukiotokoWebSocketEvent } from '@yukiotoko-redesigned/yukiotoko';
import { Client, EmbedBuilder, GatewayIntentBits } from 'discord.js';
import { Color, createBaseRoomEmbed } from './lib';

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

await client.login(Bun.env.BOT_TOKEN);

const yukiotokoWebsocket = new YukiotokoWebSocket();

yukiotokoWebsocket.onOpen = () => {
	console.log('connected to websocket');
};

yukiotokoWebsocket.onClose = () => {
	console.log('disconnected from websocket');
};

yukiotokoWebsocket.onMessage = async (message) => {
	const registeredGuilds = await db.select().from(servers);

	let pingMemebers = false;
	let embed: EmbedBuilder | null = null;

	switch (message.type) {
		case YukiotokoWebSocketEvent.RoomAdded:
			pingMemebers = true;
			embed = createBaseRoomEmbed(message.room).setTitle('New Room Created!').setColor(Color.GREEN);
			break;
		case YukiotokoWebSocketEvent.RoomUpdated:
			if (message.property !== 'players') break;
			embed = createBaseRoomEmbed(message.room).setTitle('New Player has Joined the Room!').setColor(Color.BLUE);
			break;
		case YukiotokoWebSocketEvent.RoomRemoved:
			embed = createBaseRoomEmbed(message.room).setTitle('Room Removed!').setColor(Color.RED);
			break;
	}

	if (!embed) return;

	for (const registeredGuild of registeredGuilds) {
		const guild =
			client.guilds.cache.get(registeredGuild.guildId) ?? (await client.guilds.fetch(registeredGuild.guildId));
		const channel =
			guild.channels.cache.get(registeredGuild.onlineBattleTrackerChannelId) ??
			(await guild.channels.fetch(registeredGuild.onlineBattleTrackerChannelId));

		if (!channel) {
			console.log(`missing channel for ${guild.id}`);
			continue;
		}

		if (!channel.isSendable() || !channel.isTextBased()) {
			console.log(`unable to send message for channel ${channel.id}:${guild.id}`);
			continue;
		}

		await channel
			.send({
				content: pingMemebers ? `<@&${registeredGuild.onlineBattleMentionRoleId}>` : undefined,
				embeds: [embed]
			})
			.catch(() => {
				console.log(`failed to send message for channel ${channel.id}:${guild.id}`);
			});
	}
};

yukiotokoWebsocket.connect(Bun.env.YUKIOTOKO_WEBSOCKET_URL);
