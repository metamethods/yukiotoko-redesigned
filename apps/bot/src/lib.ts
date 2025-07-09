import type { Room } from '@yukiotoko-redesigned/yukiotoko';
import { EmbedBuilder } from 'discord.js';

export function createBaseRoomEmbed(room: Room): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle('Yukiotoko Room')
		.setDescription(
			`Instance - ${room.instance}\nVersion - ${room.gameVersion}\nRoom Battle Rank - ${battleRanks[Number(room.battleRank)]}\nRoom Closes <t:${
				~~(Date.now() / 1000) + Number(room.timeRemaining) + 5
			}:R>`
		)
		.addFields(
			room.players.map((player) => ({
				name: `${player.username} (${player.rating}) [${battleRanks[Number(player.battleRank)]}]`,
				value: player.team ? `\`${player.team.name}\`` : `\`No Team\``,
				inline: true
			}))
		)
		.setColor(Color.BLUE);
}

export enum Color {
	RED = 0xf38ba8,
	BLUE = 0x89b4fa,
	GREEN = 0xa6e3a1
}

export const battleRanks = {
	1: 'D3',
	2: 'D2',
	3: 'D1',
	4: 'C3',
	5: 'C2',
	6: 'C1',
	7: 'B3',
	8: 'B2',
	9: 'B1',
	10: 'A3',
	11: 'A2',
	12: 'A1',
	13: 'S3',
	14: 'S2',
	15: 'S1',
	16: 'SS3',
	17: 'SS2',
	18: 'SS1',
	19: '煌3',
	20: '煌2',
	21: '煌1',
	22: 'Elite'
} as Record<number, string>;
