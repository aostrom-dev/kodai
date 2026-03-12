<script lang="ts">
	import {
		SvelteFlow,
		Background,
		BackgroundVariant,
		Controls,
		MiniMap,
		type Connection,
		type NodeTypes,
		type EdgeTypes,
		useSvelteFlow
	} from '@xyflow/svelte';

	import NodePalette from '$lib/components/NodePalette.svelte';
	import PropertiesPanel from '$lib/components/PropertiesPanel.svelte';
	import { fly } from 'svelte/transition';
	import VmNode from '$lib/components/nodes/VmNode.svelte';
	import DatabaseNode from '$lib/components/nodes/DatabaseNode.svelte';
	import DockerNode from '$lib/components/nodes/DockerNode.svelte';
	import IngressNode from '$lib/components/nodes/IngressNode.svelte';
	import InfraEdge from '$lib/components/edges/InfraEdge.svelte';
	import VolumeNode from '$lib/components/nodes/VolumeNode.svelte';

	import type { InfraNode, InfraEdge as InfraEdgeType } from '$lib/types';
	import {
		defaultVmData,
		defaultDatabaseData,
		defaultDockerData,
		defaultIngressData,
		defaultVolumeData
	} from '$lib/types';

	// ── Node / Edge type registries ───────────────────────────────────────────────

	const nodeTypes: NodeTypes = {
		vm: VmNode,
		database: DatabaseNode,
		docker: DockerNode,
		ingress: IngressNode,
		volume: VolumeNode
	};

	const edgeTypes: EdgeTypes = {
		infra: InfraEdge
	};

	// ── Canvas state ──────────────────────────────────────────────────────────────

	let nodes = $state.raw<InfraNode[]>([
		{
			id: 'ingress-1',
			type: 'ingress',
			position: { x: 300, y: 50 },
			data: {
				...defaultIngressData(),
				label: 'Main Ingress',
				rules: [
					{ path: '/**', targetPort: 3000 },
					{ path: '/api/**', targetPort: 8080 }
				]
			}
		},
		{
			id: 'docker-1',
			type: 'docker',
			position: { x: 100, y: 250 },
			data: {
				...defaultDockerData(),
				label: 'API Server',
				image: 'my-api',
				tag: 'v1.2.0',
				replicas: 3,
				ports: [{ host: 8080, container: 8080 }]
			}
		},
		{
			id: 'docker-2',
			type: 'docker',
			position: { x: 480, y: 250 },
			data: {
				...defaultDockerData(),
				label: 'Frontend',
				image: 'my-frontend',
				tag: 'v2.1.0',
				ports: [{ host: 3000, container: 3000 }]
			}
		},
		{
			id: 'db-1',
			type: 'database',
			position: { x: 100, y: 490 },
			data: { ...defaultDatabaseData(), label: 'Primary DB' }
		},
		{
			id: 'vm-1',
			type: 'vm',
			position: { x: 490, y: 490 },
			data: { ...defaultVmData(), label: 'Worker Node' }
		}
	]);

	let edges = $state.raw<InfraEdgeType[]>([
		// Ingress rule-1 (/api/**) → API Server (docker-1)
		{ id: 'e1', source: 'ingress-1', target: 'docker-1', type: 'infra', sourceHandle: 'rule-1' },
		// Ingress rule-0 (/**) → Frontend (docker-2)
		{ id: 'e2', source: 'ingress-1', target: 'docker-2', type: 'infra', sourceHandle: 'rule-0' },
		// API Server port-0 → Primary DB
		{ id: 'e3', source: 'docker-1', target: 'db-1', type: 'infra', sourceHandle: 'port-0' },
		// Frontend port-0 → Worker Node VM
		{ id: 'e4', source: 'docker-2', target: 'vm-1', type: 'infra', sourceHandle: 'port-0' }
	]);

	// ── Selected node ─────────────────────────────────────────────────────────────

	let selectedNodeId = $state<string | null>(null);

	let selectedNode = $derived(
		selectedNodeId ? (nodes.find((n) => n.id === selectedNodeId) ?? null) : null
	);

	// ── SvelteFlow hooks (safe here — we are inside SvelteFlowProvider) ───────────

	const { screenToFlowPosition } = useSvelteFlow();

	// ── ID counter ────────────────────────────────────────────────────────────────

	let idCounter = $state(100);
	function nextId() {
		return `node-${++idCounter}`;
	}

	// ── Drag-to-add ───────────────────────────────────────────────────────────────

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		const type = event.dataTransfer?.getData('application/svelteflow');
		if (!type) return;

		const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

		let data: InfraNode['data'];
		switch (type) {
			case 'vm':
				data = defaultVmData();
				break;
			case 'database':
				data = defaultDatabaseData();
				break;
			case 'docker':
				data = defaultDockerData();
				break;
			case 'ingress':
				data = defaultIngressData();
				break;
			case 'volume':
				data = defaultVolumeData();
				break;
			default:
				return;
		}

		const newNode = { id: nextId(), type, position, data } as InfraNode;
		nodes = [...nodes, newNode];
		selectedNodeId = newNode.id;
	}

	// ── Connect ───────────────────────────────────────────────────────────────────

	function onConnect(connection: Connection) {
		const newEdge: InfraEdgeType = {
			id: `e-${connection.source}-${connection.target}-${Date.now()}`,
			source: connection.source,
			target: connection.target,
			sourceHandle: connection.sourceHandle ?? undefined,
			targetHandle: connection.targetHandle ?? undefined,
			type: 'infra'
		};
		edges = [...edges, newEdge];
	}

	// ── Node click → open properties ──────────────────────────────────────────────

	function onNodeClick({ node }: { node: InfraNode; event: MouseEvent | TouchEvent }) {
		selectedNodeId = node.id;
	}

	// ── Pane click → deselect ─────────────────────────────────────────────────────

	function onPaneClick() {
		selectedNodeId = null;
	}
