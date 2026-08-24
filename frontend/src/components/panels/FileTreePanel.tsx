/**
 * Khung phụ — Cây file workspace.
 */
import { useState } from 'react'
import { useAgentStore } from '../../store/agentStore'
import { useUiStore } from '../../store/uiStore'
import { useT } from '../../i18n/context'
import { PanelShell } from '../ui'
import type { FileNode } from '../../types/ui'

export function FileTreePanel() {
  const t = useT()
  const files = useAgentStore((s) => s.files)
  const selectedPath = useUiStore((s) => s.selectedFilePath)
  const selectFile = useUiStore((s) => s.selectFile)

  if (files.length === 0) {
    return (
      <PanelShell title={t('files.title')}>
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="text-[12px] text-muted">{t('files.empty')}</p>
        </div>
      </PanelShell>
    )
  }

  return (
    <PanelShell title={t('files.title')}>
      <div className="p-1">
        {files.map((node) => (
          <TreeNode key={node.path} node={node} depth={0} selectedPath={selectedPath} onSelect={selectFile} />
        ))}
      </div>
    </PanelShell>
  )
}

function TreeNode({ node, depth, selectedPath, onSelect }: {
  node: FileNode; depth: number; selectedPath: string | null; onSelect: (path: string) => void
}) {
  const [open, setOpen] = useState(depth < 2)
  const isDir = node.kind === 'dir'

  return (
    <div>
      <button
        type="button"
        onClick={() => (isDir ? setOpen(!open) : onSelect(node.path))}
        className={`flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left text-[12px] transition hover:bg-panel2 ${
          node.path === selectedPath ? 'bg-brand/15 text-brand' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        <span className="shrink-0 text-[11px]">{isDir ? (open ? '📂' : '📁') : '📄'}</span>
        <span className="truncate">{node.name}</span>
      </button>
      {isDir && open && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.path} node={child} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
