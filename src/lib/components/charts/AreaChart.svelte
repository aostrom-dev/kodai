<script lang="ts">
	type DataPoint = {
		label: string;
		value: number;
	};

	type Props = {
		data: DataPoint[];
		color?: string;
		height?: number;
		prefix?: string;
		suffix?: string;
	};

	let { data, color = '#ffbf65', height = 180, prefix = '', suffix = '' }: Props = $props();

	const pad = { top: 20, right: 16, bottom: 36, left: 56 };

	// Use a fixed width for SSR-safe rendering; the SVG has viewBox so it scales
	const viewWidth = 600;
	let viewHeight = $derived(height);

	let minVal = $derived(Math.min(...data.map((d) => d.value)));
	let maxVal = $derived(Math.max(...data.map((d) => d.value)));
	let range = $derived(maxVal - minVal || 1);

	function xOf(i: number): number {
		return pad.left + (i / Math.max(data.length - 1, 1)) * (viewWidth - pad.left - pad.right);
	}

	function yOf(v: number): number {
		return pad.top + (1 - (v - minVal) / range) * (viewHeight - pad.top - pad.bottom);
	}

	let linePath = $derived(
		data
			.map((d, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(d.value).toFixed(1)}`)
			.join(' ')
	);

	let areaPath = $derived(
		[
			`M${xOf(0).toFixed(1)},${(viewHeight - pad.bottom).toFixed(1)}`,
			...data.map((d, i) => `L${xOf(i).toFixed(1)},${yOf(d.value).toFixed(1)}`),
			`L${xOf(data.length - 1).toFixed(1)},${(viewHeight - pad.bottom).toFixed(1)}`,
			'Z'
		].join(' ')
	);

	// 4 y-axis gridlines
	let gridLines = $derived(
		[0, 1, 2, 3].map((k) => {
			const v = minVal + (k / 3) * range;
			const y = yOf(v);
			return { y, label: `${prefix}${Math.round(v).toLocaleString()}${suffix}` };
		})
	);

	// Stable gradient ID — derived from a counter so it's consistent between renders
	let _gradientCounter = 0;
	const gradientId = `area-gradient-${++_gradientCounter}`;
</script>

<svg
	viewBox="0 0 {viewWidth} {viewHeight}"
	preserveAspectRatio="xMidYMid meet"
	style="width:100%;display:block;"
	aria-label="Area chart"
>
	<defs>
		<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color={color} stop-opacity="0.28" />
			<stop offset="100%" stop-color={color} stop-opacity="0.02" />
		</linearGradient>
	</defs>

	<!-- Grid lines -->
	{#each gridLines as gl}
		<line
			x1={pad.left}
			y1={gl.y.toFixed(1)}
			x2={viewWidth - pad.right}
			y2={gl.y.toFixed(1)}
			stroke="#1f2c38"
			stroke-width="1"
		/>
		<text
			x={(pad.left - 8).toFixed(1)}
			y={gl.y.toFixed(1)}
			text-anchor="end"
			dominant-baseline="middle"
			fill="#5a7a8a"
			font-size="10"
			font-family="Inter, sans-serif"
		>
			{gl.label}
		</text>
	{/each}

	<!-- Area fill -->
	<path d={areaPath} fill="url(#{gradientId})" />

	<!-- Line -->
	<path
		d={linePath}
		fill="none"
		stroke={color}
		stroke-width="2"
		stroke-linejoin="round"
		stroke-linecap="round"
	/>

	<!-- Data points -->
	{#each data as d, i}
		<circle
			cx={xOf(i).toFixed(1)}
			cy={yOf(d.value).toFixed(1)}
			r="4"
			fill={color}
			stroke="#13181b"
			stroke-width="2"
		/>
		<!-- X-axis label -->
		<text
			x={xOf(i).toFixed(1)}
			y={viewHeight - pad.bottom + 16}
			text-anchor="middle"
			fill="#5a7a8a"
			font-size="10"
			font-family="Inter, sans-serif"
		>
			{d.label}
		</text>
	{/each}
</svg>
