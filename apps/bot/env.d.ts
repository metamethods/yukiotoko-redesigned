import type { Client } from 'discord.js';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;

			BOT_TOKEN: string;

			YUKIOTOKO_WEBSOCKET_URL: string;
		}
	}
}

export {};
