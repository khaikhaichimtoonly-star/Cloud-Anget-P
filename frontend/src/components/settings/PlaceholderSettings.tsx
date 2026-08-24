/**
 * Mảnh dùng lại cho 8 mục cài đặt chưa làm. Icon lớn mờ + tiêu đề + mô tả +
 * chip "Sắp có". Mọi chữ đều đi qua `useT()`.
 */
import type { ReactNode } from 'react'
import { useT } from '../../i18n/context'

export function PlaceholderSettings({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  const t = useT()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="opacity-30">{icon}</div>
      <div className="text-sm font-medium">{title}</div>
      <div className="max-w-xs text-center text-xs text-muted">{description}</div>
      <span className="rounded-chip bg-surface2 px-2 py-0.5 text-xs text-muted">
        {t('settings.comingSoon')}
      </span>
    </div>
  )
}
