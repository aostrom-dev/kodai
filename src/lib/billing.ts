// ─── Resource types ───────────────────────────────────────────────────────────

export type ResourceType = 'vm' | 'database' | 'docker' | 'ingress' | 'volume';

export type ResourceCost = {
	id: string;
	name: string;
	type: ResourceType;
	specs: string;
	unitCostPerMonth: number;
	quantity: number;
};

// ─── Environment ──────────────────────────────────────────────────────────────

export type EnvironmentName = 'production' | 'staging' | 'dev' | 'preview';

export type Environment = {
	id: string;
	name: EnvironmentName;
	resources: ResourceCost[];
};

// ─── Project ──────────────────────────────────────────────────────────────────

export type Project = {
	id: string;
	name: string;
	environments: Environment[];
};

// ─── Organization ─────────────────────────────────────────────────────────────

export type Organization = {
	id: string;
	name: string;
	projects: Project[];
};

// ─── Cost helpers ─────────────────────────────────────────────────────────────

export function resourceTotal(resource: ResourceCost): number {
	return resource.unitCostPerMonth * resource.quantity;
}

export function environmentTotal(env: Environment): number {
	return env.resources.reduce((sum, r) => sum + resourceTotal(r), 0);
}

export function projectTotal(project: Project): number {
	return project.environments.reduce((sum, e) => sum + environmentTotal(e), 0);
}

export function organizationTotal(org: Organization): number {
	return org.projects.reduce((sum, p) => sum + projectTotal(p), 0);
}

export function formatCost(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}
