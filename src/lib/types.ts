import type { Node, Edge } from '@xyflow/svelte';

// ─── Virtual Machine ─────────────────────────────────────────────────────────

export type VmData = {
	label: string;
	cpu: number;
	memory: number; // GB
	os: string;
	region: string;
	publicIp: boolean;
};

export type VmNode = Node<VmData, 'vm'>;

// ─── Database ─────────────────────────────────────────────────────────────────

export type DatabaseData = {
	label: string;
	engine: 'postgres' | 'mysql' | 'mongodb' | 'redis';
	version: string;
	storageGb: number;
	replicas: number;
	backupsEnabled: boolean;
};

export type DatabaseNode = Node<DatabaseData, 'database'>;

// ─── Docker Container ─────────────────────────────────────────────────────────

export type DockerData = {
	label: string;
	image: string;
	tag: string;
	replicas: number;
	cpuLimit: string;
	memoryLimit: string;
	ports: { host: number; container: number }[];
	envVars: { key: string; value: string }[];
};

export type DockerNode = Node<DockerData, 'docker'>;

// ─── Ingress ──────────────────────────────────────────────────────────────────

export type IngressData = {
	label: string;
	domain: string;
	tls: boolean;
	rules: { path: string; targetPort: number }[];
};

export type IngressNode = Node<IngressData, 'ingress'>;

// ─── Union types ──────────────────────────────────────────────────────────────

export type InfraNodeData = VmData | DatabaseData | DockerData | IngressData;
export type InfraNode = VmNode | DatabaseNode | DockerNode | IngressNode;
export type InfraEdge = Edge;

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isVmNode(node: InfraNode): node is VmNode {
	return node.type === 'vm';
}

export function isDatabaseNode(node: InfraNode): node is DatabaseNode {
	return node.type === 'database';
}

export function isDockerNode(node: InfraNode): node is DockerNode {
	return node.type === 'docker';
}

export function isIngressNode(node: InfraNode): node is IngressNode {
	return node.type === 'ingress';
}

// ─── Default data factories ───────────────────────────────────────────────────

export function defaultVmData(): VmData {
	return {
		label: 'Virtual Machine',
		cpu: 2,
		memory: 4,
		os: 'Ubuntu 24.04',
		region: 'us-east-1',
		publicIp: true
	};
}

export function defaultDatabaseData(): DatabaseData {
	return {
		label: 'Database',
		engine: 'postgres',
		version: '16',
		storageGb: 20,
		replicas: 1,
		backupsEnabled: true
	};
}

export function defaultDockerData(): DockerData {
	return {
		label: 'Container',
		image: 'nginx',
		tag: 'latest',
		replicas: 1,
		cpuLimit: '0.5',
		memoryLimit: '512Mi',
		ports: [{ host: 80, container: 80 }],
		envVars: []
	};
}

export function defaultIngressData(): IngressData {
	return {
		label: 'Ingress',
		domain: 'example.com',
		tls: true,
		rules: [{ path: '/', targetPort: 80 }]
	};
}
