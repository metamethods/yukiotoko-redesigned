import type { APIRoom, Player, Room } from '@yukiotoko-redesigned/yukiotoko';
import { semver } from 'bun';

interface RoomChange {
	added: Room[];
	removed: Room[];
	updated: {
		property: keyof Room;
		room: Room;
	}[];
}

interface FetchedRooms {
	active: APIRoom[];
	archived: APIRoom[];
}

export class YukiotokoInstance {
	public lastRooms: Map<string, Room> = new Map();

	constructor(
		public id: string,
		public name: string,
		private baseApiUrl: string,
		private apiToken: string
	) {}

	private async fetchRooms(): Promise<FetchedRooms | null> {
		try {
			const activeRoomsResponse = await fetch(`${this.baseApiUrl}/api/active`, {
				headers: {
					Authorization: this.apiToken
				}
			});

			const archivedRoomsResponse = await fetch(`${this.baseApiUrl}/api/history`, {
				headers: {
					Authorization: this.apiToken
				}
			});

			return {
				active: (await activeRoomsResponse.json()) as APIRoom[],
				archived: (await archivedRoomsResponse.json()) as APIRoom[]
			};
		} catch {
			return null;
		}
	}

	private apiRoomToRoom(apiRoom: APIRoom, dateAdded: string, archived?: boolean): Room {
		return {
			id: apiRoom.id,
			instance: this.id,
			gameVersion: apiRoom.dataVersion,
			battleRank: apiRoom.roomRanking,
			timeRemaining: apiRoom.restMSec,
			players: apiRoom.matchingMemberInfoList.map(
				(apiPlayer) =>
					({
						username: apiPlayer.userName,
						rating: Number(apiPlayer.playerRating),
						battleRank: Number(apiPlayer.battleRankId),
						emblem: {
							medal: Number(apiPlayer.emblemMedal),
							base: Number(apiPlayer.emblemBase)
						},
						team:
							apiPlayer.isJoinTeam === 'true'
								? {
										name: apiPlayer.teamName
									}
								: undefined
					}) satisfies Player
			),
			allowAnybody: apiRoom.allowAnybody,
			isFull: apiRoom.isFull,
			isFinished: apiRoom.isFinished,
			isArchived: archived ?? false,
			mergedWith: apiRoom.mergedRoom,
			lastUpdated: apiRoom.updatedAt,
			dateAdded
		};
	}

	public async getRooms(): Promise<Room[] | null> {
		const apiRooms = await this.fetchRooms();
		const rooms: Room[] = [];

		if (!apiRooms) return null;

		apiRooms.active
			.filter((apiRoom) => semver.order(apiRoom.dataVersion, Bun.env.MAX_DATA_VERSION) !== 1)
			.forEach((apiRoom) =>
				rooms.push(this.apiRoomToRoom(apiRoom, this.lastRooms.get(apiRoom.id)?.dateAdded ?? new Date().toISOString()))
			);
		apiRooms.archived
			.filter((apiRoom) => semver.order(apiRoom.dataVersion, Bun.env.MAX_DATA_VERSION) !== 1)
			.forEach((apiRoom) =>
				rooms.push(
					this.apiRoomToRoom(apiRoom, this.lastRooms.get(apiRoom.id)?.dateAdded ?? new Date().toISOString(), true)
				)
			);

		return rooms;
	}

	public async poll(): Promise<RoomChange | null> {
		const rooms = await this.getRooms();

		if (!rooms) return null;

		const roomsMap = new Map(rooms.map((room) => [room.id, room]));

		const changes: RoomChange = {
			added: [],
			removed: [],
			updated: []
		};

		for (const [id, room] of roomsMap) {
			const oldRoom = this.lastRooms.get(id);
			if (!oldRoom) {
				changes.added.push(room);
			} else if (room.lastUpdated !== oldRoom.lastUpdated) {
				for (const key in room) {
					if (JSON.stringify(room[key as keyof Room]) == JSON.stringify(oldRoom[key as keyof Room])) continue;
					changes.updated.push({
						property: key as keyof Room,
						room: room
					});
				}
			}
		}

		for (const [id, oldRoom] of this.lastRooms) {
			if (!roomsMap.has(id)) {
				changes.removed.push(oldRoom);
			}
		}

		this.lastRooms = roomsMap;

		return changes;
	}
}
