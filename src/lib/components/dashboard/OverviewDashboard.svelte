<script lang="ts">
	import { organizations } from '$lib/billing-data';
	import {
		organizationTotal,
		projectTotal,
		environmentTotal,
		resourceTotal,
		formatCost
	} from '$lib/billing';
	import type { Organization } from '$lib/billing';

	import StatCard from './StatCard.svelte';
	import AreaChart from '$lib/components/charts/AreaChart.svelte';
	import HorizontalBarChart from '$lib/components/charts/HorizontalBarChart.svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';

	// ── Aggregate metrics ────────────────────────────────────────────────────

	const totalCost = organizations.reduce((s, o) => s + organizationTotal(o), 0);

	const allProjects = organizations.flatMap((o) => o.projects);
	const allEnvironments = allProjects.flatMap((p) => p.environments);
	const allResources = allEnvironments.flatMap((e) => e.resources);

	const totalResourceCount = allResources.reduce((s, r) => s + r.quantity, 0);

	// ── Monthly trend (mock, 6-month ramp-up to current total) ──────────────

	const monthlyTrend = [
		{ label: 'Oct', value: Math.round(totalCost * 0.64) },
		{ label: 'Nov', value: Math.round(totalCost * 0.72) },
		{ label: 'Dec', value: Math.round(totalCost * 0.8) },
		{ label: 'Jan', value: Math.round(totalCost * 0.88) },
		{ label: 'Feb', value: Math.round(totalCost * 0.95) },
		{ label: 'Mar', value: totalCost }
	];

	// ── Cost by project (bar chart) ──────────────────────────────────────────

	// Brand-palette-only colors: yellow, orange, gray, white, blue
	const projectColors = ['#ffbf65', '#fd8973', '#ccd5ae', '#f0eeeb', 'rgba(0,58,108,0.85)'];

	const projectBarData = allProjects
		.map((p, i) => ({
			label: p.name,
			value: projectTotal(p),
			color: projectColors[i % projectColors.length]
		}))
		.sort((a, b) => b.value - a.value);

	// ── Resource type breakdown (donut chart) ───────────────────────────────

	const typeAccum: Record<string, number> = {};
	for (const r of allResources) {
		typeAccum[r.type] = (typeAccum[r.type] ?? 0) + resourceTotal(r);
	}

	const typeLabels: Record<string, string> = {
		vm: 'Virtual Machines',
		database: 'Databases',
		docker: 'Containers',
		ingress: 'Ingress',
		volume: 'Volumes'
	};

	// Brand-palette-only type colors
	const typeColors: Record<string, string> = {
		vm: '#ffbf65',
		database: '#fd8973',
		docker: '#ccd5ae',
		ingress: '#f0eeeb',
		volume: 'rgba(0,58,108,0.9)'
	};

	const donutData = Object.entries(typeAccum)
		.map(([type, value]) => ({
			label: typeLabels[type] ?? type,
			value,
			color: typeColors[type] ?? '#ccd5ae'
		}))
		.sort((a, b) => b.value - a.value);

	// ── Top projects table ───────────────────────────────────────────────────

	const topProjects = allProjects
		.map((p) => {
			const org = organizations.find((o) => o.projects.includes(p));
			return {
				name: p.name,
				org: org?.name ?? '',
				envCount: p.environments.length,
				cost: projectTotal(p)
			};
		})
		.sort((a, b) => b.cost - a.cost);
</script>

