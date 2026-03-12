<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { tick } from 'svelte';
	import type { IngressNode } from '$lib/types';

	let { data, selected }: NodeProps<IngressNode> = $props();

	let cardEl: HTMLElement | null = $state(null);
	let routeRowEls: HTMLElement[] = $state([]);
	let routeHandleTops: string[] = $state([]);

	const displayedRules = $derived(data.rules.slice(0, 3));

	function recalcHandlePositions() {
		if (!cardEl) return;
		// Read all bounding rects in a single batch before computing (avoids layout thrashing)
		const cardRect = cardEl.getBoundingClientRect();
		if (cardRect.height === 0) return;
		const rowRects = displayedRules.map((_rule, i) => routeRowEls[i]?.getBoundingClientRect());

		routeHandleTops = rowRects.map((rowRect) => {
			if (!rowRect) return '50%';
			const centerY = rowRect.top + rowRect.height / 2 - cardRect.top;
			return `${((centerY / cardRect.height) * 100).toFixed(2)}%`;
		});
	}

	$effect(() => {
		void data.rules.length;
		// Use a cancellation flag so a fast rule-change doesn't apply a stale layout
		let cancelled = false;
		tick().then(() => {
			if (!cancelled) recalcHandlePositions();
		});
		return () => {
			cancelled = true;
		};
	});
</script>

<div
	class="node-card"
	class:selected
	style="--accent: #fd8973; --icon-bg: rgba(253,137,115,0.1);"
	bind:this={cardEl}
>
	<!-- Single entry handle on the left side -->
	<Handle type="target" position={Position.Left} />

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
	</div>

	{#if data.rules.length > 0}
		<div class="node-routes">
			{#each displayedRules as rule, i}
				<!-- Route row; the right-side handle is positioned to align with it -->
				<div class="route-row" bind:this={routeRowEls[i]}>
					<span class="route-path">{rule.path}</span>
					<span class="route-port">:{rule.targetPort}</span>
				</div>
				<!-- One source handle per path, on the right side -->
				<Handle
					type="source"
					position={Position.Right}
					id="rule-{i}"
					style="top: {routeHandleTops[i] ?? '50%'}"
				/>
			{/each}
			{#if data.rules.length > 3}
				<div class="route-more">+{data.rules.length - 3} more routes</div>
			{/if}
		</div>
	{:else}
		<!-- Fallback handle when no routes are defined -->
		<Handle type="source" position={Position.Right} />
	{/if}
</div>

<style>
	.node-card {
		min-width: 220px;
		background: #18232c;
		border: 1px solid #243040;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
		transition:
			box-shadow 0.2s,
			border-color 0.2s;
	}
	.node-card.selected {
		border-color: var(--accent);
		box-shadow:
			0 0 0 1px var(--accent),
			0 6px 20px rgba(0, 0, 0, 0.4);
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
		padding: 10px 13px 6px;
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
		padding: 4px 13px 12px;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.route-row {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		font-family: monospace;
		background: rgba(253, 137, 115, 0.06);
		border: 1px solid rgba(253, 137, 115, 0.1);
		/* extra right padding leaves visual room for the right-side handle */
		padding: 3px 18px 3px 7px;
		border-radius: 5px;
	}
	.route-path {
		color: #f0eeeb;
	}
	.route-port {
		color: #fd8973;
	}
	.route-more {
		font-size: 10px;
		color: #4e6272;
		text-align: right;
		padding-top: 2px;
	}
</style>
