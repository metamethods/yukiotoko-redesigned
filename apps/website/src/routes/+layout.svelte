<script lang="ts">
	import '@fontsource-variable/montserrat';
	import '@fontsource-variable/plus-jakarta-sans';
	import '../app.css';

	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen w-full">
	<div class="border-outer absolute top-0 h-16 w-full border-b">
		<div class="mx-auto h-full w-full max-w-screen-xl px-8">
			<Header />
		</div>
	</div>

	<div class="mx-auto w-full max-w-screen-xl px-8 pt-16 pb-8">
		{@render children()}
	</div>
</div>

<div class="border-outer w-full border-t">
	<div class="mx-auto w-full max-w-screen-xl p-8">
		<Footer />
	</div>
</div>

<svelte:head>
	<title>Yukiotoko Redesigned</title>
</svelte:head>
