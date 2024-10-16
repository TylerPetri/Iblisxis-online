<script lang="ts">
	import logo from '$lib/assets/favicon.png';
</script>

<div class="wrapper">
	<div class="container">
		<img src={logo} alt="Battleship" />
		<h1 class='noto-serif-kr-title'>곧 출시 예정</h1>
	</div>
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200..900&display=swap');

	.wrapper {
		height: 100vh;
		width: 100vw;
		background: black;
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgb(116, 21, 32);
	}

	// <uniquifier>: Use a unique and descriptive class name
	// <weight>: Use a value from 200 to 900

	.noto-serif-kr-title {
		font-family: 'Noto Serif KR', serif;
		font-optical-sizing: auto;
		font-weight: 400;
		font-style: normal;
	}

	h1 {
		width: max-content;
		margin: 25px auto;
		font-size: 66px;
	}
</style>
