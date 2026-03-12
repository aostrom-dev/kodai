import { describe, it, expect } from 'vitest';
import {
	resourceTotal,
	environmentTotal,
	projectTotal,
	organizationTotal,
	formatCost,
	type ResourceCost,
	type Environment,
	type Project,
	type Organization
} from '$lib/billing';

describe('billing cost helpers', () => {
	const container: ResourceCost = {
		id: 'r-1',
		name: 'API Server',
		type: 'docker',
		specs: 'nginx:latest · 2 replicas',
		unitCostPerMonth: 48,
		quantity: 2
	};

	const db: ResourceCost = {
		id: 'r-2',
		name: 'Primary DB',
		type: 'database',
		specs: 'postgres 16 · 20 GB',
		unitCostPerMonth: 30,
		quantity: 1
	};

	const prodEnv: Environment = {
		id: 'env-prod',
		name: 'production',
		resources: [container, db]
	};

	const stagingEnv: Environment = {
		id: 'env-staging',
		name: 'staging',
		resources: [
			{
				id: 'r-3',
				name: 'App',
				type: 'docker',
				specs: '1 replica',
				unitCostPerMonth: 24,
				quantity: 1
			}
		]
	};

	const project: Project = {
		id: 'proj-1',
		name: 'My App',
		environments: [prodEnv, stagingEnv]
	};

	const org: Organization = {
		id: 'org-1',
		name: 'Acme Corp',
		projects: [project]
	};

	it('resourceTotal multiplies unit cost by quantity', () => {
		expect(resourceTotal(container)).toBe(96);
		expect(resourceTotal(db)).toBe(30);
	});

	it('environmentTotal sums all resource costs', () => {
		expect(environmentTotal(prodEnv)).toBe(126);
		expect(environmentTotal(stagingEnv)).toBe(24);
	});

	it('projectTotal sums all environment costs', () => {
		expect(projectTotal(project)).toBe(150);
	});

	it('organizationTotal sums all project costs', () => {
		expect(organizationTotal(org)).toBe(150);
	});

	it('formatCost formats as USD currency', () => {
		expect(formatCost(0)).toBe('$0.00');
		expect(formatCost(1234.5)).toBe('$1,234.50');
		expect(formatCost(2621)).toBe('$2,621.00');
	});
});
