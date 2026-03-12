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
	</div>
</aside>

<style>
	.palette {
		width: 220px;
		height: 100%;
		background: #1a242c;
		border-right: 1px solid #2a3540;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		overflow: hidden;
	}
	.palette-header {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 14px 12px;
		border-bottom: 1px solid #2a3540;
	}
	.palette-logo {
		width: 34px;
		height: 34px;
		background: rgba(255, 191, 101, 0.1);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.palette-brand {
		font-size: 15px;
		font-weight: 800;
		color: #f0eeeb;
		letter-spacing: -0.02em;
	}
	.palette-subtitle {
		font-size: 10px;
		color: #7a8a94;
		margin-top: 1px;
	}
	.palette-section-label {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #4a5a64;
		padding: 14px 14px 8px;
	}
	.palette-list {
		flex: 1;
		overflow-y: auto;
		padding: 0 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		scrollbar-width: thin;
		scrollbar-color: #2a3540 transparent;
	}
	.palette-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 10px;
		border-radius: 8px;
		border: 1px solid transparent;
		cursor: grab;
		transition: all 0.15s;
		user-select: none;
		position: relative;
	}
	.palette-item:hover {
		background: rgba(255, 255, 255, 0.04);
		border-color: var(--accent, #2a3540);
	}
	.palette-item:active {
		cursor: grabbing;
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
		color: #7a8a94;
		margin-top: 1px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.drag-hint {
		font-size: 14px;
		color: #3a4a54;
		line-height: 1;
		flex-shrink: 0;
	}
	.palette-item:hover .drag-hint {
		color: #6a7a84;
	}
	.palette-footer {
		padding: 10px 14px;
		border-top: 1px solid #2a3540;
	}
	.tip {
		font-size: 10px;
		color: #4a5a64;
		text-align: center;
	}
</style>
