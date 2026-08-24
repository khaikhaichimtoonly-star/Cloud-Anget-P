/**
 * Khung ③ — Terminal (mock).
 */
import { useAgentStore } from '../../store/agentStore'
import { useT } from '../../i18n/context'
import { PanelShell } from '../ui'

export function TerminalPanel() {
  const t = useT()
  const lines = useAgentStore((s) => s.terminal)

  return (
    <PanelShell title={t('terminal.title')} note={t('terminal.mockNote')}>
      {lines.length === 0 ? (
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="text-[12px] text-muted">{t('terminal.empty')}</p>
        </div>
      ) : (
        <div className="bg-terminal text-terminal-fg font-mono text-[12px] leading-relaxed p-3 min-h-full">
          {lines.map((line, index) => (
            <div key={index} className="flex gap-2">
              <span className="shrink-0 text-[#58a6ff] select-none">$</span>
              <span className={line.kind === 'stderr' ? 'text-red-400' : ''}>{line.text}</span>
            </div>
          ))}
        </div>
      )}
    </PanelShell>
  )
}
