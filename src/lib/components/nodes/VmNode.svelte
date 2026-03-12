<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import type { VmNode } from '$lib/types';

	let { data, selected }: NodeProps<VmNode> = $props();
</script>

<div class="node-card" class:selected style="--accent: #ffbf65; --icon-bg: rgba(255,191,101,0.12);">
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
				<rect x="2" y="3" width="20" height="14" rx="2" />
				<path d="M8 21h8M12 17v4" />
			</svg>
		</div>
		<div>
			<div class="node-type">Virtual Machine</div>
			<div class="node-label">{data.label}</div>
		</div>
	</div>

	<div class="node-body">
		<div class="node-stat">
			<span class="stat-key">CPU</span>
			<span class="stat-val">{data.cpu} vCPU</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">RAM</span>
			<span class="stat-val">{data.memory} GB</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">OS</span>
			<span class="stat-val">{data.os}</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Region</span>
			<span class="stat-val">{data.region}</span>
		</div>
	</div>

	{#if data.publicIp}
		<div class="node-badge">Public IP</div>
	{/if}

	<Handle type="source" position={Position.Bottom} />
</div>

<style>
	.node-card {
		min-width: 200px;
		background: #1e2a32;
		border: 1px solid #2a3540;
		border-radius: 10px;
		padding: 0;
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
		padding: 8px 14px;
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
	}
	.node-badge {
		margin: 0 14px 10px;
		display: inline-block;
		font-size: 10px;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 4px;
		background: rgba(255, 191, 101, 0.15);
		color: #ffbf65;
		border: 1px solid rgba(255, 191, 101, 0.3);
	}
</style>
