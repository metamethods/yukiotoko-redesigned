import { YukiotokoWebSocket, YukiotokoWebSocketEvent } from '@yukiotoko-redesigned/yukiotoko';
import indexHtml from '@static/index.html' with { type: 'text' };
import { yukiotokoInstances } from 'instances';

if (globalThis.hot_timeout) clearTimeout(globalThis.hot_timeout);
globalThis.hot_timeout = undefined;

const yukiotokoWebsocket = new YukiotokoWebSocket();

const server = Bun.serve({
	fetch(server, request) {
		if (request.upgrade(server)) return;

		return new Response((indexHtml as string).replace('$WEBUI_URL', Bun.env.WEBUI_URL), {
			headers: {
				'Content-Type': 'text/html'
			}
		});
	},

	websocket: {
		open(websocket) {
			websocket.subscribe('rooms:events');
			websocket.send(
				yukiotokoWebsocket.serialize(YukiotokoWebSocketEvent.Init, {
					instances: yukiotokoInstances.map((instance) => ({
						id: instance.id,
						name: instance.name
					})),
					rooms: yukiotokoInstances.flatMap((instance) => instance.lastRooms.values().toArray())
				})
			);
		},
		message() {},
		close(websocket) {
			websocket.unsubscribe('rooms:events');
		}
	}
});

const pollLoop = async () => {
	for (const yukiotokoInstance of yukiotokoInstances) {
		const changes = await yukiotokoInstance.poll();

		// TOOD: maybe hold off of polling from that instance for a bit
		if (!changes) {
			console.log(`failed to poll from ${yukiotokoInstance.id}`);
			continue;
		}

		for (const addedRoom of changes.added)
			server.publish(
				'rooms:events',
				yukiotokoWebsocket.serialize(YukiotokoWebSocketEvent.RoomAdded, {
					room: addedRoom
				})
			);

		for (const removedRoom of changes.removed)
			server.publish(
				'rooms:events',
				yukiotokoWebsocket.serialize(YukiotokoWebSocketEvent.RoomRemoved, {
					room: removedRoom
				})
			);

		for (const updatedRoom of changes.updated)
			server.publish(
				'rooms:events',
				yukiotokoWebsocket.serialize(YukiotokoWebSocketEvent.RoomUpdated, {
					room: updatedRoom
				})
			);
	}

	setTimeout(pollLoop, 500);
};
setTimeout(pollLoop, 500);

console.log(`running server at ${server.hostname}:${server.port}`);
