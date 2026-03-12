<script lang="ts">
	import BillingDashboard from '$lib/components/billing/BillingDashboard.svelte';
	import { organizations } from '$lib/billing-data';
</script>

<BillingDashboard {organizations} />