</script>

<div class="editor-root">
	<NodePalette />

	<div class="canvas-wrap" role="main" ondragover={onDragOver} ondrop={onDrop}>
		<SvelteFlow
			bind:nodes
			bind:edges
			{nodeTypes}
			{edgeTypes}
			defaultEdgeOptions={{ type: 'infra' }}
			fitView
			onconnect={onConnect}
			onnodeclick={onNodeClick}
			onpaneclick={onPaneClick}
		>
			<Background variant={BackgroundVariant.Dots} gap={20} size={1.5} />
			<Controls />
			<MiniMap
				nodeColor={(n) => {
					const colors: Record<string, string> = {
						vm: '#ffbf65',
						database: '#fd8973',
						docker: '#ccd5ae',
						ingress: '#fd8973',
						volume: '#f0eeeb'
					};
					return colors[n.type ?? ''] ?? 'rgba(0,58,108,0.6)';
				}}
			/>
		</SvelteFlow>
	</div>

	{#if selectedNode}
		<div class="panel-overlay" transition:fly={{ x: 320, duration: 240, opacity: 1 }}>
			<PropertiesPanel node={selectedNode} onclose={() => (selectedNodeId = null)} />
		</div>
	{/if}
</div>

<style>
.editor-root {
display: flex;
width: 100vw;
height: 100vh;
overflow: hidden;
background: var(--k-black);
}

.canvas-wrap {
flex: 1;
min-width: 0;
height: 100%;
position: relative;
}

.panel-overlay {
position: absolute;
top: 12px;
right: 12px;
bottom: 12px;
z-index: 10;
pointer-events: auto;
}

/* ── Edge paths ──────────────────────────────────────────────────────────── */
:global(.svelte-flow__edge-path) {
stroke: rgba(0, 58, 108, 0.7);
stroke-width: 2;
}
:global(.svelte-flow__edge.selected .svelte-flow__edge-path),
:global(.svelte-flow__edge:hover .svelte-flow__edge-path) {
stroke: #ffbf65;
stroke-width: 2;
}

/* ── Connection line while dragging ─────────────────────────────────────── */
:global(.svelte-flow__connection-path) {
stroke: #ffbf65;
stroke-width: 2;
stroke-dasharray: 6 4;
}

/* ── Handles ─────────────────────────────────────────────────────────────── */
:global(.svelte-flow__handle) {
width: 10px;
height: 10px;
border-radius: 50%;
background: var(--k-black);
border: 2px solid var(--k-yellow);
transition:
transform 0.15s,
background 0.15s;
}
:global(.svelte-flow__handle:hover) {
background: var(--k-yellow);
transform: scale(1.3);
}

/* ── Controls panel ──────────────────────────────────────────────────────── */
:global(.svelte-flow__controls) {
background: var(--k-blue) !important;
border: 1px solid rgba(255, 191, 101, 0.2);
border-radius: 8px;
overflow: hidden;
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
}
:global(.svelte-flow__controls-button) {
background: transparent !important;
border-bottom: 1px solid rgba(255, 191, 101, 0.1) !important;
color: var(--k-gray) !important;
fill: var(--k-gray) !important;
transition:
background 0.15s,
color 0.15s !important;
}
:global(.svelte-flow__controls-button:hover) {
background: rgba(255, 191, 101, 0.1) !important;
color: var(--k-yellow) !important;
fill: var(--k-yellow) !important;
}
:global(.svelte-flow__controls-button:last-child) {
border-bottom: none !important;
}

/* ── Minimap ─────────────────────────────────────────────────────────────── */
:global(.svelte-flow__minimap) {
background: var(--k-blue) !important;
border: 1px solid rgba(255, 191, 101, 0.15);
border-radius: 8px;
overflow: hidden;
}
</style>
