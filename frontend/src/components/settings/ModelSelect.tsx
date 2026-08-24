/**
 * Bộ chọn model dạng nút bấm + dropdown. Mỗi lựa chọn hiện chấm màu + tên model.
 * Nhỏ gọn (compact) cho hàng subagent, full cho form harness.
 */
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { MODELS } from '../../lib/mock/harnesses'

/** map tên màu → class chấm tròn. */
export const MODEL_DOT: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
}

export function ModelSelect({
  value,
  onChange,
  disabled = false,
  compact = false,
}: {
  value: string
  onChange: (key: string) => void
  disabled?: boolean
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const current = MODELS.find((m) => m.key === value) ?? MODELS[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-lg border border-line bg-surface ${
          compact ? 'px-2 py-1 text-[12px]' : 'px-3 py-2 text-sm'
        } ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-surface2'}`}
      >
        <span className={`size-2 shrink-0 rounded-full ${MODEL_DOT[current.color] ?? 'bg-muted'}`} />
        <span className="truncate">{current.label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-muted" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full min-w-[180px] overflow-hidden rounded-lg border border-line bg-panel shadow-lg">
          {MODELS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                onChange(m.key)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] hover:bg-surface2 ${
                m.key === value ? 'text-fg' : 'text-muted'
              }`}
            >
              <span className={`size-2 shrink-0 rounded-full ${MODEL_DOT[m.color] ?? 'bg-muted'}`} />
              <span className="truncate">{m.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
