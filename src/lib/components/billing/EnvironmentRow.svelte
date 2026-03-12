<script lang="ts">
	import type { Environment, ResourceCost } from '$lib/billing';
	import { resourceTotal, formatCost } from '$lib/billing';

	type Props = {
		env: Environment;
		envTotal: number;
		projectTotal: number;
	};

	let { env, envTotal, projectTotal }: Props = $props();

	let expanded = $state(false);

	let share = $derived(projectTotal > 0 ? (envTotal / projectTotal) * 100 : 0);

	const typeColors: Record<string, string> = {
		vm: '#ffbf65',
		database: '#fd8973',
		docker: '#ccd5ae',
		ingress: '#f0eeeb',
		volume: '#003a6c'
	};

	function iconBg(color: string): string {
		if (color.startsWith('#')) return `${color}1a`;
		// For rgba / non-hex colors, add a fixed low opacity
		return color.replace(/[\d.]+\)$/, '0.15)');
	}
</script>

<div class="env-row">
	<button class="env-header" onclick={() => (expanded = !expanded)}>
		<div class="env-header-left">
			<div class="chevron" class:open={expanded}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="11"
					height="11"
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
			<span class="env-pill env-pill--{env.name}">{env.name}</span>
			<span class="resource-count"
				>{env.resources.length} resource{env.resources.length !== 1 ? 's' : ''}</span
			>
		</div>
		<div class="env-header-right">
			<div class="share-bar-wrap">
				<div class="share-bar">
					<div class="share-fill env-fill--{env.name}" style="width: {share.toFixed(1)}%"></div>
				</div>
				<span class="share-pct">{share.toFixed(0)}%</span>
			</div>
			<span class="env-total">{formatCost(envTotal)}</span>
		</div>
	</button>

	{#if expanded}
		<div class="resource-list">
			<table class="resource-table">
				<thead>
					<tr>
						<th>Resource</th>
						<th>Specs</th>
						<th class="right">Qty</th>
						<th class="right">Unit / mo</th>
						<th class="right">Total / mo</th>
					</tr>
				</thead>
				<tbody>
					{#each env.resources as resource (resource.id)}
						{@const color = typeColors[resource.type] ?? '#ccd5ae'}
						<tr>
							<td>
								<div class="resource-name">
									<div class="resource-icon" style="--icon-bg: {iconBg(color)}">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke={color}
											stroke-width="1.8"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											{#if resource.type === 'vm'}
												<path
													d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"
												/>
											{:else if resource.type === 'database'}
												<ellipse cx="12" cy="5" rx="9" ry="3" />
												<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
												<path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
											{:else if resource.type === 'docker'}
												<rect x="2" y="3" width="20" height="14" rx="2" />
												<path d="M8 21h8m-4-4v4" />
											{:else if resource.type === 'ingress'}
												<circle cx="12" cy="12" r="10" />
												<line x1="2" y1="12" x2="22" y2="12" />
												<path
													d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
												/>
											{:else if resource.type === 'volume'}
												<path
													d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
												/>
											{/if}
										</svg>
									</div>
									{resource.name}
								</div>
							</td>
							<td class="specs">{resource.specs}</td>
							<td class="right mono">{resource.quantity}</td>
							<td class="right mono">{formatCost(resource.unitCostPerMonth)}</td>
							<td class="right mono cost">{formatCost(resourceTotal(resource))}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td colspan="4" class="foot-label">Environment total</td>
						<td class="right mono foot-total">{formatCost(envTotal)}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	{/if}
</div>

<style>
.env-row {
border-top: 1px solid var(--k-border-subtle);
}

.env-row:first-child {
border-top: none;
}

/* ── Env header ──────────────────────────────────────────────────────────── */

.env-header {
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
padding: 10px 18px 10px 36px;
background: transparent;
border: none;
cursor: pointer;
gap: 12px;
transition: background 0.12s;
text-align: left;
}

.env-header:hover {
background: rgba(255, 191, 101, 0.04);
}

.env-header-left {
display: flex;
align-items: center;
gap: 8px;
}

.chevron {
color: var(--k-gray);
transition: transform 0.2s;
flex-shrink: 0;
opacity: 0.5;
}

.chevron.open {
transform: rotate(90deg);
opacity: 0.8;
}

.env-pill {
font-size: 10.5px;
font-weight: 600;
padding: 2px 8px;
border-radius: 4px;
text-transform: lowercase;
}

.env-pill--production {
background: rgba(253, 137, 115, 0.1);
color: #fd8973;
border: 1px solid rgba(253, 137, 115, 0.2);
}

.env-pill--staging {
background: rgba(255, 191, 101, 0.08);
color: #ffbf65;
border: 1px solid rgba(255, 191, 101, 0.16);
}

.env-pill--dev {
background: rgba(204, 213, 174, 0.08);
color: #ccd5ae;
border: 1px solid rgba(204, 213, 174, 0.14);
}

.env-pill--preview {
background: rgba(240, 238, 235, 0.06);
color: #f0eeeb;
border: 1px solid rgba(240, 238, 235, 0.12);
}

.resource-count {
font-size: 11.5px;
color: var(--k-gray);
opacity: 0.7;
}

/* ── Right side ──────────────────────────────────────────────────────────── */

.env-header-right {
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
width: 52px;
height: 3px;
border-radius: 2px;
background: var(--k-border);
overflow: hidden;
}

.share-fill {
height: 100%;
border-radius: 2px;
}

.env-fill--production {
background: #fd8973;
}

.env-fill--staging {
background: #ffbf65;
}

.env-fill--dev {
background: #ccd5ae;
}

.env-fill--preview {
background: #f0eeeb;
}

.share-pct {
font-size: 10.5px;
color: var(--k-gray);
width: 24px;
text-align: right;
opacity: 0.6;
}

.env-total {
font-size: 13px;
font-weight: 700;
color: var(--k-gray);
font-variant-numeric: tabular-nums;
}

/* ── Resource table ──────────────────────────────────────────────────────── */

.resource-list {
padding: 0 18px 14px 52px;
}

.resource-table {
width: 100%;
border-collapse: collapse;
font-size: 12px;
}

.resource-table thead th {
padding: 7px 8px;
text-align: left;
font-size: 10px;
font-weight: 700;
color: var(--k-gray);
text-transform: uppercase;
letter-spacing: 0.07em;
border-bottom: 1px solid var(--k-border);
}

.resource-table thead th.right {
text-align: right;
}

.resource-table tbody tr {
border-bottom: 1px solid var(--k-border-subtle);
transition: background 0.1s;
}

.resource-table tbody tr:last-child {
border-bottom: none;
}

.resource-table tbody tr:hover {
background: rgba(255, 191, 101, 0.03);
}

.resource-table td {
padding: 8px 8px;
color: var(--k-gray);
vertical-align: middle;
}

.resource-table td.right {
text-align: right;
}

.resource-name {
display: flex;
align-items: center;
gap: 8px;
color: var(--k-white);
font-weight: 600;
}

.resource-icon {
width: 22px;
height: 22px;
border-radius: 5px;
background: var(--icon-bg);
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
}

.specs {
color: var(--k-gray);
font-size: 11px;
opacity: 0.7;
}

.mono {
font-variant-numeric: tabular-nums;
}

.cost {
color: var(--k-yellow);
font-weight: 700;
}

/* ── Footer ──────────────────────────────────────────────────────────────── */

.resource-table tfoot tr {
border-top: 1px solid var(--k-border);
}

.resource-table tfoot td {
padding: 8px 8px;
}

.foot-label {
font-size: 11px;
color: var(--k-gray);
text-transform: uppercase;
letter-spacing: 0.05em;
opacity: 0.6;
}

.foot-total {
text-align: right;
font-size: 13px;
font-weight: 800;
color: var(--k-yellow);
}
</style>
