<script lang="ts">
	import Pagination from '$lib/Pagination.svelte';
	import { connected, yukiotokoInstances, rooms } from '$lib/stores/websocket';
	import type { Room as YukiotokoRoom } from '@yukiotoko-redesigned/yukiotoko';
	import Room from './Room.svelte';

	let selectedInstance = $state<string | null>('yukiotoko');
	let sortedRooms = $derived(
		Object.values($rooms).sort((a, b) => {
			return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
		})
	);
	let roomPageItems: YukiotokoRoom[] = $state([]);
</script>

<main class="flex w-full flex-col gap-8 pt-8">
	<div class="flex flex-col gap-4">
		<div class="flex flex-col">
			<h2 class="text-2xl font-bold">Yukiotoko Instances</h2>
			<p>Choose an instance below to view rooms hosted on that specific instance</p>
		</div>

		<div class="flex flex-col justify-between gap-4 sm:flex-row">
			<div class="flex flex-wrap gap-4">
				{#each $yukiotokoInstances as yukiotokoInstance}
					<button
						onclick={() => (selectedInstance = yukiotokoInstance.id)}
						class="button {selectedInstance == yukiotokoInstance.id ? 'primary' : 'tertiary'}"
					>
						{yukiotokoInstance.name}
					</button>
				{/each}

				<button
					onclick={() => (selectedInstance = null)}
					class="button text-text/75 hover:text-text transition-colors"
				>
					Show All
				</button>
			</div>

			<div
				class="border-outer tooltip-container flex items-center gap-2 rounded-lg border px-4 py-2"
			>
				<p class="tooltip w-sm">
					{#if $connected}
						You're receiving live updates! newly created, updated, or removed rooms will appear in
						real time
					{:else}
						Live room updates are paused — changes won't appear until you reconnect
					{/if}
				</p>
				<div class="h-2 w-2 rounded-full {$connected ? 'bg-green-400/50' : 'bg-red-400/50'}"></div>
				<p>{$connected ? 'Connected' : 'Disconnected'}</p>
			</div>
		</div>
	</div>

	<Pagination items={sortedRooms} itemsPerPage={20} bind:pageItems={roomPageItems} />

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each roomPageItems as room}
			{#if room.instance === selectedInstance || selectedInstance === null}
				<Room {room} />
			{/if}
		{/each}
	</div>
</main>
