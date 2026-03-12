<script lang="ts">
	type Props = {
		label: string;
		value: string;
		sub?: string;
		icon?: 'cost' | 'projects' | 'environments' | 'resources';
		accent?: string;
	};

	let { label, value, sub = '', icon = 'cost', accent = '#ffbf65' }: Props = $props();
</script>

<div class="stat-card" style="--accent:{accent}">
	<div class="stat-icon">
		{#if icon === 'cost'}
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
		{:else if icon === 'projects'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
			</svg>
		{:else if icon === 'environments'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="2" y="3" width="20" height="14" rx="2" />
				<path d="M8 21h8M12 17v4" />
			</svg>
		{:else if icon === 'resources'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="2" y="2" width="8" height="8" rx="1.5" />
				<rect x="14" y="2" width="8" height="8" rx="1.5" />
				<rect x="2" y="14" width="8" height="8" rx="1.5" />
				<rect x="14" y="14" width="8" height="8" rx="1.5" />
			</svg>
		{/if}
	</div>
	<div class="stat-body">
		<div class="stat-label">{label}</div>
		<div class="stat-value">{value}</div>
		{#if sub}
			<div class="stat-sub">{sub}</div>
		{/if}
	</div>
</div>

<style>
	.stat-card {
		background: #13181b;
		border: 1px solid #1f2c38;
		border-radius: 12px;
		padding: 16px 18px;
		display: flex;
		align-items: flex-start;
		gap: 14px;
		transition: border-color 0.15s;
	}

	.stat-card:hover {
		border-color: rgba(255, 191, 101, 0.2);
	}

	.stat-icon {
		width: 36px;
		height: 36px;
		border-radius: 9px;
		background: color-mix(in srgb, var(--accent) 12%, transparent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--accent);
	}

	.stat-icon svg {
		width: 16px;
		height: 16px;
	}

	.stat-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.stat-label {
		font-size: 11px;
		font-weight: 500;
		color: #5a7a8a;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-value {
		font-size: 22px;
		font-weight: 700;
		color: #f0eeeb;
		letter-spacing: -0.5px;
		line-height: 1.1;
	}

	.stat-sub {
		font-size: 11px;
		color: #5a7a8a;
		margin-top: 2px;
	}
</style>
