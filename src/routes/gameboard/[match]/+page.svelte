<script lang="ts">
	import { getContext } from 'svelte';

	const username = getContext('username');

	$: console.log(username);
</script>

<h1>Match</h1>
<h4>Shadow</h4>
<p>vs</p>
<h4>Jabami</h4>
