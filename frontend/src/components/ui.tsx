/**
 * Vài mảnh giao diện nhỏ dùng lại khắp nơi.
 *
 * `PlainText` là mảnh QUAN TRỌNG NHẤT ở đây: mọi nội dung đến từ dữ liệu
 * (kết quả tool, nội dung file, chỉ thị độc) đều phải đi qua nó. Nó render
 * bằng con của React nên chuỗi luôn được escape — không có đường nào để một
 * chỉ thị độc biến thành HTML thật. ESLint đã chặn `dangerouslySetInnerHTML`
 * ở `eslint.config.js`.
 */
import type { ReactNode } from 'react'

export function IconButton({
  label,
  onClick,
  children,
  active = false,
  className = '',
}: {
  label: string
  onClick?: () => void
  children: ReactNode
  active?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex size-7 items-center justify-center rounded-md text-muted transition hover:bg-panel2 hover:text-fg ${
        active ? 'bg-panel2 text-fg' : ''
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function Chip({
  children,
  title,
  tone = 'neutral',
}: {
  children: ReactNode
  title?: string
  tone?: 'neutral' | 'brand' | 'warn' | 'danger'
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-panel2 text-muted ring-1 ring-line',
    brand: 'bg-accent/15 text-accent ring-1 ring-accent/40',
    warn: 'bg-warn/10 text-warn ring-1 ring-warn/40',
    danger: 'bg-danger/10 text-danger ring-1 ring-danger/40',
  }
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded px-1.5 py-px text-[10px] font-semibold tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

/**
 * Nội dung dạng VĂN BẢN THUẦN. Dùng cho mọi thứ đến từ dữ liệu.
 * Không có prop nào nhận HTML — đó là điểm chính của component này.
 */
export function PlainText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <pre
      className={`overflow-x-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed ${className}`}
    >
      {text}
    </pre>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
      {children}
    </div>
  )
}

export function PanelShell({
  title,
  note,
  toolbar,
  children,
}: {
  title: string
  note?: string
  toolbar?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <h2 className="text-[13px] font-semibold">{title}</h2>
        {toolbar}
      </div>
      {note && (
        <p className="border-b border-line bg-panel2 px-3 py-1.5 text-[11px] text-muted">{note}</p>
      )}
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
}
