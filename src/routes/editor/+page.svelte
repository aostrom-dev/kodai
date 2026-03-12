<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import FlowEditor from '$lib/components/FlowEditor.svelte';
</script>

<SvelteFlowProvider>
	<FlowEditor />
</SvelteFlowProvider>

<style>
	:global(html, body) {
		height: 100%;
	}
</style>
