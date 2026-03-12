<script lang="ts">
	import BillingDashboard from '$lib/components/billing/BillingDashboard.svelte';
	import { organizations } from '$lib/billing-data';
</script>

<BillingDashboard {organizations} />

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		background: #0f171e;
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}
</style>
