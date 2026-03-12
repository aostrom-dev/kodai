<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import type { DatabaseNode } from '$lib/types';

	let { data, selected }: NodeProps<DatabaseNode> = $props();

	// All databases use the brand orange accent
	const engineColors: Record<string, string> = {
		postgres: '#fd8973',
		mysql: '#fd8973',
		mongodb: '#fd8973',
		redis: '#fd8973'
	};

	const engineLabels: Record<string, string> = {
		postgres: 'PostgreSQL',
		mysql: 'MySQL',
		mongodb: 'MongoDB',
		redis: 'Redis'
	};

	let accentColor = $derived(engineColors[data.engine] ?? '#fd8973');
</script>

<div class="node-card" class:selected style="--accent: {accentColor}; --icon-bg: rgba(253,137,115,0.12);">
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
min-width: 210px;
background: var(--k-blue);
border: 1px solid rgba(0, 58, 108, 0.8);
border-top: 3px solid var(--accent);
border-radius: 8px;
overflow: hidden;
box-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
transition:
box-shadow 0.2s,
border-color 0.2s;
}
.node-card.selected {
border-color: var(--accent);
box-shadow:
0 0 0 1px var(--accent),
0 6px 24px rgba(0, 0, 0, 0.5);
}
.node-header {
display: flex;
align-items: center;
gap: 10px;
padding: 10px 12px 9px;
border-bottom: 1px solid rgba(255, 191, 101, 0.07);
background: rgba(0, 0, 0, 0.15);
}
.node-icon {
width: 30px;
height: 30px;
border-radius: 6px;
background: var(--icon-bg);
color: var(--accent);
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
}
.node-type {
font-size: 9px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.1em;
color: var(--accent);
opacity: 0.85;
}
.node-label {
font-size: 13px;
font-weight: 700;
color: #f0eeeb;
margin-top: 2px;
}
.node-body {
padding: 9px 12px 11px;
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
color: #ccd5ae;
opacity: 0.6;
font-weight: 500;
}
.stat-val {
color: #f0eeeb;
font-weight: 600;
}
.node-badge {
margin: 0 12px 10px;
display: inline-block;
font-size: 10px;
font-weight: 700;
padding: 2px 8px;
border-radius: 20px;
background: rgba(255, 191, 101, 0.1);
color: #ffbf65;
border: 1px solid rgba(255, 191, 101, 0.22);
letter-spacing: 0.04em;
}
</style>
