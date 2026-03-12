<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import type { VolumeNode } from '$lib/types';

	let { data, selected }: NodeProps<VolumeNode> = $props();
</script>

<div class="node-card" class:selected style="--accent: #a78bfa; --icon-bg: rgba(167,139,250,0.12);">
	<Handle type="target" position={Position.Top} />

	<div class="node-header">
		<div class="node-icon">
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
				<ellipse cx="12" cy="5" rx="9" ry="3" />
				<path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
				<path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
			</svg>
		</div>
		<div>
			<div class="node-type">Volume</div>
			<div class="node-label">{data.label}</div>
		</div>
	</div>

	<div class="node-body">
		<div class="node-stat">
			<span class="stat-key">Size</span>
			<span class="stat-val">{data.sizeGb} GB</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Type</span>
			<span class="stat-val">{data.type}</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Mount</span>
			<span class="stat-val">{data.mountPath}</span>
		</div>
	</div>

	<Handle type="source" position={Position.Bottom} />
</div>

<style>
	.node-card {
		min-width: 190px;
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
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
