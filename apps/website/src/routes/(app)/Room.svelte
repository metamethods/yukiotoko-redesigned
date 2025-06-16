<script lang="ts">
	import { getGameVersionLabel } from '$lib/labels';
	import RelativeTime from '$lib/RelativeTime.svelte';
	import { currentDate } from '$lib/stores/date';
	import type {
		Room as YukiotokoRoom,
		Player as YukiotokoPlayer
	} from '@yukiotoko-redesigned/yukiotoko';

	const { room }: { room: YukiotokoRoom } = $props();

	const gameVersionLabel = $derived(getGameVersionLabel(room.gameVersion) ?? 'unknown');
	const roomClosed = $derived(
		room.isFinished ||
			room.isArchived ||
			($currentDate.getTime() - new Date(room.lastUpdated).getTime()) / 1000 > 60
	);
</script>

{#snippet playerCard(player: YukiotokoPlayer)}
	<div class="flex flex-col gap-2">
		<div class="flex items-start justify-between">
			<div class="flex flex-col">
				<p class="text-lg font-semibold">{player.username.normalize('NFKC')}</p>

				{#if player.team}
					<p class="text-text/75">{player.team.name.normalize('NFKC')}</p>
				{/if}
			</div>
			<div>
				<p
					class="text-lg font-bold {player.rating >= 1600 ? 'rainbow' : ''} {player.rating >= 1700
						? 'super-rainbow'
						: ''}"
				>
					{(player.rating / 100).toFixed(2)}
				</p>
			</div>
		</div>

		<div class="mt-1 flex gap-2">
			<img
				src="/battle_rank/{player.battleRank}.png"
				alt="Battle Rank {player.battleRank}"
				class="h-8"
			/>
			{#if player.emblem.base !== 0 || player.emblem.medal !== 0}
				<div class="relative flex h-8 items-center justify-center">
					<img
						src="/emblem/base/{player.emblem.base}.png"
						alt="Base {player.emblem.base}"
						class="h-full"
					/>
					<img
						src="/emblem/medal/{player.emblem.medal}.png"
						alt="Medal {player.emblem.medal}"
						class="absolute top-1/2 left-1/2 h-full -translate-x-1/2 -translate-y-1/2 scale-150"
					/>
				</div>
			{/if}
		</div>
	</div>
{/snippet}

<div class="border-outer bg-background relative rounded-xl border">
	<div class="absolute top-0 left-0 flex w-full -translate-y-1/2 items-center justify-between pl-4">
		<div class="bg-background flex items-center gap-2 rounded-xl px-2">
			{#if room.mergedWith}
				<div class="h-2 w-2 rounded-full bg-yellow-300/50"></div>
				<p class="hidden sm:block">Merged</p>
			{:else if !roomClosed}
				{#if !room.isFull}
					<div class="h-2 w-2 rounded-full bg-green-400/50"></div>
					<p class="hidden sm:block">Active</p>
				{:else}
					<div class="bg-secondary/50 h-2 w-2 rounded-full"></div>
					<p class="hidden sm:block">Full</p>
				{/if}
			{:else}
				<div class="h-2 w-2 rounded-full bg-red-400/50"></div>
				<p class="hidden sm:block">Closed</p>
			{/if}
		</div>
		<div class="flex items-center gap-4">
			<img
				src="/battle_rank/{room.battleRank}.png"
				alt="Battle Rank {room.battleRank}"
				class="h-8"
			/>
			<img src="/versions/{gameVersionLabel}.png" alt={gameVersionLabel} class="h-20" />
		</div>
	</div>

	<div class="flex flex-col gap-4 p-4">
		<div class="flex flex-col">
			<p>Game Version - <b>{room.gameVersion}</b></p>
			{#if !roomClosed}
				<p>Time Remaining - <b>{room.timeRemaining}s</b></p>
			{/if}
			<p>Instance - <b>{room.instance}</b></p>
			<RelativeTime date={new Date(room.dateAdded)} />
		</div>

		<div class="flex flex-col gap-2">
			<h3 class="text-xl font-bold">Players ({room.players.length}/4)</h3>

			<div class="flex flex-col gap-2">
				{#each room.players as player, i (i)}
					<div class="bg-outer rounded-lg px-4 py-3">
						{@render playerCard(player)}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes move {
		to {
			background-position: -200% 0;
		}
	}

	.rainbow {
		background: linear-gradient(90deg, #cba6f7 0%, #89b4fa 33%, #a6e3a1 66%, #cba6f7 100%) left/200%
			100%;
		animation: move 6s linear infinite;
		@apply bg-clip-text text-transparent;
	}

	.super-rainbow {
		background: linear-gradient(90deg, #f9e2af 0%, #f38ba8 33%, #94e2d5 66%, #f9e2af 100%) left/200%
			100%;
		animation: move 2s linear infinite;
		@apply bg-clip-text text-transparent;
	}
</style>
