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
	import VmNode from '$lib/components/nodes/VmNode.svelte';
	import DatabaseNode from '$lib/components/nodes/DatabaseNode.svelte';
	import DockerNode from '$lib/components/nodes/DockerNode.svelte';
	import IngressNode from '$lib/components/nodes/IngressNode.svelte';
	import InfraEdge from '$lib/components/edges/InfraEdge.svelte';

	import type { InfraNode, InfraEdge as InfraEdgeType } from '$lib/types';
	import {
		defaultVmData,
		defaultDatabaseData,
		defaultDockerData,
		defaultIngressData
	} from '$lib/types';

	// ── Node / Edge type registries ───────────────────────────────────────────────

	const nodeTypes: NodeTypes = {
		vm: VmNode,
		database: DatabaseNode,
		docker: DockerNode,
		ingress: IngressNode
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
			data: { ...defaultIngressData(), label: 'Main Ingress' }
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
		{ id: 'e1', source: 'ingress-1', target: 'docker-1', type: 'infra' },
		{ id: 'e2', source: 'ingress-1', target: 'docker-2', type: 'infra' },
		{ id: 'e3', source: 'docker-1', target: 'db-1', type: 'infra' },
		{ id: 'e4', source: 'docker-2', target: 'vm-1', type: 'infra' }
	]);

	// ── Selected node ─────────────────────────────────────────────────────────────

	let selectedNodeId = $state<string | null>(null);

	let selectedNode = $derived(
		selectedNodeId ? (nodes.find((n) => n.id === selectedNodeId) ?? null) : null
	);

	// ── SvelteFlow hooks (safe here — we are inside SvelteFlowProvider) ───────────

	const { screenToFlowPosition } = useSvelteFlow();

	// ── Edge delete event forwarded from InfraEdge via custom DOM event ───────────

	let flowWrapper: HTMLDivElement;

	$effect(() => {
		if (!flowWrapper) return;
		flowWrapper.addEventListener('deleteEdge', onDeleteEdge as EventListener);
		return () => flowWrapper.removeEventListener('deleteEdge', onDeleteEdge as EventListener);
	});

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

	// ── Delete edge ───────────────────────────────────────────────────────────────

	function onDeleteEdge(event: Event) {
		const { id } = (event as CustomEvent<{ id: string }>).detail;
		edges = edges.filter((e) => e.id !== id);
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

	<div
		class="canvas-wrap"
		bind:this={flowWrapper}
		role="main"
		ondragover={onDragOver}
		ondrop={onDrop}
	>
		<SvelteFlow
			bind:nodes
			bind:edges
			{nodeTypes}
			{edgeTypes}
			defaultEdgeOptions={{ type: 'infra', animated: true }}
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
						database: '#4db33d',
						docker: '#0db7ed',
						ingress: '#fd8973'
					};
					return colors[n.type ?? ''] ?? '#2a3540';
				}}
			/>
		</SvelteFlow>
	</div>

	{#if selectedNode}
		<PropertiesPanel node={selectedNode} onclose={() => (selectedNodeId = null)} />
	{/if}
</div>

<style>
	.editor-root {
		display: flex;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #13181b;
	}

	.canvas-wrap {
		flex: 1;
		min-width: 0;
		height: 100%;
		position: relative;
	}

	/* Edge paths */
	:global(.svelte-flow__edge-path) {
		stroke: #ccd5ae;
		stroke-width: 2;
	}
	:global(.svelte-flow__edge.selected .svelte-flow__edge-path),
	:global(.svelte-flow__edge:hover .svelte-flow__edge-path) {
		stroke: #ffbf65;
	}

	/* Show edge delete button on hover/selected */
	:global(.svelte-flow__edge:hover .delete-btn),
	:global(.svelte-flow__edge.selected .delete-btn) {
		opacity: 1 !important;
	}

	/* Connection line while dragging */
	:global(.svelte-flow__connection-path) {
		stroke: #ffbf65;
		stroke-width: 2;
		stroke-dasharray: 5 5;
	}

	/* Handles */
	:global(.svelte-flow__handle) {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #003a6c;
		border: 2px solid #ffbf65;
	}
	:global(.svelte-flow__handle:hover) {
		background: #ffbf65;
		transform: scale(1.3);
	}

	/* Controls panel */
	:global(.svelte-flow__controls) {
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #2a3540;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	}
	:global(.svelte-flow__controls-button) {
		border-bottom: 1px solid #2a3540 !important;
	}

	/* Minimap */
	:global(.svelte-flow__minimap) {
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #2a3540;
	}
</style>
