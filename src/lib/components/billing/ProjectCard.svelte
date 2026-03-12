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
background: var(--k-surface);
border: 1px solid var(--k-border);
border-radius: 8px;
overflow: hidden;
transition: border-color 0.2s;
}

.project-card:hover {
border-color: rgba(255, 191, 101, 0.3);
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
transition: background 0.12s;
text-align: left;
}

.project-header:hover {
background: var(--k-yellow-tint);
}

.project-header-left {
display: flex;
align-items: center;
gap: 10px;
min-width: 0;
}

.chevron {
color: var(--k-gray);
transition: transform 0.2s;
flex-shrink: 0;
opacity: 0.6;
transform: rotate(0deg);
}

.chevron.open {
transform: rotate(90deg);
opacity: 1;
}

.project-icon {
width: 28px;
height: 28px;
border-radius: 6px;
background: var(--k-yellow-tint);
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
}

.project-name {
font-size: 14px;
font-weight: 700;
color: var(--k-white);
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
font-weight: 600;
text-transform: lowercase;
}

.env-badge--production {
background: rgba(253, 137, 115, 0.12);
color: #fd8973;
border: 1px solid rgba(253, 137, 115, 0.25);
}

.env-badge--staging {
background: rgba(255, 191, 101, 0.1);
color: #ffbf65;
border: 1px solid rgba(255, 191, 101, 0.22);
}

.env-badge--dev {
background: rgba(204, 213, 174, 0.1);
color: #ccd5ae;
border: 1px solid rgba(204, 213, 174, 0.18);
}

.env-badge--preview {
background: rgba(240, 238, 235, 0.07);
color: #f0eeeb;
border: 1px solid rgba(240, 238, 235, 0.14);
}

/* ── Right side ──────────────────────────────────────────────────────────── */

.project-header-right {
display: flex;
align-items: center;
gap: 14px;
flex-shrink: 0;
}

.share-bar-wrap {
display: flex;
align-items: center;
gap: 7px;
}

.share-bar {
width: 72px;
height: 3px;
border-radius: 2px;
background: var(--k-border);
overflow: hidden;
}

.share-fill {
height: 100%;
background: linear-gradient(90deg, var(--k-yellow), var(--k-orange));
border-radius: 2px;
}

.share-pct {
font-size: 11px;
color: var(--k-gray);
width: 28px;
text-align: right;
opacity: 0.7;
}

.project-total {
font-size: 16px;
font-weight: 800;
color: var(--k-yellow);
letter-spacing: -0.3px;
font-variant-numeric: tabular-nums;
}

.per-month {
font-size: 11px;
color: var(--k-gray);
margin-left: -6px;
opacity: 0.6;
}

/* ── Body ────────────────────────────────────────────────────────────────── */

.project-body {
border-top: 1px solid var(--k-border-subtle);
display: flex;
flex-direction: column;
}
</style>
