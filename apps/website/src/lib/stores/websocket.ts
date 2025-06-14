import { PUBLIC_YUKIOTOKO_WEBSOCKET_URL } from '$env/static/public';
import {
	YukiotokoWebSocket,
	YukiotokoWebSocketEvent,
	type Room
} from '@yukiotoko-redesigned/yukiotoko';
import { writable } from 'svelte/store';

const yukiotokoWebsocket = new YukiotokoWebSocket();

export const connected = writable(false);
export const yukiotokoInstances = writable<{ id: string; name: string }[]>([]);
export const rooms = writable<Record<string, Room>>({});

yukiotokoWebsocket.onOpen = () => {
	connected.set(true);
};

yukiotokoWebsocket.onClose = () => {
	connected.set(false);
};

yukiotokoWebsocket.onMessage = (message) => {
	switch (message.type) {
		case YukiotokoWebSocketEvent.Init:
			yukiotokoInstances.set(message.instances);
			rooms.set(Object.fromEntries(message.rooms.map((room) => [room.id, room])));
			break;
		case YukiotokoWebSocketEvent.RoomAdded:
		case YukiotokoWebSocketEvent.RoomUpdated:
		case YukiotokoWebSocketEvent.RoomRemoved:
			rooms.update((rooms) => {
				if (message.type !== YukiotokoWebSocketEvent.RoomRemoved)
					rooms[message.room.id] = message.room;
				else delete rooms[message.room.id];
				return rooms;
			});
			break;
	}
};

yukiotokoWebsocket.connect(PUBLIC_YUKIOTOKO_WEBSOCKET_URL);
