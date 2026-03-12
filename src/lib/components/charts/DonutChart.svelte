<script lang="ts">
	type Slice = {
		label: string;
		value: number;
		color: string;
	};

	type Props = {
		data: Slice[];
		size?: number;
		strokeWidth?: number;
		centerLabel?: string;
		centerSub?: string;
	};

	let { data, size = 160, strokeWidth = 30, centerLabel = '', centerSub = '' }: Props = $props();

	let r = $derived((size - strokeWidth) / 2);
	let cx = $derived(size / 2);
	let cy = $derived(size / 2);
	let circumference = $derived(2 * Math.PI * r);

	let total = $derived(data.reduce((s, d) => s + d.value, 0));

	type Segment = {
		color: string;
		label: string;
		dashArray: string;
		dashOffset: number;
	};

	let segments = $derived.by<Segment[]>(() => {
		let offset = 0;
		const gap = 2; // px gap between segments
		return data.map((d) => {
			const len = total > 0 ? (d.value / total) * (circumference - data.length * gap) : 0;
			const seg: Segment = {
				color: d.color,
				label: d.label,
				dashArray: `${len.toFixed(2)} ${(circumference - len).toFixed(2)}`,
				dashOffset: -(offset + 0) // rotate to start at top
			};
			offset += len + gap;
			return seg;
		});
	});

	// rotate so the first segment starts at the top (-90 deg = quarter turn CCW)
	const startRotation = -90;
</script>

<div class="donut-wrap">
	<svg
		viewBox="0 0 {size} {size}"
		width={size}
		height={size}
		aria-label="Donut chart"
		style="display:block;flex-shrink:0;"
	>
		<!-- Background ring -->
		<circle {cx} {cy} {r} fill="none" stroke="#1f2c38" stroke-width={strokeWidth} />

		<!-- Segments -->
		{#each segments as seg}
			<circle
				{cx}
				{cy}
				{r}
				fill="none"
				stroke={seg.color}
				stroke-width={strokeWidth}
				stroke-dasharray={seg.dashArray}
				stroke-dashoffset={seg.dashOffset}
				transform="rotate({startRotation} {cx} {cy})"
				stroke-linecap="butt"
			/>
		{/each}

		<!-- Center labels -->
		{#if centerLabel}
			<text
				x={cx}
				y={cy - 6}
				text-anchor="middle"
				dominant-baseline="middle"
				fill="#f0eeeb"
				font-size="16"
				font-weight="700"
				font-family="Inter, sans-serif"
			>
				{centerLabel}
			</text>
		{/if}
		{#if centerSub}
			<text
				x={cx}
				y={cy + 14}
				text-anchor="middle"
				dominant-baseline="middle"
				fill="#5a7a8a"
				font-size="9"
				font-family="Inter, sans-serif"
			>
				{centerSub}
			</text>
		{/if}
	</svg>

	<!-- Legend -->
	<div class="legend">
		{#each data as d}
			<div class="legend-item">
				<span class="legend-dot" style="background:{d.color}"></span>
				<span class="legend-label">{d.label}</span>
				<span class="legend-value">{total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.donut-wrap {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.legend {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.legend-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.legend-label {
		font-size: 11.5px;
		color: #ccd5ae;
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.legend-value {
		font-size: 11px;
		color: #f0eeeb;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
</style>
