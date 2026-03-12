<script lang="ts">
	import { useSvelteFlow } from '@xyflow/svelte';
	import type {
		InfraNode,
		VmData,
		DatabaseData,
		DockerData,
		IngressData,
		VolumeData
	} from '$lib/types';
	import { isVmNode, isDatabaseNode, isDockerNode, isIngressNode, isVolumeNode } from '$lib/types';

	let { node, onclose }: { node: InfraNode; onclose: () => void } = $props();

	const { updateNodeData } = useSvelteFlow();

	// Typed local copies of data for each form
	let vmData = $derived(isVmNode(node) ? (node.data as VmData) : null);
	let dbData = $derived(isDatabaseNode(node) ? (node.data as DatabaseData) : null);
	let dockerData = $derived(isDockerNode(node) ? (node.data as DockerData) : null);
	let ingressData = $derived(isIngressNode(node) ? (node.data as IngressData) : null);
	let volumeData = $derived(isVolumeNode(node) ? (node.data as VolumeData) : null);

	function update(patch: Partial<VmData | DatabaseData | DockerData | IngressData | VolumeData>) {
		updateNodeData(node.id, patch);
	}

	// Port helpers
	function addPort() {
		if (!dockerData) return;
		update({ ports: [...dockerData.ports, { host: 8080, container: 8080 }] });
	}
	function removePort(index: number) {
		if (!dockerData) return;
		update({ ports: dockerData.ports.filter((_, i) => i !== index) });
	}
	function updatePort(index: number, field: 'host' | 'container', value: number) {
		if (!dockerData) return;
		const ports = dockerData.ports.map((p, i) => (i === index ? { ...p, [field]: value } : p));
		update({ ports });
	}

	// Env var helpers
	function addEnvVar() {
		if (!dockerData) return;
		update({ envVars: [...dockerData.envVars, { key: '', value: '' }] });
	}
	function removeEnvVar(index: number) {
		if (!dockerData) return;
		update({ envVars: dockerData.envVars.filter((_, i) => i !== index) });
	}
	function updateEnvVar(index: number, field: 'key' | 'value', value: string) {
		if (!dockerData) return;
		const envVars = dockerData.envVars.map((e, i) => (i === index ? { ...e, [field]: value } : e));
		update({ envVars });
	}

	// Ingress rule helpers
	function addRule() {
		if (!ingressData) return;
		update({ rules: [...ingressData.rules, { path: '/', targetPort: 80 }] });
	}
	function removeRule(index: number) {
		if (!ingressData) return;
		update({ rules: ingressData.rules.filter((_, i) => i !== index) });
	}
	function updateRule(index: number, field: 'path' | 'targetPort', value: string | number) {
		if (!ingressData) return;
		const rules = ingressData.rules.map((r, i) => (i === index ? { ...r, [field]: value } : r));
		update({ rules });
	}

	const nodeTypeLabel: Record<string, string> = {
		vm: 'Virtual Machine',
		database: 'Database',
		docker: 'Container',
		ingress: 'Ingress',
		volume: 'Volume'
	};
	const nodeTypeAccent: Record<string, string> = {
		vm: '#ffbf65',
		database: '#fd8973',
		docker: '#0db7ed',
		ingress: '#fd8973',
		volume: '#a78bfa'
	};
</script>

