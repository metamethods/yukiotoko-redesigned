<script lang="ts" generics="T">
	let {
		items,
		itemsPerPage,
		pageItems = $bindable(),
		currentPage = 0
	}: {
		items: Array<T>;
		itemsPerPage: number;
		pageItems: Array<T>;
		currentPage?: number;
	} = $props();

	let pageIndexStart = $derived(currentPage * itemsPerPage);
	let pageIndexEnd = $derived(Math.min(itemsPerPage * (currentPage + 1), items.length));

	$effect(() => {
		currentPage = Math.min(Math.max(currentPage, 0), ~~(items.length / itemsPerPage));
		pageItems = items.slice(pageIndexStart, pageIndexEnd);
	});
</script>

<div class="flex flex-col gap-2">
	<p></p>

	<div class="flex flex-wrap gap-2">
		<button onclick={() => currentPage--} class="button tertiary">Back</button>

		{#each { length: ~~(items.length / itemsPerPage) + 1 } as _, i}
			<button
				onclick={() => (currentPage = i)}
				class="button {i == currentPage
					? 'bg-primary text-background'
					: 'hover:bg-outer'} rounded-lg px-4 py-2 transition-colors">{i + 1}</button
			>
		{/each}

		<button onclick={() => currentPage++} class="button tertiary">Next</button>
	</div>
</div>
