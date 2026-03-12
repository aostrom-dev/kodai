<script lang="ts">
	import { untrack } from 'svelte';
	import type { Organization } from '$lib/billing';
	import { organizationTotal, projectTotal, environmentTotal, formatCost } from '$lib/billing';
	import ProjectCard from './ProjectCard.svelte';

	type Props = {
		organizations: Organization[];
	};

	let { organizations }: Props = $props();

	let selectedOrgId = $state(untrack(() => organizations[0]?.id ?? ''));

	let selectedOrg = $derived(organizations.find((o) => o.id === selectedOrgId) ?? organizations[0]);
	let orgTotal = $derived(selectedOrg ? organizationTotal(selectedOrg) : 0);

	// Aggregate: total per resource type across the whole org
	type TypeTotals = Record<string, number>;
	let typeTotals = $derived.by<TypeTotals>(() => {
		const totals: TypeTotals = {};
		if (!selectedOrg) return totals;
		for (const project of selectedOrg.projects) {
			for (const env of project.environments) {
				for (const r of env.resources) {
					totals[r.type] = (totals[r.type] ?? 0) + r.unitCostPerMonth * r.quantity;
				}
			}
		}
		return totals;
	});

	const typeLabels: Record<string, string> = {
		vm: 'Virtual Machines',
		database: 'Databases',
		docker: 'Containers',
		ingress: 'Ingress',
		volume: 'Volumes'
	};

	const typeColors: Record<string, string> = {
		vm: '#ffbf65',
		database: '#4db33d',
		docker: '#0db7ed',
		ingress: '#fd8973',
		volume: '#a78bfa'
	};
</script>

<div class="dashboard">
	<!-- ── Header ────────────────────────────────────────────────────────────── -->
	<header class="dash-header">
		<div class="header-left">
			<div class="header-logo">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#ffbf65"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="2" y="2" width="8" height="8" rx="1.5" />
					<rect x="14" y="2" width="8" height="8" rx="1.5" />
					<rect x="2" y="14" width="8" height="8" rx="1.5" />
					<rect x="14" y="14" width="8" height="8" rx="1.5" />
				</svg>
			</div>
			<div>
				<div class="header-brand">kodai</div>
				<div class="header-subtitle">Billing Dashboard</div>
			</div>
		</div>

		<div class="header-center">
			<nav class="nav-tabs">
				<a href="/" class="nav-tab">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="3" width="7" height="7" />
						<rect x="14" y="3" width="7" height="7" />
						<rect x="3" y="14" width="7" height="7" />
						<rect x="14" y="14" width="7" height="7" />
					</svg>
					Dashboard
				</a>
				<a href="/editor" class="nav-tab">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polygon
							points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
						/>
					</svg>
					Editor
				</a>
				<a href="/billing" class="nav-tab active">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="12" y1="1" x2="12" y2="23" />
						<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
					</svg>
					Billing
				</a>
			</nav>
		</div>

		<div class="header-right">
			<div class="org-selector">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#ccd5ae"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
				<select bind:value={selectedOrgId} aria-label="Select organization">
					{#each organizations as org}
						<option value={org.id}>{org.name}</option>
					{/each}
				</select>
			</div>
		</div>
	</header>

	<!-- ── Summary bar ───────────────────────────────────────────────────────── -->
	<div class="summary-bar">
		<div class="summary-item total">
			<span class="summary-label">Monthly Total</span>
			<span class="summary-value">{formatCost(orgTotal)}</span>
		</div>
		<div class="summary-sep"></div>
		<div class="summary-item">
			<span class="summary-label">Projects</span>
			<span class="summary-value secondary">{selectedOrg?.projects.length ?? 0}</span>
		</div>
		<div class="summary-sep"></div>
		<div class="type-breakdown">
			{#each Object.entries(typeTotals) as [type, cost]}
				<div class="type-chip" style="--chip-color: {typeColors[type] ?? '#ccd5ae'}">
					<span class="type-dot"></span>
					<span class="type-name">{typeLabels[type] ?? type}</span>
					<span class="type-cost">{formatCost(cost)}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- ── Project list ───────────────────────────────────────────────────────── -->
	<main class="project-list">
		{#if selectedOrg}
			{#each selectedOrg.projects as project (project.id)}
				<ProjectCard {project} total={projectTotal(project)} {orgTotal} />
			{/each}
		{/if}
	</main>
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: #0f171e;
		color: #f0eeeb;
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	/* ── Header ──────────────────────────────────────────────────────────────── */

	.dash-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24px;
		height: 56px;
		background: #0f171e;
		border-bottom: 1px solid #1f2c38;
		gap: 16px;
		flex-shrink: 0;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.header-logo {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: rgba(255, 191, 101, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.header-brand {
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.5px;
		color: #f0eeeb;
	}

	.header-subtitle {
		font-size: 10px;
		color: #5a7a8a;
		letter-spacing: 0.3px;
		text-transform: uppercase;
	}

	.header-center {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.header-right {
		flex-shrink: 0;
	}

	/* ── Nav tabs ────────────────────────────────────────────────────────────── */

	.nav-tabs {
		display: flex;
		align-items: center;
		gap: 4px;
		background: #13181b;
		border: 1px solid #1f2c38;
		border-radius: 8px;
		padding: 3px;
	}

	.nav-tab {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 5px 12px;
		border-radius: 6px;
		font-size: 12.5px;
		font-weight: 500;
		color: #5a7a8a;
		text-decoration: none;
		transition: all 0.15s;
	}

	.nav-tab:hover {
		color: #ccd5ae;
		background: #1a2530;
	}

	.nav-tab.active {
		color: #ffbf65;
		background: rgba(255, 191, 101, 0.1);
	}

	/* ── Org selector ────────────────────────────────────────────────────────── */

	.org-selector {
		display: flex;
		align-items: center;
		gap: 7px;
		background: #13181b;
		border: 1px solid #1f2c38;
		border-radius: 8px;
		padding: 5px 10px;
	}

	.org-selector select {
		background: transparent;
		border: none;
		color: #f0eeeb;
		font-size: 13px;
		font-family: inherit;
		outline: none;
		cursor: pointer;
	}

	/* ── Summary bar ─────────────────────────────────────────────────────────── */

	.summary-bar {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 14px 24px;
		background: #13181b;
		border-bottom: 1px solid #1f2c38;
		flex-wrap: wrap;
	}

	.summary-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex-shrink: 0;
	}

	.summary-label {
		font-size: 10px;
		color: #5a7a8a;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.summary-value {
		font-size: 20px;
		font-weight: 700;
		color: #ffbf65;
		letter-spacing: -0.3px;
	}

	.summary-value.secondary {
		color: #f0eeeb;
	}

	.summary-sep {
		width: 1px;
		height: 32px;
		background: #1f2c38;
		flex-shrink: 0;
	}

	.type-breakdown {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.type-chip {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 4px 10px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		font-size: 11.5px;
	}

	.type-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--chip-color);
		flex-shrink: 0;
	}

	.type-name {
		color: #ccd5ae;
	}

	.type-cost {
		color: #f0eeeb;
		font-weight: 600;
	}

	/* ── Project list ────────────────────────────────────────────────────────── */

	.project-list {
		flex: 1;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		overflow-y: auto;
	}
</style>
