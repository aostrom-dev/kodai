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
		database: '#fd8973',
		docker: '#ccd5ae',
		ingress: '#f0eeeb',
		volume: 'rgba(0,58,108,0.9)'
	};
</script>

<div class="dashboard">
<!-- ── Header ────────────────────────────────────────────────────────────── -->
<header class="k-header">
<div class="k-logo">
<div class="k-logo-box">
<svg
xmlns="http://www.w3.org/2000/svg"
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
<div class="k-brand">kodai</div>
<div class="k-brand-sub">Billing</div>
</div>
</div>

<nav class="k-nav">
<a href="/" class="k-nav-item">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
<rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
</svg>
Dashboard
</a>
<a href="/editor" class="k-nav-item">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
</svg>
Editor
</a>
<a href="/billing" class="k-nav-item active">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
</svg>
Billing
</a>
</nav>

<div class="header-right">
<div class="org-selector">
<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
<circle cx="9" cy="7" r="4" />
<path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
<div class="summary-block">
<span class="summary-label">Monthly Total</span>
<span class="summary-value">{formatCost(orgTotal)}</span>
</div>
<div class="summary-divider"></div>
<div class="summary-block">
<span class="summary-label">Projects</span>
<span class="summary-value projects-val">{selectedOrg?.projects.length ?? 0}</span>
</div>
<div class="summary-divider"></div>
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
background: var(--k-black);
color: var(--k-white);
}

.header-right {
flex-shrink: 0;
}

/* ── Org selector ────────────────────────────────────────────────────────── */

.org-selector {
display: flex;
align-items: center;
gap: 7px;
background: var(--k-blue);
border: 1px solid rgba(255, 191, 101, 0.2);
border-radius: 7px;
padding: 6px 10px;
color: var(--k-gray);
}

.org-selector select {
background: transparent;
border: none;
color: var(--k-white);
font-size: 12.5px;
font-family: inherit;
outline: none;
cursor: pointer;
}

/* ── Summary bar ─────────────────────────────────────────────────────────── */

.summary-bar {
display: flex;
align-items: center;
gap: 20px;
padding: 16px 28px;
background: var(--k-blue);
border-bottom: 1px solid rgba(255, 191, 101, 0.12);
flex-wrap: wrap;
}

.summary-block {
display: flex;
flex-direction: column;
gap: 2px;
flex-shrink: 0;
}

.summary-label {
font-size: 10px;
font-weight: 700;
color: var(--k-gray);
text-transform: uppercase;
letter-spacing: 0.08em;
}

.summary-value {
font-size: 22px;
font-weight: 800;
color: var(--k-yellow);
letter-spacing: -0.5px;
font-variant-numeric: tabular-nums;
}

.projects-val {
color: var(--k-white);
}

.summary-divider {
width: 1px;
height: 36px;
background: rgba(255, 191, 101, 0.15);
flex-shrink: 0;
}

.type-breakdown {
display: flex;
align-items: center;
gap: 6px;
flex-wrap: wrap;
}

.type-chip {
display: flex;
align-items: center;
gap: 5px;
padding: 4px 10px;
border-radius: 20px;
background: rgba(0, 0, 0, 0.2);
border: 1px solid rgba(255, 255, 255, 0.07);
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
color: var(--k-gray);
}

.type-cost {
color: var(--k-white);
font-weight: 700;
font-variant-numeric: tabular-nums;
}

/* ── Project list ────────────────────────────────────────────────────────── */

.project-list {
flex: 1;
padding: 20px 28px;
display: flex;
flex-direction: column;
gap: 10px;
overflow-y: auto;
}
</style>
