<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { tick } from 'svelte';
	import type { DockerNode } from '$lib/types';

	let { data, selected }: NodeProps<DockerNode> = $props();

	let cardEl: HTMLElement | null = $state(null);
	let portRowEls: HTMLElement[] = $state([]);
	let portHandleTops: string[] = $state([]);

	function recalcHandlePositions() {
		if (!cardEl) return;
		// Read all bounding rects in a single batch before computing (avoids layout thrashing)
		const cardRect = cardEl.getBoundingClientRect();
		if (cardRect.height === 0) return;
		const rowRects = data.ports.map((_port, i) => portRowEls[i]?.getBoundingClientRect());

		portHandleTops = rowRects.map((rowRect) => {
			if (!rowRect) return '50%';
			const centerY = rowRect.top + rowRect.height / 2 - cardRect.top;
			return `${((centerY / cardRect.height) * 100).toFixed(2)}%`;
		});
	}

	$effect(() => {
		void data.ports.length;
		// Use a cancellation flag so a fast port-change doesn't apply a stale layout
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
	style="--accent: #0db7ed; --icon-bg: rgba(13,183,237,0.1);"
	bind:this={cardEl}
>
	<!-- Any number of incoming connections accepted on the left -->
	<Handle type="target" position={Position.Left} />

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

	<!-- Ports section: one row per exposed port, each with a right-side source handle -->
	{#if data.ports.length > 0}
		<div class="node-ports">
			{#each data.ports as port, i}
				<div class="port-row" bind:this={portRowEls[i]}>
					<span class="port-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="4" />
							<path
								d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
							/>
						</svg>
					</span>
					<span class="port-label">:{port.container}</span>
				</div>
				<!-- One source handle per exposed port on the right side -->
				<Handle
					type="source"
					position={Position.Right}
					id="port-{i}"
					style="top: {portHandleTops[i] ?? '50%'}"
				/>
			{/each}
		</div>
	{:else}
		<!-- Fallback handle when no ports are defined -->
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
		padding: 10px 13px 8px;
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
		max-width: 130px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.node-ports {
		border-top: 1px solid #1f2c38;
		padding: 4px 13px 10px;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.port-row {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		font-family: monospace;
		background: rgba(13, 183, 237, 0.06);
		border: 1px solid rgba(13, 183, 237, 0.12);
		/* extra right padding leaves visual room for the right-side handle */
		padding: 3px 18px 3px 7px;
		border-radius: 5px;
	}
	.port-icon {
		color: var(--accent);
		opacity: 0.7;
		display: flex;
		align-items: center;
	}
	.port-label {
		color: #0db7ed;
		font-weight: 600;
	}
</style>
