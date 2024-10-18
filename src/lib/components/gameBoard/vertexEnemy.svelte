<script lang="ts">
  export let color = 'rgb(116, 21, 32)';
  export let inBattlefieldEnemy: boolean = false;

  let visited: boolean = false
  let hovering: boolean = false
	let neighbours: number[][] = []

  $: if (hovering) {
		inBattlefieldEnemy = true;
	}
</script>

<button
	class="node"
	on:click={() => visited = true}
	on:mouseover={() => (hovering = true)}
	on:mouseout={() => (hovering = false)}
	on:focus
	on:blur
>
	{#if inBattlefieldEnemy && hovering && !visited}
		<i class="fa-solid fa-circle-dot" style={`color: ${color}`}></i>
  {:else if visited}
    <i class="fa-regular fa-circle-dot" style={`color: grey`}></i>
	{:else}
		<i class="fa-regular fa-circle-dot"></i>
	{/if}
</button>
