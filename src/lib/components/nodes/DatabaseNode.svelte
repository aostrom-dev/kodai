<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import type { DatabaseNode } from '$lib/types';

	let { data, selected }: NodeProps<DatabaseNode> = $props();

	const engineColors: Record<string, string> = {
		postgres: '#336791',
		mysql: '#00758f',
		mongodb: '#4db33d',
		redis: '#d82c20'
	};

	const engineLabels: Record<string, string> = {
		postgres: 'PostgreSQL',
		mysql: 'MySQL',
		mongodb: 'MongoDB',
		redis: 'Redis'
	};

	let accentColor = $derived(engineColors[data.engine] ?? '#fd8973');
</script>

<div class="node-card" class:selected style="--accent: {accentColor}; --icon-bg: {accentColor}1e;">
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
			<div class="node-type">Database</div>
			<div class="node-label">{data.label}</div>
		</div>
	</div>

	<div class="node-body">
		<div class="node-stat">
			<span class="stat-key">Engine</span>
			<span class="stat-val">{engineLabels[data.engine]} {data.version}</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Storage</span>
			<span class="stat-val">{data.storageGb} GB</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Replicas</span>
			<span class="stat-val">{data.replicas}</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Backups</span>
			<span class="stat-val">{data.backupsEnabled ? 'Enabled' : 'Disabled'}</span>
		</div>
	</div>

	<Handle type="source" position={Position.Bottom} />
</div>

<style>
	.node-card {
		min-width: 220px;
		background: #18232c;
		border: 1px solid #243040;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
		transition: box-shadow 0.2s, border-color 0.2s;
	}
	.node-card.selected {
		border-color: var(--accent);
		box-shadow: 0 0 0 1px var(--accent), 0 6px 20px rgba(0, 0, 0, 0.4);
	}
	.node-header {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 11px 13px 9px;
		border-bottom: 1px solid #1f2c38;
		position: relative;
	}
	.node-header::before {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		height: 2px;
		background: var(--accent);
		opacity: 0.7;
	}
	.node-icon {
		width: 32px;
		height: 32px;
		border-radius: 7px;
		background: var(--icon-bg);
		color: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.node-type {
		font-size: 9.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--accent);
	}
	.node-label {
		font-size: 13px;
		font-weight: 600;
		color: #f0eeeb;
		margin-top: 2px;
	}
	.node-body {
		padding: 10px 13px 12px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.node-stat {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 11.5px;
	}
	.stat-key {
		color: #4e6272;
		font-weight: 500;
	}
	.stat-val {
		color: #ccd5ae;
		font-weight: 500;
	}
</style>
