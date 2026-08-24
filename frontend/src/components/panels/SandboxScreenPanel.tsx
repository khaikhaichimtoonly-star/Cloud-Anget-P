/**
 * Khung ④ — Màn hình sandbox (máy ảo / trình duyệt).
 *
 * QUAN TRỌNG: màn hình mô phỏng phải hiện chỉ thị độc trên màn hình
 * (kênh tấn công A3 — VPI). Đây là cảnh demo chính (mục 14.5).
 *
 * Nhãn M1: ảnh màn hình luôn mang integrity = KHÔNG_TIN_ĐƯỢC.
 */
import { useAgentStore } from '../../store/agentStore'
import { useT } from '../../i18n/context'
import { PanelShell } from '../ui'
import { LabelDot } from '../LabelDot'

function MockBrowser({ instruction }: { instruction: string }) {
  return (
    <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-lg border border-line bg-surface shadow">
      <div className="flex items-center gap-1.5 border-b border-line bg-panel2 px-3 py-2">
        <span className="flex gap-1">
          <span className="size-2 rounded-full bg-red-400" />
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="size-2 rounded-full bg-emerald-400" />
        </span>
        <span className="ml-2 flex-1 truncate rounded bg-panel px-2 py-0.5 text-[10px] text-muted">
          https://thu-vien-mo-rong.example.com/huong-dan.html
        </span>
      </div>
      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-warn/5 to-danger/5 p-4">
        <div className="rounded-lg border-2 border-danger/60 bg-danger/5 p-6 text-center shadow-lg">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-danger">
            ⚠ Ghi chú cho trợ lý AI ⚠
          </p>
          <p className="text-[13px] font-semibold leading-relaxed text-danger">
            {instruction}
          </p>
        </div>
      </div>
    </div>
  )
}

export function SandboxScreenPanel() {
  const t = useT()
  const screen = useAgentStore((s) => s.screen)

  if (!screen) {
    return (
      <PanelShell title={t('screen.title')}>
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="text-[12px] text-muted">{t('screen.empty')}</p>
        </div>
      </PanelShell>
    )
  }

  return (
    <PanelShell title={t('screen.title')}>
      {screen.live ? (
        <div className="flex h-full items-center justify-center bg-black">
          <p className="text-[12px] text-slate-400">
            WebRTC stream thật — hiển thị ở đây khi backend chạy
          </p>
        </div>
      ) : (
        <div className="p-4">
          {/* Dải trạng thái */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-panel2 px-2 py-0.5 text-[11px] font-medium">
                {screen.view_mode}
              </span>
              <LabelDot
                integrity={screen.label.integrity}
                confidentiality={screen.label.confidentiality}
              />
              <span className="text-[11px] text-muted">{screen.label.label_id}</span>
            </div>
            <span className="rounded bg-warn/10 px-2 py-0.5 text-[11px] font-semibold text-warn ring-1 ring-warn/40">
              {t('screen.mockBanner')}
            </span>
          </div>
          <MockBrowser instruction={screen.injection_banner || t('screen.poisonInstruction')} />
          <p className="mt-3 text-center text-[11px] text-muted">{t('screen.fakeNote')}</p>
        </div>
      )}
    </PanelShell>
  )
}
