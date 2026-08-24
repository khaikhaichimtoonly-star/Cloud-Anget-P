/**
 * Thẻ chuyển chế độ Plan → Act (ModeSwitchCard).
 *
 * Năm thứ theo đúng mục 12.5.1:
 *  1. Một dòng phạm vi đã gộp — sinh từ canonical_resources (T7f)
 *  2. Toàn văn bản kế hoạch (không rút gọn)
 *  3. Danh sách nguồn từ derived_from (bấm được)
 *  4. Các bước bị tô đỏ
 *  5. Hai nút: "Chuyển sang Act" / "Sửa kế hoạch"
 *
 * KHI CONTROLLER TỪ CHỐI CẤP GIẤY PHÉP GỘP → dòng 1 nói thẳng lý do.
 */
import { useMemo } from 'react'
import { useT } from '../i18n/context'
import { useAgentStore } from '../store/agentStore'
import { useUiStore } from '../store/uiStore'
import { PlainText, SectionLabel } from './ui'
import { buildBundledScopeLine } from '../lib/scope'
import type { ModeSwitchProposal } from '../types/agent'

interface Props {
  proposal: ModeSwitchProposal
  /** Bật trạng thái "Controller từ chối cấp giấy phép gộp" (cho demo mock). */
  rejectBundle?: boolean
}

export function ModeSwitchCard({ proposal, rejectBundle = false }: Props) {
  const t = useT()
  const sendCommand = useAgentStore((s) => s.sendCommand)
  const openSource = useUiStore((s) => s.openSource)

  const plan = proposal.plan

  const scopeLine = useMemo(
    () => buildBundledScopeLine(rejectBundle ? { ...proposal, bundled_lease_rejected: true } : proposal),
    [proposal, rejectBundle],
  )

  const outOfScopeSteps = plan.steps.filter((s) => s.out_of_scope)

  const handleAccept = () => {
    sendCommand({ type: 'mode_switch_confirm', accepted: true })
  }

  const handleEdit = () => {
    sendCommand({ type: 'mode_switch_confirm', accepted: false })
  }

  const effectiveRejected = rejectBundle || proposal.bundled_lease_rejected

  return (
    <div className="rounded-lg border-2 border-amber-500/50 bg-bg p-4 shadow-lg shadow-amber-500/10">
      {/* 1. Dòng phạm vi đã gộp */}
      <div
        className={`mb-3 rounded-md px-3 py-2 text-[13px] font-semibold leading-relaxed ${
          effectiveRejected
            ? 'border border-red-500/40 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300'
            : 'border border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200'
        }`}
      >
        {scopeLine}
      </div>

      {/* 2. Toàn văn bản kế hoạch */}
      <SectionLabel>{t('tabs.plan')}</SectionLabel>
      <div className="mb-3 max-h-64 overflow-auto rounded border border-line bg-panel2 p-3">
        <PlainText text={plan.full_text} />
      </div>

      {/* 3. Danh sách nguồn */}
      {plan.derived_from.length > 0 && (
        <>
          <SectionLabel>Nguồn</SectionLabel>
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {plan.derived_from.map((labelId) => (
              <button
                key={labelId}
                type="button"
                onClick={() => openSource(labelId)}
                className="rounded bg-panel2 px-1.5 py-px text-[11px] font-mono text-brand hover:underline"
              >
                {labelId}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 4. Các bước tô đỏ (ngoài phạm vi việc) */}
      {outOfScopeSteps.length > 0 && (
        <>
          <SectionLabel>
            <span className="text-red-600 dark:text-red-400">
              ⚠ Bước ngoài phạm vi
            </span>
          </SectionLabel>
          <ul className="mb-3 space-y-1">
            {outOfScopeSteps.map((step) => (
              <li
                key={step.id}
                className="rounded border border-red-400/40 bg-red-50 px-3 py-1.5 text-[12px] text-red-800 dark:bg-red-950/20 dark:text-red-300"
              >
                <span className="font-semibold">{step.id}</span>
                : {step.description}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 5. Hai nút */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-md bg-emerald-600 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-emerald-700"
        >
          Chuyển sang Act
        </button>
        <button
          type="button"
          onClick={handleEdit}
          className="rounded-md border border-line px-3 py-1.5 text-[13px] font-medium text-muted transition hover:bg-panel2"
        >
          Sửa kế hoạch
        </button>
        {proposal.proposed_lease && (
          <span className="ml-2 text-[11px] text-muted">
            Giấy phép có hiệu lực {proposal.proposed_lease.duration_minutes} phút
          </span>
        )}
      </div>
    </div>
  )
}
