<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import type { IngressNode } from '$lib/types';

	let { data, selected }: NodeProps<IngressNode> = $props();
</script>

<div class="node-card" class:selected style="--accent: #fd8973; --icon-bg: rgba(253,137,115,0.1);">
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
				<circle cx="12" cy="12" r="10" />
				<path
					d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
				/>
			</svg>
		</div>
		<div>
			<div class="node-type">Ingress</div>
			<div class="node-label">{data.label}</div>
		</div>
	</div>

	<div class="node-body">
		<div class="node-stat">
			<span class="stat-key">Domain</span>
			<span class="stat-val domain">{data.domain}</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">TLS</span>
			<span class="stat-val" class:tls-on={data.tls} class:tls-off={!data.tls}>
				{data.tls ? 'HTTPS' : 'HTTP only'}
			</span>
		</div>
		<div class="node-stat">
			<span class="stat-key">Routes</span>
			<span class="stat-val">{data.rules.length}</span>
		</div>
	</div>

	{#if data.rules.length > 0}
		<div class="node-routes">
			{#each data.rules.slice(0, 3) as rule}
				<div class="route-row">
					<span class="route-path">{rule.path}</span>
					<span class="route-port">:{rule.targetPort}</span>
				</div>
			{/each}
			{#if data.rules.length > 3}
				<div class="route-more">+{data.rules.length - 3} more routes</div>
			{/if}
		</div>
	{/if}

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
		padding: 8px 14px 6px;
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
	.domain {
		font-family: monospace;
		font-size: 11px;
		color: #fd8973;
	}
	.tls-on {
		color: #4ade80;
	}
	.tls-off {
		color: #f87171;
	}
	.node-routes {
		padding: 0 14px 10px;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.route-row {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		font-family: monospace;
		background: rgba(253, 137, 115, 0.07);
		padding: 2px 6px;
		border-radius: 4px;
	}
	.route-path {
		color: #f0eeeb;
	}
	.route-port {
		color: #fd8973;
	}
	.route-more {
		font-size: 10px;
		color: #7a8a94;
		text-align: right;
		padding-top: 2px;
	}
</style>