<div class="overview">
	<!-- ── Header ──────────────────────────────────────────────────────────── -->
	<header class="k-header">
		<div class="k-logo">
			<div class="k-logo-box">
				<svg
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
				<div class="k-brand-sub">Platform Overview</div>
			</div>
		</div>

		<nav class="k-nav">
			<a href="/" class="k-nav-item active">
				<svg
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
			<a href="/editor" class="k-nav-item">
				<svg
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
			<a href="/billing" class="k-nav-item">
				<svg
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
	</header>

	<!-- ── Hero bar ─────────────────────────────────────────────────────────── -->
	<div class="hero-bar">
		<div class="hero-content">
			<div class="hero-label">Total Monthly Infrastructure Cost</div>
			<div class="hero-value">{formatCost(totalCost)}</div>
			<div class="hero-sub">{organizations.length} organizations · {allProjects.length} projects</div>
		</div>
		<div class="trend-badge">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
				<polyline points="17 6 23 6 23 12" />
			</svg>
			+21% in 6 months
		</div>
	</div>

	<!-- ── KPI cards ───────────────────────────────────────────────────────── -->
	<div class="stats-grid">
		<StatCard
			label="Monthly Cost"
			value={formatCost(totalCost)}
			sub="Across all organizations"
			icon="cost"
			accent="#ffbf65"
		/>
		<StatCard
			label="Projects"
			value={String(allProjects.length)}
			sub={`${organizations.length} organizations`}
			icon="projects"
			accent="#fd8973"
		/>
		<StatCard
			label="Environments"
			value={String(allEnvironments.length)}
			sub={`${allProjects.length} projects`}
			icon="environments"
			accent="#ccd5ae"
		/>
		<StatCard
			label="Resources"
			value={String(totalResourceCount)}
			sub={`${allResources.length} resource types`}
			icon="resources"
			accent="#f0eeeb"
		/>
	</div>

	<!-- ── Cost trend chart ─────────────────────────────────────────────────── -->
	<div class="chart-card full-width">
		<div class="chart-header">
			<div>
				<div class="chart-title">Monthly Cost Trend</div>
				<div class="chart-sub">6-month rolling infrastructure spend</div>
			</div>
			<div class="trend-badge">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
					<polyline points="17 6 23 6 23 12" />
				</svg>
				+21% vs 6 months ago
			</div>
		</div>
		<AreaChart data={monthlyTrend} color="#ffbf65" height={200} prefix="$" />
	</div>

	<!-- ── Bar + Donut charts ───────────────────────────────────────────────── -->
	<div class="charts-row">
		<div class="chart-card">
			<div class="chart-header">
				<div>
					<div class="chart-title">Cost by Project</div>
					<div class="chart-sub">Monthly spend per project</div>
				</div>
			</div>
			<HorizontalBarChart data={projectBarData} prefix="$" />
		</div>

		<div class="chart-card">
			<div class="chart-header">
				<div>
					<div class="chart-title">Resource Breakdown</div>
					<div class="chart-sub">Spend by infrastructure type</div>
				</div>
			</div>
			<div class="donut-container">
				<DonutChart
					data={donutData}
					size={160}
					strokeWidth={30}
					centerLabel={formatCost(totalCost)}
					centerSub="total / mo"
				/>
			</div>
		</div>
	</div>

	<!-- ── Projects table ───────────────────────────────────────────────────── -->
	<div class="chart-card full-width">
		<div class="chart-header">
			<div>
				<div class="chart-title">All Projects</div>
				<div class="chart-sub">Sorted by monthly cost</div>
			</div>
			<a href="/billing" class="view-all-link">View billing details →</a>
		</div>
		<table class="projects-table">
			<thead>
				<tr>
					<th>Project</th>
					<th>Organization</th>
					<th>Environments</th>
					<th class="right">Monthly Cost</th>
					<th class="right">Share</th>
				</tr>
			</thead>
			<tbody>
				{#each topProjects as proj}
					{@const share = totalCost > 0 ? (proj.cost / totalCost) * 100 : 0}
					<tr>
						<td class="project-name">{proj.name}</td>
						<td class="org-name">{proj.org}</td>
						<td>
							<span class="env-count">{proj.envCount}</span>
						</td>
						<td class="right cost-cell">{formatCost(proj.cost)}</td>
						<td class="right share-cell">
							<div class="share-row">
								<div class="share-bar">
									<div class="share-fill" style="width: {share.toFixed(1)}%"></div>
								</div>
								<span>{share.toFixed(0)}%</span>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.overview {
		min-height: 100vh;
		background: var(--k-black);
		color: var(--k-white);
		padding-bottom: 48px;
	}

	/* ── Hero bar ────────────────────────────────────────────────────────── */

	.hero-bar {
		background: var(--k-blue);
		padding: 28px 28px 26px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		border-bottom: 1px solid rgba(255, 191, 101, 0.15);
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.hero-label {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--k-gray);
	}

	.hero-value {
		font-size: 40px;
		font-weight: 800;
		color: var(--k-yellow);
		letter-spacing: -1.5px;
		line-height: 1;
	}

	.hero-sub {
		font-size: 13px;
		color: var(--k-gray);
		margin-top: 2px;
	}

	.trend-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 700;
		color: var(--k-yellow);
		background: rgba(255, 191, 101, 0.12);
		border: 1px solid rgba(255, 191, 101, 0.3);
		border-radius: 20px;
		padding: 7px 14px;
		flex-shrink: 0;
	}

	.trend-badge svg {
		width: 12px;
		height: 12px;
	}

	/* ── KPI stats ───────────────────────────────────────────────────────── */

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		background: var(--k-border-subtle);
		border-bottom: 1px solid var(--k-border-subtle);
	}

	@media (max-width: 900px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* ── Chart cards ─────────────────────────────────────────────────────── */

	.chart-card {
		background: var(--k-surface);
		border: 1px solid var(--k-border);
		border-radius: 8px;
		padding: 20px 22px;
		transition: border-color 0.2s;
	}

	.chart-card:hover {
		border-color: rgba(255, 191, 101, 0.25);
	}

	.charts-row {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 16px;
		padding: 16px 28px 0;
	}

	@media (max-width: 760px) {
		.charts-row {
			grid-template-columns: 1fr;
		}
	}

	.chart-card.full-width {
		margin: 16px 28px 0;
	}

	.chart-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 16px;
		gap: 12px;
	}

	.chart-title {
		font-size: 13px;
		font-weight: 700;
		color: var(--k-white);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.chart-sub {
		font-size: 12px;
		color: var(--k-gray);
		margin-top: 3px;
	}

	.donut-container {
		display: flex;
		justify-content: center;
		padding: 8px 0;
	}

	/* ── Projects table ──────────────────────────────────────────────────── */

	.projects-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}

	.projects-table thead {
		background: var(--k-blue);
	}

	.projects-table thead th {
		padding: 10px 12px;
		text-align: left;
		font-size: 10px;
		font-weight: 700;
		color: var(--k-gray);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.projects-table thead th.right {
		text-align: right;
	}

	.projects-table tbody tr {
		border-bottom: 1px solid var(--k-border-subtle);
		transition: background 0.12s;
	}

	.projects-table tbody tr:last-child {
		border-bottom: none;
	}

	.projects-table tbody tr:hover {
		background: var(--k-yellow-tint);
	}

	.projects-table td {
		padding: 11px 12px;
		vertical-align: middle;
		color: var(--k-gray);
	}

	.project-name {
		font-weight: 700;
		color: var(--k-white) !important;
	}

	.org-name {
		font-size: 12px;
		color: var(--k-gray) !important;
		opacity: 0.65;
	}

	.env-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 24px;
		height: 24px;
		background: var(--k-surface-raised);
		border: 1px solid var(--k-border);
		border-radius: 6px;
		font-size: 11px;
		font-weight: 700;
		color: var(--k-white);
		padding: 0 6px;
	}

	.cost-cell {
		text-align: right;
		font-weight: 700;
		color: var(--k-yellow) !important;
		font-variant-numeric: tabular-nums;
	}

	.share-cell {
		text-align: right;
	}

	.share-row {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
		font-size: 11px;
		color: var(--k-gray);
		font-variant-numeric: tabular-nums;
	}

	.share-bar {
		width: 64px;
		height: 4px;
		background: var(--k-border);
		border-radius: 2px;
		overflow: hidden;
	}

	.share-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--k-yellow), var(--k-orange));
		border-radius: 2px;
	}

	.view-all-link {
		font-size: 12px;
		font-weight: 600;
		color: var(--k-yellow);
		text-decoration: none;
		flex-shrink: 0;
		transition: opacity 0.15s;
	}

	.view-all-link:hover {
		opacity: 0.7;
	}
</style>
