import type { Organization } from '$lib/billing';

export const organizations: Organization[] = [
	{
		id: 'org-1',
		name: 'Acme Corp',
		projects: [
			{
				id: 'proj-1',
				name: 'E-commerce Platform',
				environments: [
					{
						id: 'env-1-prod',
						name: 'production',
						resources: [
							{
								id: 'r-1',
								name: 'API Server',
								type: 'docker',
								specs: 'nginx:latest · 4 replicas · 2 CPU · 4 Gi',
								unitCostPerMonth: 48,
								quantity: 4
							},
							{
								id: 'r-2',
								name: 'Frontend',
								type: 'docker',
								specs: 'node:18 · 2 replicas · 1 CPU · 2 Gi',
								unitCostPerMonth: 24,
								quantity: 2
							},
							{
								id: 'r-3',
								name: 'Primary DB',
								type: 'database',
								specs: 'postgres 16 · 100 GB · 2 replicas',
								unitCostPerMonth: 120,
								quantity: 1
							},
							{
								id: 'r-4',
								name: 'Cache',
								type: 'database',
								specs: 'redis 7 · 8 GB',
								unitCostPerMonth: 35,
								quantity: 1
							},
							{
								id: 'r-5',
								name: 'Main Ingress',
								type: 'ingress',
								specs: 'TLS · example.com',
								unitCostPerMonth: 15,
								quantity: 1
							},
							{
								id: 'r-6',
								name: 'Media Storage',
								type: 'volume',
								specs: 'SSD · 500 GB',
								unitCostPerMonth: 50,
								quantity: 1
							},
							{
								id: 'r-7',
								name: 'Worker Node',
								type: 'vm',
								specs: '8 CPU · 32 GB · Ubuntu 24.04',
								unitCostPerMonth: 140,
								quantity: 2
							}
						]
					},
					{
						id: 'env-1-staging',
						name: 'staging',
						resources: [
							{
								id: 'r-8',
								name: 'API Server',
								type: 'docker',
								specs: 'nginx:latest · 1 replica · 1 CPU · 2 Gi',
								unitCostPerMonth: 24,
								quantity: 1
							},
							{
								id: 'r-9',
								name: 'Frontend',
								type: 'docker',
								specs: 'node:18 · 1 replica · 0.5 CPU · 1 Gi',
								unitCostPerMonth: 12,
								quantity: 1
							},
							{
								id: 'r-10',
								name: 'Database',
								type: 'database',
								specs: 'postgres 16 · 20 GB',
								unitCostPerMonth: 30,
								quantity: 1
							},
							{
								id: 'r-11',
								name: 'Ingress',
								type: 'ingress',
								specs: 'TLS · staging.example.com',
								unitCostPerMonth: 15,
								quantity: 1
							}
						]
					}
				]
			},
			{
				id: 'proj-2',
				name: 'Internal Tools',
				environments: [
					{
						id: 'env-2-prod',
						name: 'production',
						resources: [
							{
								id: 'r-12',
								name: 'App Server',
								type: 'docker',
								specs: 'python:3.12 · 2 replicas · 1 CPU · 2 Gi',
								unitCostPerMonth: 28,
								quantity: 2
							},
							{
								id: 'r-13',
								name: 'Database',
								type: 'database',
								specs: 'postgres 15 · 50 GB',
								unitCostPerMonth: 60,
								quantity: 1
							},
							{
								id: 'r-14',
								name: 'Ingress',
								type: 'ingress',
								specs: 'TLS · tools.acme.com',
								unitCostPerMonth: 15,
								quantity: 1
							},
							{
								id: 'r-15',
								name: 'File Storage',
								type: 'volume',
								specs: 'SSD · 100 GB',
								unitCostPerMonth: 10,
								quantity: 1
							}
						]
					},
					{
						id: 'env-2-dev',
						name: 'dev',
						resources: [
							{
								id: 'r-16',
								name: 'App Server',
								type: 'docker',
								specs: 'python:3.12 · 1 replica · 0.5 CPU · 1 Gi',
								unitCostPerMonth: 14,
								quantity: 1
							},
							{
								id: 'r-17',
								name: 'Database',
								type: 'database',
								specs: 'postgres 15 · 10 GB',
								unitCostPerMonth: 15,
								quantity: 1
							}
						]
					}
				]
			},
			{
				id: 'proj-3',
				name: 'Data Pipeline',
				environments: [
					{
						id: 'env-3-prod',
						name: 'production',
						resources: [
							{
								id: 'r-18',
								name: 'Processing Node',
								type: 'vm',
								specs: '16 CPU · 64 GB · Ubuntu 24.04',
								unitCostPerMonth: 280,
								quantity: 3
							},
							{
								id: 'r-19',
								name: 'Data Warehouse',
								type: 'database',
								specs: 'postgres 16 · 1 TB · 3 replicas',
								unitCostPerMonth: 320,
								quantity: 1
							},
							{
								id: 'r-20',
								name: 'Raw Data',
								type: 'volume',
								specs: 'NVMe · 2 TB',
								unitCostPerMonth: 200,
								quantity: 1
							},
							{
								id: 'r-21',
								name: 'Output Storage',
								type: 'volume',
								specs: 'SSD · 500 GB',
								unitCostPerMonth: 50,
								quantity: 1
							}
						]
					},
					{
						id: 'env-3-staging',
						name: 'staging',
						resources: [
							{
								id: 'r-22',
								name: 'Processing Node',
								type: 'vm',
								specs: '8 CPU · 32 GB · Ubuntu 24.04',
								unitCostPerMonth: 140,
								quantity: 1
							},
							{
								id: 'r-23',
								name: 'Database',
								type: 'database',
								specs: 'postgres 16 · 100 GB',
								unitCostPerMonth: 80,
								quantity: 1
							}
						]
					}
				]
			}
		]
	},
	{
		id: 'org-2',
		name: 'Startup Labs',
		projects: [
			{
				id: 'proj-4',
				name: 'SaaS Product',
				environments: [
					{
						id: 'env-4-prod',
						name: 'production',
						resources: [
							{
								id: 'r-24',
								name: 'Backend API',
								type: 'docker',
								specs: 'go:1.22 · 3 replicas · 2 CPU · 4 Gi',
								unitCostPerMonth: 56,
								quantity: 3
							},
							{
								id: 'r-25',
								name: 'Frontend',
								type: 'docker',
								specs: 'node:20 · 2 replicas · 1 CPU · 2 Gi',
								unitCostPerMonth: 28,
								quantity: 2
							},
							{
								id: 'r-26',
								name: 'Main DB',
								type: 'database',
								specs: 'postgres 16 · 200 GB · 2 replicas',
								unitCostPerMonth: 180,
								quantity: 1
							},
							{
								id: 'r-27',
								name: 'Ingress',
								type: 'ingress',
								specs: 'TLS · app.startup.io',
								unitCostPerMonth: 15,
								quantity: 1
							}
						]
					},
					{
						id: 'env-4-staging',
						name: 'staging',
						resources: [
							{
								id: 'r-28',
								name: 'Backend API',
								type: 'docker',
								specs: 'go:1.22 · 1 replica · 1 CPU · 2 Gi',
								unitCostPerMonth: 28,
								quantity: 1
							},
							{
								id: 'r-29',
								name: 'Database',
								type: 'database',
								specs: 'postgres 16 · 20 GB',
								unitCostPerMonth: 30,
								quantity: 1
							},
							{
								id: 'r-30',
								name: 'Ingress',
								type: 'ingress',
								specs: 'TLS · staging.startup.io',
								unitCostPerMonth: 15,
								quantity: 1
							}
						]
					},
					{
						id: 'env-4-preview',
						name: 'preview',
						resources: [
							{
								id: 'r-31',
								name: 'Backend API',
								type: 'docker',
								specs: 'go:1.22 · 1 replica · 0.5 CPU · 1 Gi',
								unitCostPerMonth: 14,
								quantity: 1
							},
							{
								id: 'r-32',
								name: 'Database',
								type: 'database',
								specs: 'postgres 16 · 5 GB',
								unitCostPerMonth: 8,
								quantity: 1
							}
						]
					}
				]
			},
			{
				id: 'proj-5',
				name: 'Marketing Site',
				environments: [
					{
						id: 'env-5-prod',
						name: 'production',
						resources: [
							{
								id: 'r-33',
								name: 'Web Server',
								type: 'docker',
								specs: 'nginx:alpine · 2 replicas · 0.5 CPU · 1 Gi',
								unitCostPerMonth: 12,
								quantity: 2
							},
							{
								id: 'r-34',
								name: 'Ingress',
								type: 'ingress',
								specs: 'TLS · startup.io',
								unitCostPerMonth: 15,
								quantity: 1
							},
							{
								id: 'r-35',
								name: 'Static Assets',
								type: 'volume',
								specs: 'SSD · 50 GB',
								unitCostPerMonth: 5,
								quantity: 1
							}
						]
					}
				]
			}
		]
	}
];
