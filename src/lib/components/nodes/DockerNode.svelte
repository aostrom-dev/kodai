<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import type { DockerNode } from '$lib/types';

	let { data, selected }: NodeProps<DockerNode> = $props();
</script>

<div class="node-card" class:selected style="--accent: #0db7ed; --icon-bg: rgba(13,183,237,0.1);">
	<Handle type="target" position={Position.Top} />

	<div class="node-header">
		<div class="node-icon">
			<!-- Docker whale icon (simplified) -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path
					d="M22 12.5c0-.83-.67-1.5-1.5-1.5H14v-2h-2v2H8V9H6v2H2.5C1.67 11 1 11.67 1 12.5v.5h21v-.5z"
				/>
				<path d="M1 13c0 2.76 4.03 5 9 5s9-2.24 9-5" />
				<rect x="8" y="5" width="2" height="2" />
				<rect x="11" y="5" width="2" height="2" />
				<rect x="14" y="5" width="2" height="2" />
				<rect x="11" y="2" width="2" height="2" />
			</svg>
		</div>
		<div>
			<div class="node-type">Container</div>
			<div class="node-label">{data.label}</div>
		</div>
	</div>

	<div class="node-body">
		<div class="node-stat">
			<span class="stat-key">Image</span>
			<span class="stat-val">{data.image}:{data.tag}</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Replicas</span>
			<span class="stat-val">{data.replicas}</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">CPU Limit</span>
			<span class="stat-val">{data.cpuLimit}</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Memory</span>
			<span class="stat-val">{data.memoryLimit}</span>
		</div>
	</div>

	<Handle type="source" position={Position.Bottom} />
</div>

<style>
	.node-card {
		min-width: 210px;
		background: #1e2a32;
		border: 1px solid #2a3540;
		border-radius: 10px;
		overflow: hidden;
		transition: box-shadow 0.15s;
	}
	.node-card.selected {
		border-color: var(--accent);
		box-shadow: 0 0 0 2px var(--accent);
	}
	.node-header {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px 8px;
		border-bottom: 1px solid #2a3540;
	}
	.node-icon {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		background: var(--icon-bg);
		color: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.node-type {
		font-size: 10px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--accent);
		opacity: 0.85;
	}
	.node-label {
		font-size: 13px;
		font-weight: 600;
		color: #f0eeeb;
		margin-top: 1px;
	}
	.node-body {
		padding: 8px 14px 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.node-stat {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
	}
	.stat-key {
		color: #7a8a94;
	}
	.stat-val {
		color: #ccd5ae;
		font-weight: 500;
		max-width: 130px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
