<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import FlowEditor from '$lib/components/FlowEditor.svelte';
</script>

<SvelteFlowProvider>
	<FlowEditor />
</SvelteFlowProvider>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		background: #13181b;
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}
</style>