<aside class="panel">
	<!-- Header -->
	<div class="panel-header">
		<div>
			<div class="panel-type" style="color: {nodeTypeAccent[node.type ?? 'vm']}">
				{nodeTypeLabel[node.type ?? 'vm']}
			</div>
			<div class="panel-title">Properties</div>
		</div>
		<button class="close-btn" onclick={onclose} title="Close panel">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
			>
				<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
	</div>

	<div class="panel-body">
		<!-- ── VM Properties ─────────────────────────── -->
		{#if vmData}
			<div class="section">
				<div class="section-title">General</div>
				<label class="field">
					<span>Label</span>
					<input
						type="text"
						value={vmData.label}
						oninput={(e) => update({ label: (e.target as HTMLInputElement).value })}
					/>
				</label>
				<label class="field">
					<span>Region</span>
					<select
						value={vmData.region}
						onchange={(e) => update({ region: (e.target as HTMLSelectElement).value })}
					>
						<option value="us-east-1">US East (N. Virginia)</option>
						<option value="us-west-2">US West (Oregon)</option>
						<option value="eu-west-1">EU West (Ireland)</option>
						<option value="eu-central-1">EU Central (Frankfurt)</option>
						<option value="ap-southeast-1">Asia Pacific (Singapore)</option>
					</select>
				</label>
			</div>
			<div class="section">
				<div class="section-title">Resources</div>
				<label class="field">
					<span>vCPU cores</span>
					<input
						type="number"
						min="1"
						max="128"
						value={vmData.cpu}
						oninput={(e) => update({ cpu: +(e.target as HTMLInputElement).value })}
					/>
				</label>
				<label class="field">
					<span>Memory (GB)</span>
					<input
						type="number"
						min="1"
						max="512"
						value={vmData.memory}
						oninput={(e) => update({ memory: +(e.target as HTMLInputElement).value })}
					/>
				</label>
			</div>
			<div class="section">
				<div class="section-title">System Image</div>
				<label class="field">
					<span>OS</span>
					<select
						value={vmData.os}
						onchange={(e) => update({ os: (e.target as HTMLSelectElement).value })}
					>
						<option value="Ubuntu 24.04">Ubuntu 24.04 LTS</option>
						<option value="Ubuntu 22.04">Ubuntu 22.04 LTS</option>
						<option value="Debian 12">Debian 12 Bookworm</option>
						<option value="CentOS Stream 9">CentOS Stream 9</option>
						<option value="Windows Server 2022">Windows Server 2022</option>
					</select>
				</label>
				<label class="field toggle">
					<span>Public IP</span>
					<input
						type="checkbox"
						checked={vmData.publicIp}
						onchange={(e) => update({ publicIp: (e.target as HTMLInputElement).checked })}
					/>
				</label>
			</div>
		{/if}

		<!-- ── Database Properties ───────────────────── -->
		{#if dbData}
			<div class="section">
				<div class="section-title">General</div>
				<label class="field">
					<span>Label</span>
					<input
						type="text"
						value={dbData.label}
						oninput={(e) => update({ label: (e.target as HTMLInputElement).value })}
					/>
				</label>
			</div>
			<div class="section">
				<div class="section-title">Engine</div>
				<label class="field">
					<span>Type</span>
					<select
						value={dbData.engine}
						onchange={(e) =>
							update({ engine: (e.target as HTMLSelectElement).value as DatabaseData['engine'] })}
					>
						<option value="postgres">PostgreSQL</option>
						<option value="mysql">MySQL</option>
						<option value="mongodb">MongoDB</option>
						<option value="redis">Redis</option>
					</select>
				</label>
				<label class="field">
					<span>Version</span>
					<input
						type="text"
						value={dbData.version}
						oninput={(e) => update({ version: (e.target as HTMLInputElement).value })}
					/>
				</label>
			</div>
			<div class="section">
				<div class="section-title">Capacity</div>
				<label class="field">
					<span>Storage (GB)</span>
					<input
						type="number"
						min="1"
						max="10000"
						value={dbData.storageGb}
						oninput={(e) => update({ storageGb: +(e.target as HTMLInputElement).value })}
					/>
				</label>
				<label class="field">
					<span>Replicas</span>
					<input
						type="number"
						min="1"
						max="10"
						value={dbData.replicas}
						oninput={(e) => update({ replicas: +(e.target as HTMLInputElement).value })}
					/>
				</label>
				<label class="field toggle">
					<span>Automated Backups</span>
					<input
						type="checkbox"
						checked={dbData.backupsEnabled}
						onchange={(e) => update({ backupsEnabled: (e.target as HTMLInputElement).checked })}
					/>
				</label>
			</div>
		{/if}

		<!-- ── Docker Container Properties ──────────── -->
		{#if dockerData}
			<div class="section">
				<div class="section-title">General</div>
				<label class="field">
					<span>Label</span>
					<input
						type="text"
						value={dockerData.label}
						oninput={(e) => update({ label: (e.target as HTMLInputElement).value })}
					/>
				</label>
			</div>
			<div class="section">
				<div class="section-title">Image</div>
				<label class="field">
					<span>Image</span>
					<input
						type="text"
						value={dockerData.image}
						oninput={(e) => update({ image: (e.target as HTMLInputElement).value })}
						placeholder="nginx"
					/>
				</label>
				<label class="field">
					<span>Tag</span>
					<input
						type="text"
						value={dockerData.tag}
						oninput={(e) => update({ tag: (e.target as HTMLInputElement).value })}
						placeholder="latest"
					/>
				</label>
			</div>
			<div class="section">
				<div class="section-title">Resources</div>
				<label class="field">
					<span>Replicas</span>
					<input
						type="number"
						min="1"
						max="100"
						value={dockerData.replicas}
						oninput={(e) => update({ replicas: +(e.target as HTMLInputElement).value })}
					/>
				</label>
				<label class="field">
					<span>CPU Limit</span>
					<input
						type="text"
						value={dockerData.cpuLimit}
						oninput={(e) => update({ cpuLimit: (e.target as HTMLInputElement).value })}
						placeholder="0.5"
					/>
				</label>
				<label class="field">
					<span>Memory Limit</span>
					<input
						type="text"
						value={dockerData.memoryLimit}
						oninput={(e) => update({ memoryLimit: (e.target as HTMLInputElement).value })}
						placeholder="512Mi"
					/>
				</label>
			</div>
			<div class="section">
				<div class="section-title-row">
					<span class="section-title">Port Mappings</span>
					<button class="add-btn" onclick={addPort}>+ Add</button>
				</div>
				{#each dockerData.ports as port, i}
					<div class="list-row">
						<input
							class="port-input"
							type="number"
							value={port.host}
							oninput={(e) => updatePort(i, 'host', +(e.target as HTMLInputElement).value)}
						/>
						<span class="list-sep">:</span>
						<input
							class="port-input"
							type="number"
							value={port.container}
							oninput={(e) => updatePort(i, 'container', +(e.target as HTMLInputElement).value)}
						/>
						<button class="remove-btn" onclick={() => removePort(i)}>×</button>
					</div>
				{/each}
				{#if dockerData.ports.length === 0}
					<div class="empty-hint">No port mappings</div>
				{/if}
			</div>
			<div class="section">
				<div class="section-title-row">
					<span class="section-title">Environment Variables</span>
					<button class="add-btn" onclick={addEnvVar}>+ Add</button>
				</div>
				{#each dockerData.envVars as env, i}
					<div class="list-row env-row">
						<input
							type="text"
							value={env.key}
							placeholder="KEY"
							oninput={(e) => updateEnvVar(i, 'key', (e.target as HTMLInputElement).value)}
						/>
						<span class="list-sep">=</span>
						<input
							type="text"
							value={env.value}
							placeholder="value"
							oninput={(e) => updateEnvVar(i, 'value', (e.target as HTMLInputElement).value)}
						/>
						<button class="remove-btn" onclick={() => removeEnvVar(i)}>×</button>
					</div>
				{/each}
				{#if dockerData.envVars.length === 0}
					<div class="empty-hint">No environment variables</div>
				{/if}
			</div>
		{/if}

		<!-- ── Ingress Properties ────────────────────── -->
		{#if ingressData}
			<div class="section">
				<div class="section-title">General</div>
				<label class="field">
					<span>Label</span>
					<input
						type="text"
						value={ingressData.label}
						oninput={(e) => update({ label: (e.target as HTMLInputElement).value })}
					/>
				</label>
				<label class="field">
					<span>Domain</span>
					<input
						type="text"
						value={ingressData.domain}
						oninput={(e) => update({ domain: (e.target as HTMLInputElement).value })}
						placeholder="example.com"
					/>
				</label>
				<label class="field toggle">
					<span>TLS / HTTPS</span>
					<input
						type="checkbox"
						checked={ingressData.tls}
						onchange={(e) => update({ tls: (e.target as HTMLInputElement).checked })}
					/>
				</label>
			</div>
			<div class="section">
				<div class="section-title-row">
					<span class="section-title">Routing Rules</span>
					<button class="add-btn" onclick={addRule}>+ Add</button>
				</div>
				{#each ingressData.rules as rule, i}
					<div class="list-row env-row">
						<input
							type="text"
							value={rule.path}
							placeholder="/path"
							oninput={(e) => updateRule(i, 'path', (e.target as HTMLInputElement).value)}
						/>
						<span class="list-sep">→</span>
						<input
							class="port-input"
							type="number"
							value={rule.targetPort}
							oninput={(e) => updateRule(i, 'targetPort', +(e.target as HTMLInputElement).value)}
						/>
						<button class="remove-btn" onclick={() => removeRule(i)}>×</button>
					</div>
				{/each}
				{#if ingressData.rules.length === 0}
					<div class="empty-hint">No routing rules</div>
				{/if}
			</div>
		{/if}
		<!-- ── Volume Properties ─────────────────────── -->
		{#if volumeData}
			<div class="section">
				<div class="section-title">General</div>
				<label class="field">
					<span>Label</span>
					<input
						type="text"
						value={volumeData.label}
						oninput={(e) => update({ label: (e.target as HTMLInputElement).value })}
					/>
				</label>
				<label class="field">
					<span>Mount Path</span>
					<input
						type="text"
						value={volumeData.mountPath}
						oninput={(e) => update({ mountPath: (e.target as HTMLInputElement).value })}
						placeholder="/data"
					/>
				</label>
			</div>
			<div class="section">
				<div class="section-title">Storage</div>
				<label class="field">
					<span>Size (GB)</span>
					<input
						type="number"
						min="1"
						max="65536"
						value={volumeData.sizeGb}
						oninput={(e) => update({ sizeGb: +(e.target as HTMLInputElement).value })}
					/>
				</label>
				<label class="field">
					<span>Disk Type</span>
					<select
						value={volumeData.type}
						onchange={(e) =>
							update({ type: (e.target as HTMLSelectElement).value as VolumeData['type'] })}
					>
						<option value="SSD">SSD</option>
						<option value="HDD">HDD</option>
						<option value="NVMe">NVMe</option>
					</select>
				</label>
			</div>
		{/if}
	</div>
</aside>

<style>
	.panel {
		width: 290px;
		height: 100%;
		background: #0f171e;
		border-left: 1px solid #1f2c38;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		flex-shrink: 0;
	}
	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px 16px;
		border-bottom: 1px solid #1f2c38;
		flex-shrink: 0;
		background: #13181b;
	}
	.panel-type {
		font-size: 9.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 3px;
	}
	.panel-title {
		font-size: 14px;
		font-weight: 700;
		color: #f0eeeb;
	}
	.close-btn {
		width: 28px;
		height: 28px;
		border-radius: 7px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid #243040;
		color: #4e6272;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		transition: all 0.15s;
	}
	.close-btn:hover {
		background: rgba(253, 137, 115, 0.1);
		border-color: rgba(253, 137, 115, 0.4);
		color: #fd8973;
	}
	.panel-body {
		flex: 1;
		overflow-y: auto;
		padding: 8px 0;
		scrollbar-width: thin;
		scrollbar-color: #243040 transparent;
	}
	.section {
		padding: 12px 16px 14px;
		border-bottom: 1px solid #1a2530;
	}
	.section:last-child {
		border-bottom: none;
	}
	.section-title {
		font-size: 9.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #3a5060;
		margin-bottom: 10px;
		display: block;
	}
	.section-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.section-title-row .section-title {
		margin-bottom: 0;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-bottom: 10px;
	}
	.field:last-child {
		margin-bottom: 0;
	}
	.field > span {
		font-size: 10.5px;
		font-weight: 600;
		color: #4e6272;
		text-transform: uppercase;
		letter-spacing: 0.07em;
	}
	.field.toggle {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 7px 10px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid #1f2c38;
		border-radius: 7px;
	}
	.field.toggle > span {
		font-size: 12px;
		font-weight: 500;
		text-transform: none;
		letter-spacing: 0;
		color: #ccd5ae;
	}
	.field input[type='text'],
	.field input[type='number'],
	.field select {
		width: 100%;
		background: #13181b;
		border: 1px solid #243040;
		color: #f0eeeb;
		border-radius: 7px;
		padding: 7px 10px;
		font-size: 12px;
		outline: none;
		transition: border-color 0.15s, background 0.15s;
		box-sizing: border-box;
	}
	.field input:focus,
	.field select:focus {
		border-color: #ffbf65;
		background: #18232c;
	}
	.field :global(input[type='checkbox']) {
		width: 16px;
		height: 16px;
		accent-color: #ffbf65;
		cursor: pointer;
	}
	.add-btn {
		font-size: 10.5px;
		font-weight: 600;
		padding: 3px 9px;
		border-radius: 6px;
		background: rgba(255, 191, 101, 0.08);
		border: 1px solid rgba(255, 191, 101, 0.2);
		color: #ffbf65;
		cursor: pointer;
		transition: all 0.15s;
		letter-spacing: 0.02em;
	}
	.add-btn:hover {
		background: rgba(255, 191, 101, 0.15);
		border-color: rgba(255, 191, 101, 0.35);
	}
	.list-row {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 6px;
	}
	.list-row input {
		flex: 1;
		background: #13181b;
		border: 1px solid #243040;
		color: #f0eeeb;
		border-radius: 6px;
		padding: 5px 8px;
		font-size: 12px;
		font-family: monospace;
		min-width: 0;
		outline: none;
		transition: border-color 0.15s;
	}
	.list-row input:focus {
		border-color: #ffbf65;
	}
	.env-row input {
		font-family: monospace;
	}
	.port-input {
		width: 60px !important;
		flex: 0 0 60px !important;
	}
	.list-sep {
		font-size: 12px;
		color: #3a5060;
		flex-shrink: 0;
	}
	.remove-btn {
		width: 24px;
		height: 24px;
		border-radius: 5px;
		background: transparent;
		border: 1px solid #243040;
		color: #4e6272;
		font-size: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: all 0.15s;
	}
	.remove-btn:hover {
		background: rgba(253, 137, 115, 0.1);
		border-color: rgba(253, 137, 115, 0.35);
		color: #fd8973;
	}
	.empty-hint {
		font-size: 11px;
		color: #3a5060;
		font-style: italic;
		padding: 4px 0;
	}
</style>
