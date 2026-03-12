<script lang="ts">
	type NodeTypeEntry = {
		type: string;
		label: string;
		description: string;
		accent: string;
		iconBg: string;
	};

	const nodes: NodeTypeEntry[] = [
		{
			type: 'vm',
			label: 'Virtual Machine',
			description: 'Linux or Windows compute',
			accent: '#ffbf65',
			iconBg: 'rgba(255,191,101,0.12)'
		},
		{
			type: 'database',
			label: 'Database',
			description: 'Postgres, MySQL, Mongo, Redis',
			accent: '#4db33d',
			iconBg: 'rgba(77,179,61,0.12)'
		},
		{
			type: 'docker',
			label: 'Container',
			description: 'Docker container workload',
			accent: '#0db7ed',
			iconBg: 'rgba(13,183,237,0.10)'
		},
		{
			type: 'ingress',
			label: 'Ingress',
			description: 'HTTP/HTTPS routing & TLS',
			accent: '#fd8973',
			iconBg: 'rgba(253,137,115,0.10)'
		},
		{
			type: 'volume',
			label: 'Volume',
			description: 'Persistent disk storage',
			accent: '#a78bfa',
			iconBg: 'rgba(167,139,250,0.12)'
		}
	];

	function handleDragStart(event: DragEvent, type: string) {
		event.dataTransfer?.setData('application/svelteflow', type);
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}
</script>

<aside class="palette">
	<div class="palette-header">
		<div class="palette-logo">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#ffbf65"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="2" y="2" width="8" height="8" rx="1.5" />
				<rect x="14" y="2" width="8" height="8" rx="1.5" />
				<rect x="2" y="14" width="8" height="8" rx="1.5" />
				<rect x="14" y="14" width="8" height="8" rx="1.5" />
			</svg>
		</div>
		<div>
			<div class="palette-brand">kodai</div>
			<div class="palette-subtitle">Infrastructure Editor</div>
		</div>
	</div>

	<div class="palette-section-label">Components</div>

	<div class="palette-list">
		{#each nodes as entry}
			<div
				class="palette-item"
				style="--accent: {entry.accent}; --icon-bg: {entry.iconBg};"
				draggable="true"
				ondragstart={(e) => handleDragStart(e, entry.type)}
				role="button"
				tabindex="0"
				onkeydown={(e) =>
					e.key === 'Enter' &&
					e.currentTarget.dispatchEvent(
						new CustomEvent('addNode', { bubbles: true, detail: { type: entry.type } })
					)}
			>
				<div class="item-icon">
					{#if entry.type === 'vm'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect x="2" y="3" width="20" height="14" rx="2" />
							<path d="M8 21h8M12 17v4" />
						</svg>
					{:else if entry.type === 'database'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<ellipse cx="12" cy="5" rx="9" ry="3" />
							<path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
							<path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
						</svg>
					{:else if entry.type === 'docker'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M22 12.5c0-.83-.67-1.5-1.5-1.5H14v-2h-2v2H8V9H6v2H2.5C1.67 11 1 11.67 1 12.5v.5h21v-.5z"
							/>
							<path d="M1 13c0 2.76 4.03 5 9 5s9-2.24 9-5" />
							<rect x="8" y="5" width="2" height="2" /><rect
								x="11"
								y="5"
								width="2"
								height="2"
							/><rect x="14" y="5" width="2" height="2" /><rect x="11" y="2" width="2" height="2" />
						</svg>
					{:else if entry.type === 'ingress'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<path
								d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
							/>
						</svg>
					{:else if entry.type === 'volume'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<ellipse cx="12" cy="5" rx="9" ry="3" />
							<path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
							<path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
						</svg>
					{/if}
				</div>
				<div class="item-text">
					<div class="item-label">{entry.label}</div>
					<div class="item-desc">{entry.description}</div>
				</div>
				<div class="drag-hint">⠿</div>
			</div>
		{/each}
	</div>

	<div class="palette-footer">
		<div class="tip">Drag nodes onto the canvas</div>
		<a href="/" class="billing-link">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="3" y="3" width="7" height="7" />
				<rect x="14" y="3" width="7" height="7" />
				<rect x="3" y="14" width="7" height="7" />
				<rect x="14" y="14" width="7" height="7" />
			</svg>
			Dashboard
		</a>
		<a href="/billing" class="billing-link">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="12" y1="1" x2="12" y2="23" />
				<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
			</svg>
			Billing
		</a>
	</div>
</aside>

<style>
	.palette {
		width: 224px;
		height: 100%;
		background: #0f171e;
		border-right: 1px solid #1f2c38;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		overflow: hidden;
	}
	.palette-header {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 15px 14px 13px;
		border-bottom: 1px solid #1f2c38;
	}
	.palette-logo {
		width: 32px;
		height: 32px;
		background: rgba(255, 191, 101, 0.1);
		border: 1px solid rgba(255, 191, 101, 0.15);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.palette-brand {
		font-size: 14px;
		font-weight: 800;
		color: #f0eeeb;
		letter-spacing: -0.03em;
	}
	.palette-subtitle {
		font-size: 10px;
		color: #4e6272;
		margin-top: 1px;
		letter-spacing: 0.01em;
	}
	.palette-section-label {
		font-size: 9.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #3a5060;
		padding: 14px 14px 6px;
	}
	.palette-list {
		flex: 1;
		overflow-y: auto;
		padding: 0 8px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		scrollbar-width: thin;
		scrollbar-color: #243040 transparent;
	}
	.palette-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		border-radius: 8px;
		border: 1px solid transparent;
		cursor: grab;
		transition:
			background 0.12s,
			border-color 0.12s;
		user-select: none;
	}
	.palette-item:hover {
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.06);
	}
	.palette-item:active {
		cursor: grabbing;
		background: rgba(255, 255, 255, 0.06);
	}
	.item-icon {
		width: 30px;
		height: 30px;
		border-radius: 7px;
		background: var(--icon-bg);
		color: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.item-text {
		flex: 1;
		min-width: 0;
	}
	.item-label {
		font-size: 12px;
		font-weight: 600;
		color: #f0eeeb;
	}
	.item-desc {
		font-size: 10px;
		color: #4e6272;
		margin-top: 1px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.drag-hint {
		font-size: 13px;
		color: #2a3a48;
		line-height: 1;
		flex-shrink: 0;
	}
	.palette-item:hover .drag-hint {
		color: #4e6272;
	}
	.palette-footer {
		padding: 10px 14px;
		border-top: 1px solid #1f2c38;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.tip {
		font-size: 10px;
		color: #3a5060;
		text-align: center;
		letter-spacing: 0.02em;
	}
	.billing-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 6px 10px;
		border-radius: 7px;
		font-size: 11.5px;
		font-weight: 500;
		color: #5a7a8a;
		text-decoration: none;
		border: 1px solid #1f2c38;
		transition: all 0.15s;
	}
	.billing-link:hover {
		color: #ffbf65;
		border-color: rgba(255, 191, 101, 0.2);
		background: rgba(255, 191, 101, 0.05);
	}
</style>
