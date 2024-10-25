<script lang="ts">
	import { getContext } from 'svelte';

	const username = getContext('username');

	$: console.log(username);
</script>