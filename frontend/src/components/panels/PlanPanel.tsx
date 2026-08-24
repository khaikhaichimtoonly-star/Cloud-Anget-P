/**
 * Khung ② — Kế hoạch (Plan).
 */
import { useMemo } from 'react'
import { useAgentStore } from '../../store/agentStore'
import { useT } from '../../i18n/context'
import { PanelShell, PlainText } from '../ui'

export function PlanPanel() {
  const t = useT()
  const mode = useAgentStore((s) => s.mode)
  const workspace = useAgentStore((s) => s.planWorkspace)
  const endorsed = useAgentStore((s) => s.planEndorsed)

  const content = useMemo(() => {
    if (mode === 'ACT' && endorsed) {
      return { title: t('plan.endorsedCardTitle'), text: endorsed.full_text }
    }
    if (workspace) {
      return { title: t('plan.workspaceCardTitle'), text: workspace.full_text }
    }
    return null
  }, [mode, workspace, endorsed, t])

  if (!content) {
    return (
      <PanelShell title={t('plan.title')}>
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="text-[12px] text-muted">{t('plan.noPlan')}</p>
        </div>
      </PanelShell>
    )
  }

  return (
    <PanelShell title={content.title}>
      <div className="p-4">
        <PlainText text={content.text} />
        {mode === 'ACT' && endorsed && (
          <p className="mt-3 border-t border-line pt-2 text-[11px] text-muted">
            {t('plan.endorsedCardNote')}
          </p>
        )}
      </div>
    </PanelShell>
  )
}
