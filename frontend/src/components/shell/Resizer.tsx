/**
 * Thanh kéo giãn giữa cột chat và panel phải.
 *
 * Grip sáu chấm dọc như trong giao diện tham khảo. Kéo bằng chuột, và kéo được
 * cả bằng bàn phím (mũi tên trái/phải) — người không dùng chuột vẫn đổi được
 * tỉ lệ. Tỉ lệ lưu trong `uiStore` nên đổi tab không mất.
 */
import { useCallback, useEffect, useRef } from 'react'
import { useT } from '../../i18n/context'
import { MAX_SPLIT, MIN_SPLIT, useUiStore } from '../../store/uiStore'

export function Resizer({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const t = useT()
  const splitRatio = useUiStore((s) => s.splitRatio)
  const setSplitRatio = useUiStore((s) => s.setSplitRatio)
  const dragging = useRef(false)

  const onMove = useCallback(
    (event: MouseEvent) => {
      if (!dragging.current) return
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      if (rect.width === 0) return
      setSplitRatio((event.clientX - rect.left) / rect.width)
    },
    [containerRef, setSplitRatio],
  )

  useEffect(() => {
    const stop = () => {
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', stop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', stop)
    }
  }, [onMove])

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={t('common.resizeHandle')}
      aria-valuenow={Math.round(splitRatio * 100)}
      aria-valuemin={Math.round(MIN_SPLIT * 100)}
      aria-valuemax={Math.round(MAX_SPLIT * 100)}
      tabIndex={0}
      title={t('common.resizeHandle')}
      onMouseDown={() => {
        dragging.current = true
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') setSplitRatio(splitRatio - 0.02)
        if (event.key === 'ArrowRight') setSplitRatio(splitRatio + 0.02)
      }}
      className="group flex w-2 shrink-0 cursor-col-resize items-center justify-center bg-bg hover:bg-panel2"
    >
      <span className="grid grid-cols-2 gap-x-0.5 gap-y-0.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="size-[3px] rounded-full bg-line group-hover:bg-muted" />
        ))}
      </span>
    </div>
  )
}
