<script lang="ts">
	import type { Project } from '$lib/billing';
	import { environmentTotal, formatCost } from '$lib/billing';
	import EnvironmentRow from './EnvironmentRow.svelte';

	type Props = {
		project: Project;
		total: number;
		orgTotal: number;
	};

	let { project, total, orgTotal }: Props = $props();

	let expanded = $state(true);

	let share = $derived(orgTotal > 0 ? (total / orgTotal) * 100 : 0);
</script>

<div class="project-card">
	<button class="project-header" onclick={() => (expanded = !expanded)}>
		<div class="project-header-left">
			<div class="chevron" class:open={expanded}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="9 18 15 12 9 6" />
				</svg>
			</div>
			<div class="project-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#ffbf65"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
				</svg>
			</div>
			<span class="project-name">{project.name}</span>
			<div class="env-badges">
				{#each project.environments as env}
					<span class="env-badge env-badge--{env.name}">{env.name}</span>
				{/each}
			</div>
		</div>
		<div class="project-header-right">
			<div class="share-bar-wrap">
				<div class="share-bar">
					<div class="share-fill" style="width: {share.toFixed(1)}%"></div>
				</div>
				<span class="share-pct">{share.toFixed(0)}%</span>
			</div>
			<span class="project-total">{formatCost(total)}</span>
			<span class="per-month">/mo</span>
		</div>
	</button>

	{#if expanded}
		<div class="project-body">
			{#each project.environments as env (env.id)}
				<EnvironmentRow {env} envTotal={environmentTotal(env)} projectTotal={total} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.project-card {
		background: #13181b;
		border: 1px solid #1f2c38;
		border-radius: 12px;
		overflow: hidden;
	}

	/* ── Header ──────────────────────────────────────────────────────────────── */

	.project-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 18px;
		background: transparent;
		border: none;
		cursor: pointer;
		gap: 12px;
		transition: background 0.15s;
		text-align: left;
	}

	.project-header:hover {
		background: rgba(255, 255, 255, 0.02);
	}

	.project-header-left {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.chevron {
		color: #5a7a8a;
		transition: transform 0.2s;
		flex-shrink: 0;
		transform: rotate(0deg);
	}

	.chevron.open {
		transform: rotate(90deg);
	}

	.project-icon {
		width: 28px;
		height: 28px;
		border-radius: 7px;
		background: rgba(255, 191, 101, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.project-name {
		font-size: 14px;
		font-weight: 600;
		color: #f0eeeb;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.env-badges {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
	}

	.env-badge {
		font-size: 10px;
		padding: 2px 7px;
		border-radius: 4px;
		font-weight: 500;
		text-transform: lowercase;
	}

	.env-badge--production {
		background: rgba(253, 137, 115, 0.12);
		color: #fd8973;
		border: 1px solid rgba(253, 137, 115, 0.2);
	}

	.env-badge--staging {
		background: rgba(255, 191, 101, 0.1);
		color: #ffbf65;
		border: 1px solid rgba(255, 191, 101, 0.2);
	}

	.env-badge--dev {
		background: rgba(13, 183, 237, 0.1);
		color: #0db7ed;
		border: 1px solid rgba(13, 183, 237, 0.15);
	}

	.env-badge--preview {
		background: rgba(167, 139, 250, 0.1);
		color: #a78bfa;
		border: 1px solid rgba(167, 139, 250, 0.15);
	}

	/* ── Right side ──────────────────────────────────────────────────────────── */

	.project-header-right {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-shrink: 0;
	}

	.share-bar-wrap {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.share-bar {
		width: 72px;
		height: 4px;
		border-radius: 2px;
		background: #1f2c38;
		overflow: hidden;
	}

	.share-fill {
		height: 100%;
		background: linear-gradient(90deg, #ffbf65, #fd8973);
		border-radius: 2px;
	}

	.share-pct {
		font-size: 11px;
		color: #5a7a8a;
		width: 28px;
		text-align: right;
	}

	.project-total {
		font-size: 17px;
		font-weight: 700;
		color: #f0eeeb;
		letter-spacing: -0.2px;
	}

	.per-month {
		font-size: 11px;
		color: #5a7a8a;
		margin-left: -8px;
	}

	/* ── Body ────────────────────────────────────────────────────────────────── */

	.project-body {
		border-top: 1px solid #1a2530;
		display: flex;
		flex-direction: column;
	}
</style>
