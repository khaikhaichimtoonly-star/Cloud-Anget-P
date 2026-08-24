/**
 * Layout chính — bản vẽ mặt bằng mục 12.3.
 */
import { useEffect, useRef } from 'react'
import { useT } from './i18n/context'
import { useTheme } from './hooks/useTheme'
import { useAgentStore } from './store/agentStore'
import { useUiStore, type PanelTabId } from './store/uiStore'
import { Sidebar } from './components/shell/Sidebar'
import { Resizer } from './components/shell/Resizer'
import { ChatPanel } from './components/panels/ChatPanel'
import { PlanPanel } from './components/panels/PlanPanel'
import { TerminalPanel } from './components/panels/TerminalPanel'
import { SandboxScreenPanel } from './components/panels/SandboxScreenPanel'
import { LabelsLeasesPanel } from './components/panels/LabelsLeasesPanel'
import { ModeSwitchCard } from './components/ModeSwitchCard'
import { LabelDot } from './components/LabelDot'
import { FileTreePanel } from './components/panels/FileTreePanel'
import { AuditPanel } from './components/panels/AuditPanel'

const TAB_LABEL_KEY: Record<PanelTabId, string> = {
  plan: 'tabs.plan',
  sandbox: 'tabs.sandbox',
  files: 'tabs.files',
  terminal: 'tabs.terminal',
  labels: 'tabs.labels',
  audit: 'tabs.audit',
}

const TAB_ICON: Record<PanelTabId, string> = {
  plan: '📋', sandbox: '🖥️', files: '📁', terminal: '⬛', labels: '🏷️', audit: '📜',
}

