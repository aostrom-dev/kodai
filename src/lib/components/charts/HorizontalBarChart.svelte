<script lang="ts">
	type BarItem = {
		label: string;
		value: number;
		color?: string;
	};

	type Props = {
		data: BarItem[];
		defaultColor?: string;
		prefix?: string;
		suffix?: string;
		barHeight?: number;
		gap?: number;
	};

	let {
		data,
		defaultColor = '#ffbf65',
		prefix = '',
		suffix = '',
		barHeight = 22,
		gap = 10
	}: Props = $props();

	const labelWidth = 140;
	const valueWidth = 72;
	const pad = { top: 8, right: 16, bottom: 8, left: 0 };
	const viewWidth = 500;

	let maxVal = $derived(Math.max(...data.map((d) => d.value), 1));

	let viewHeight = $derived(pad.top + data.length * (barHeight + gap) - gap + pad.bottom);

	function barW(v: number): number {
		const available = viewWidth - labelWidth - valueWidth - pad.right;
		return (v / maxVal) * available;
	}

	function barY(i: number): number {
		return pad.top + i * (barHeight + gap);
	}
</script>

<svg
	viewBox="0 0 {viewWidth} {viewHeight}"
	preserveAspectRatio="xMidYMid meet"
	style="width:100%;display:block;"
	aria-label="Bar chart"
>
	{#each data as item, i}
		{@const color = item.color ?? defaultColor}
		{@const bw = barW(item.value)}
		{@const by = barY(i)}
		{@const textY = by + barHeight / 2}

		<!-- Label -->
		<text
			x={labelWidth - 8}
			y={textY}
			text-anchor="end"
			dominant-baseline="middle"
			fill="#ccd5ae"
			font-size="11"
			font-family="Inter, sans-serif"
		>
			{item.label}
		</text>

		<!-- Bar background -->
		<rect
			x={labelWidth}
			y={by}
			width={viewWidth - labelWidth - valueWidth - pad.right}
			height={barHeight}
			rx="4"
			fill="rgba(0,58,108,0.35)"
		/>

		<!-- Bar fill -->
		<rect
			x={labelWidth}
			y={by}
			width={bw}
			height={barHeight}
			rx="4"
			fill={color}
			fill-opacity="0.85"
		/>

		<!-- Value label -->
		<text
			x={viewWidth - pad.right}
			y={textY}
			text-anchor="end"
			dominant-baseline="middle"
			fill="#f0eeeb"
			font-size="11"
			font-family="Inter, sans-serif"
			font-weight="600"
		>
			{prefix}{item.value.toLocaleString()}{suffix}
		</text>
	{/each}
</svg>
