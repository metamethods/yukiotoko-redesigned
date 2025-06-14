<script lang="ts">
	import { currentDate } from './stores/date';

	let { date }: { date: Date } = $props();

	let difference = $derived($currentDate.getTime() / 1000 - date.getTime() / 1000);
	let deltaSeconds = $derived(~~(difference % 60));
	let deltaMinutes = $derived(~~(difference / 60) % 60);
	let deltaHours = $derived(~~(difference / 3600) % 24);
	let deltaDays = $derived(~~(difference / 86400));
</script>

<div class="tooltip-container underline decoration-dotted">
	<p class="tooltip left-0 translate-x-0">{date.toLocaleString()}</p>
	<p>
		about
		{#if deltaDays > 0}
			<span>{deltaDays}d</span>
		{:else if deltaHours > 0}
			<span>{deltaHours}h</span>
		{:else if deltaMinutes > 0}
			<span>{deltaMinutes}m</span>
		{:else}
			<span>{deltaSeconds}s</span>
		{/if}
		ago
	</p>
</div>
