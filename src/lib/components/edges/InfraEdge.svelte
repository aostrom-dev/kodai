<script lang="ts">
	import { BaseEdge, EdgeLabel, getSmoothStepPath, type EdgeProps } from '@xyflow/svelte';

	let {
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		markerEnd,
		style
	}: EdgeProps = $props();

	let [edgePath, labelX, labelY] = $derived(
		getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
	);
</script>

<BaseEdge {id} path={edgePath} {markerEnd} {style} />
<EdgeLabel x={labelX} y={labelY}>
	<button
		class="delete-btn nodrag nopan"
		title="Remove connection"
		onclick={(e) => {
			e.stopPropagation();
			const event = new CustomEvent('deleteEdge', { bubbles: true, detail: { id } });
			(e.currentTarget as HTMLElement).dispatchEvent(event);
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="10"
			height="10"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	</button>
</EdgeLabel>

<style>
	.delete-btn {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #13181b;
		border: 1px solid #2a3540;
		color: #7a8a94;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		opacity: 0;
		transition:
			opacity 0.15s,
			color 0.15s,
			border-color 0.15s;
	}
	:global(.react-flow__edge:hover) .delete-btn,
	:global(.react-flow__edge.selected) .delete-btn {
		opacity: 1;
	}
	.delete-btn:hover {
		color: #fd8973;
		border-color: #fd8973;
		background: rgba(253, 137, 115, 0.1);
	}
</style>
