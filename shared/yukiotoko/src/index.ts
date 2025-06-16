import { WebSocketProtocol } from '@yukiotoko-redesigned/ws-protocol';

export interface APIPlayer {
	errCnt: string;
	userId: string;
	placeId: string;
	skillId: string;
	skillLv: string;
	clientId?: unknown;
	joinTime: string;
	reginId: string;
	teamName: string;
	teamRank: string;
	trophyId: string;
	userName: string;
	messageId: string;
	emblemBase: string;
	hostErrCnt: string;
	isJoinTeam: string;
	romVersion: string;
	avatarEquip: {
		backID: string;
		faceID: string;
		headID: string;
		itemID: string;
		skinID: string;
		wearID: string;
		frontID: string;
	};
	characterId: string;
	dataVersion: string;
	emblemMedal: string;
	optRatingId: string;
	battleIconId: string;
	battleRankId: string;
	playerRating: string;
	battleIconNum: string;
	bestRatingAvg: string;
	characterRank: string;
	avatarEffectID: string;
	genreGraphList: { genreId: string; musicCount: string }[];
	giftMusicIdList: { musicId: string }[];
	skillIdForChara: string;
	battleCorrection: string;
	ratingEffectColorId: string;
}

export interface APIRoom {
	id: string;
	userId: string;
	roomId: number;
	dataVersion: string;
	romVersion: string;
	roomRanking: number;
	restMSec: number;
	isFull: boolean;
	matchingMemberInfoList: APIPlayer[];
	isFinished: boolean;
	allowAnybody: boolean;
	updatedAt: string;
	mergedRoom?: number;
}

export interface Player {
	username: string;
	rating: number;
	battleRank: number;
	emblem: {
		medal: number;
		base: number;
	};
	team?: {
		name: string;
	};
}

export interface Room {
	id: string;
	instance: string;
	gameVersion: string;
	battleRank: number;
	timeRemaining: number;
	players: Player[];
	allowAnybody: boolean;
	isFull: boolean;
	isFinished: boolean;
	isArchived: boolean;
	mergedWith?: number;
	lastUpdated: string;
}

export enum YukiotokoWebSocketEvent {
	Init,
	RoomAdded,
	RoomUpdated,
	RoomRemoved
}

export type YukiotokoWebSocketData = {
	[YukiotokoWebSocketEvent.Init]: {
		instances: {
			id: string;
			name: string;
		}[];
		rooms: Room[];
	};
	[YukiotokoWebSocketEvent.RoomAdded]: {
		room: Room;
	};
	[YukiotokoWebSocketEvent.RoomUpdated]: {
		room: Room;
	};
	[YukiotokoWebSocketEvent.RoomRemoved]: {
		room: Room;
	};
};

export class YukiotokoWebSocket extends WebSocketProtocol<YukiotokoWebSocketEvent, YukiotokoWebSocketData> {
	constructor() {
		super();
	}
}