export default function App() {
  const t = useT()
  const { theme, toggleTheme } = useTheme()

  const init = useAgentStore((s) => s.init)
  const teardown = useAgentStore((s) => s.teardown)
  useEffect(() => { init(); return () => teardown() }, [init, teardown])

  const mode = useAgentStore((s) => s.mode)
  const taskEpoch = useAgentStore((s) => s.taskEpoch)
  const budget = useAgentStore((s) => s.budget)
  const proposal = useAgentStore((s) => s.proposal)
  const rejectBundle = useAgentStore((s) => s.rejectBundle)
  const context = useAgentStore((s) => s.context)
  const scenarioIndex = useAgentStore((s) => s.scenarioIndex)
  const scenarioTotal = useAgentStore((s) => s.scenarioTotal)
  const sendCommand = useAgentStore((s) => s.sendCommand)
  const setRejectBundle = useAgentStore((s) => s.setRejectBundle)

  const openTabs = useUiStore((s) => s.openTabs)
  const activeTab = useUiStore((s) => s.activeTab)
  const openTab = useUiStore((s) => s.openTab)
  const closeTab = useUiStore((s) => s.closeTab)
  const closePanel = useUiStore((s) => s.closePanel)
  const splitRatio = useUiStore((s) => s.splitRatio)

  const containerRef = useRef<HTMLDivElement>(null)
  const showModeSwitch = proposal !== null
  const labelsVisible = activeTab !== 'labels'

  const renderActiveTab = () => {
    if (showModeSwitch && activeTab === 'plan') {
      return <ModeSwitchCard proposal={proposal!} rejectBundle={rejectBundle} />
    }
    switch (activeTab) {
      case 'plan': return <PlanPanel />
      case 'sandbox': return <SandboxScreenPanel />
      case 'files': return <FileTreePanel />
      case 'terminal': return <TerminalPanel />
      case 'labels': return <LabelsLeasesPanel />
      case 'audit': return <AuditPanel />
      default: return (
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="text-[12px] text-muted">{t('tabs.allClosed')}</p>
        </div>
      )
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-fg">
      <Sidebar theme={theme} onToggleTheme={toggleTheme} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          mode={mode}
          taskEpoch={taskEpoch}
          budget={budget}
          scenarioIndex={scenarioIndex}
          scenarioTotal={scenarioTotal}
          rejectBundle={rejectBundle}
          context={context}
          onRejectBundleChange={setRejectBundle}
          onStepNext={() => sendCommand({ type: 'scenario_step' })}
          onReset={() => sendCommand({ type: 'scenario_reset' })}
        />

        <div ref={containerRef} className="flex min-h-0 flex-1">
          {/* Cột trái — Chat */}
          <div className="flex min-h-0 flex-col overflow-hidden border-r border-line" style={{ flex: splitRatio }}>
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <h2 className="text-[13px] font-semibold">{t('chat.title')}</h2>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <ChatPanel />
            </div>
          </div>

          <Resizer containerRef={containerRef} />

          {/* Cột phải — Tab panels + LabelsLeasesPanel */}
          <div className="flex min-h-0 flex-col overflow-hidden" style={{ flex: 1 - splitRatio }}>
            <div className="flex items-center gap-0.5 border-b border-line bg-panel px-1">
              {openTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => openTab(tab)}
                  aria-selected={activeTab === tab}
                  className={`flex items-center gap-1.5 border-b-2 px-2.5 py-1.5 text-[12px] font-medium transition ${
                    activeTab === tab ? 'border-brand text-fg' : 'border-transparent text-muted hover:text-fg'
                  }`}
                >
                  <span className="text-[13px]">{TAB_ICON[tab]}</span>
                  {t(TAB_LABEL_KEY[tab] as 'tabs.plan')}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); closeTab(tab) }}
                    className="ml-1 rounded-sm p-px text-muted hover:bg-panel2 hover:text-fg"
                    aria-label="Đóng"
                  >✕</button>
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1 pr-1">
                <button type="button" onClick={closePanel} className="text-[11px] text-muted hover:text-fg px-1">✕</button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              {activeTab && (
                <div className="h-full" style={{ height: labelsVisible ? '60%' : '100%' }}>
                  <div className="h-full overflow-auto">{renderActiveTab()}</div>
                </div>
              )}
              {labelsVisible && activeTab && (
                <div className="h-[40%] border-t border-line">
                  <LabelsLeasesPanel />
                </div>
              )}
              {!activeTab && (
                <div className="flex h-full items-center justify-center p-6 text-center">
                  <p className="text-[12px] text-muted">{t('tabs.allClosed')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopBar({
  mode, taskEpoch, budget, context, scenarioIndex, scenarioTotal,
  rejectBundle, onRejectBundleChange, onStepNext, onReset,
}: {
  mode: string; taskEpoch: number; budget: { steps: number; tokens: number; costUsd: number; capUsd: number }
  context: { integrity_floor: string; confidentiality_ceiling: string }
  scenarioIndex: number; scenarioTotal: number; rejectBundle: boolean
  onRejectBundleChange: (v: boolean) => void; onStepNext: () => void; onReset: () => void
}) {
  const t = useT()
  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-panel px-4">
      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
        mode === 'ACT' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
      }`}>{mode}</span>
      <span className="text-[11px] font-mono text-muted">epoch #{taskEpoch}</span>
      <span className="text-[11px] font-mono text-muted">
        {t('topBar.budget', { steps: budget.steps, tokens: budget.tokens.toLocaleString(), cost: budget.costUsd.toFixed(2), cap: budget.capUsd.toFixed(2) })}
      </span>
      <div className="flex-1" />
      <LabelDot integrity={context.integrity_floor as 'duoc_nguoi_dung_cho_phep'} confidentiality={context.confidentiality_ceiling as 'cong_khai'} />
      {scenarioTotal > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted">{t('topBar.scenario', { cur: scenarioIndex, total: scenarioTotal })}</span>
          <label className="flex items-center gap-1 text-[11px] text-muted">
            <input type="checkbox" checked={rejectBundle} onChange={(e) => onRejectBundleChange(e.target.checked)} className="size-3" />
            {t('topBar.rejectBundle')}
          </label>
          <button type="button" onClick={onStepNext} disabled={scenarioIndex >= scenarioTotal}
            className="rounded bg-brand px-2 py-0.5 text-[11px] font-medium text-brandfg disabled:opacity-40">{t('topBar.stepNext')}</button>
          <button type="button" onClick={onReset}
            className="rounded border border-line px-2 py-0.5 text-[11px] text-muted hover:text-fg">{t('topBar.reset')}</button>
        </div>
      )}
    </div>
  )
}
