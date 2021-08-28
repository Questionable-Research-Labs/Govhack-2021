<div>
	<slot />
</div>

<style lang="scss">
	div {
		display: flex;
		flex-flow: column;
		background: #333;
		border-radius: 0.5em;
		font-size: 0.75rem;
		color: white;
		padding: 0.75rem;
		width: fit-content;
		margin-top: 1em;
		margin-right: 1em;
		
	}

	@media (max-width: 770px) {
		div {
			border-radius: 0 0 0 0.75rem;
			margin-top: 0;
			margin-right: 0;
			padding: 0.4rem;
			background: rgba(0, 0, 0, 0.75);
		}
	}
</style>
