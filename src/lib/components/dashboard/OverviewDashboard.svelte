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

	const projectColors = ['#ffbf65', '#0db7ed', '#4db33d', '#fd8973', '#a78bfa', '#38bdf8'];

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

	const typeColors: Record<string, string> = {
		vm: '#ffbf65',
		database: '#4db33d',
		docker: '#0db7ed',
		ingress: '#fd8973',
		volume: '#a78bfa'
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
	<header class="header">
		<div class="header-left">
			<div class="logo-box">
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
				<div class="brand">kodai</div>
				<div class="brand-sub">Platform Dashboard</div>
			</div>
		</div>

		<nav class="nav">
			<a href="/" class="nav-item active">
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
			<a href="/editor" class="nav-item">
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
			<a href="/billing" class="nav-item">
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

	<!-- ── Page title ──────────────────────────────────────────────────────── -->
	<div class="page-title">
		<div>
			<h1>Overview</h1>
			<p>Real-time infrastructure cost and resource summary</p>
		</div>
		<div class="orgs-pill">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
			{organizations.length} Organizations
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
			accent="#0db7ed"
		/>
		<StatCard
			label="Environments"
			value={String(allEnvironments.length)}
			sub={`${allProjects.length} projects`}
			icon="environments"
			accent="#4db33d"
		/>
		<StatCard
			label="Resources"
			value={String(totalResourceCount)}
			sub={`${allResources.length} resource types`}
			icon="resources"
			accent="#a78bfa"
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
		background: #0f171e;
		color: #f0eeeb;
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		padding-bottom: 40px;
	}

	/* ── Header ──────────────────────────────────────────────────────────── */

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 28px;
		height: 56px;
		background: #0f171e;
		border-bottom: 1px solid #1f2c38;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.logo-box {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: rgba(255, 191, 101, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.logo-box svg {
		width: 16px;
		height: 16px;
	}

	.brand {
		font-size: 15px;
		font-weight: 800;
		color: #f0eeeb;
		letter-spacing: -0.02em;
	}

	.brand-sub {
		font-size: 10px;
		color: #5a7a8a;
		text-transform: uppercase;
		letter-spacing: 0.4px;
	}

	/* ── Nav ─────────────────────────────────────────────────────────────── */

	.nav {
		display: flex;
		align-items: center;
		gap: 4px;
		background: #13181b;
		border: 1px solid #1f2c38;
		border-radius: 8px;
		padding: 3px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 5px 13px;
		border-radius: 6px;
		font-size: 12.5px;
		font-weight: 500;
		color: #5a7a8a;
		text-decoration: none;
		transition: all 0.15s;
	}

	.nav-item svg {
		width: 13px;
		height: 13px;
	}

	.nav-item:hover {
		color: #ccd5ae;
		background: rgba(255, 255, 255, 0.04);
	}

	.nav-item.active {
		color: #ffbf65;
		background: rgba(255, 191, 101, 0.1);
	}

	/* ── Page title ──────────────────────────────────────────────────────── */

	.page-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24px 28px 0;
	}

	h1 {
		margin: 0;
		font-size: 22px;
		font-weight: 700;
		color: #f0eeeb;
		letter-spacing: -0.3px;
	}

	.page-title p {
		margin: 4px 0 0;
		font-size: 13px;
		color: #5a7a8a;
	}

	.orgs-pill {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: #ccd5ae;
		background: #13181b;
		border: 1px solid #1f2c38;
		border-radius: 20px;
		padding: 5px 12px;
	}

	.orgs-pill svg {
		width: 13px;
		height: 13px;
	}

	/* ── KPI stats ───────────────────────────────────────────────────────── */

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 14px;
		padding: 20px 28px 0;
	}

	@media (max-width: 900px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* ── Chart cards ─────────────────────────────────────────────────────── */

	.chart-card {
		background: #13181b;
		border: 1px solid #1f2c38;
		border-radius: 12px;
		padding: 20px 22px;
	}

	.full-width {
		grid-column: 1 / -1;
	}

	.charts-row {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 14px;
		padding: 14px 28px 0;
	}

	@media (max-width: 760px) {
		.charts-row {
			grid-template-columns: 1fr;
		}
	}

	.chart-card.full-width {
		margin: 14px 28px 0;
	}

	.chart-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 16px;
		gap: 12px;
	}

	.chart-title {
		font-size: 14px;
		font-weight: 600;
		color: #f0eeeb;
	}

	.chart-sub {
		font-size: 11.5px;
		color: #5a7a8a;
		margin-top: 2px;
	}

	.trend-badge {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 11.5px;
		font-weight: 600;
		color: #4db33d;
		background: rgba(77, 179, 61, 0.1);
		border: 1px solid rgba(77, 179, 61, 0.2);
		border-radius: 20px;
		padding: 4px 10px;
		flex-shrink: 0;
	}

	.trend-badge svg {
		width: 11px;
		height: 11px;
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
		font-size: 12.5px;
	}

	.projects-table thead th {
		padding: 7px 10px;
		text-align: left;
		font-size: 10px;
		font-weight: 600;
		color: #5a7a8a;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid #1f2c38;
	}

	.projects-table thead th.right {
		text-align: right;
	}

	.projects-table tbody tr {
		border-bottom: 1px solid rgba(31, 44, 56, 0.6);
		transition: background 0.1s;
	}

	.projects-table tbody tr:last-child {
		border-bottom: none;
	}

	.projects-table tbody tr:hover {
		background: rgba(255, 255, 255, 0.02);
	}

	.projects-table td {
		padding: 10px 10px;
		vertical-align: middle;
		color: #ccd5ae;
	}

	.project-name {
		font-weight: 600;
		color: #f0eeeb !important;
	}

	.org-name {
		font-size: 11.5px;
		color: #5a7a8a !important;
	}

	.env-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 22px;
		height: 22px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid #1f2c38;
		border-radius: 6px;
		font-size: 11px;
		font-weight: 600;
		color: #ccd5ae;
		padding: 0 6px;
	}

	.cost-cell {
		text-align: right;
		font-weight: 700;
		color: #f0eeeb !important;
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
		color: #5a7a8a;
		font-variant-numeric: tabular-nums;
	}

	.share-bar {
		width: 60px;
		height: 4px;
		background: #1f2c38;
		border-radius: 2px;
		overflow: hidden;
	}

	.share-fill {
		height: 100%;
		background: linear-gradient(90deg, #ffbf65, #fd8973);
		border-radius: 2px;
	}

	.view-all-link {
		font-size: 12px;
		color: #ffbf65;
		text-decoration: none;
		flex-shrink: 0;
		transition: opacity 0.15s;
	}

	.view-all-link:hover {
		opacity: 0.8;
	}
</style>
