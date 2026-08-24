/**
 * Mục Appearance: chọn theme (Tối / Sáng / Hệ thống) và ngôn ngữ
 * (Tiếng Việt / English). Theme đến từ một `useTheme()` duy nhất (truyền qua
 * props), ngôn ngữ đi qua `useI18n()` + `uiStore.settingsLang`. Cả hai lưu
 * localStorage.
 */
import { Moon, Sun, Monitor, Languages } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { useUiStore } from '../../store/uiStore'
import type { Theme } from '../../hooks/useTheme'

export function AppearanceSettings({
  theme,
  setTheme,
}: {
  theme: Theme
  setTheme: (theme: Theme) => void
}) {
  const { t, setLang } = useI18n()
  const settingsLang = useUiStore((s) => s.settingsLang)
  const setSettingsLang = useUiStore((s) => s.setSettingsLang)

  const chooseLang = (lang: 'vi' | 'en') => {
    setSettingsLang(lang)
    setLang(lang)
  }

  const themeCards: { value: Theme; labelKey: 'settings.appearance.themeDark' | 'settings.appearance.themeLight' | 'settings.appearance.themeSystem'; icon: typeof Moon }[] = [
    { value: 'dark', labelKey: 'settings.appearance.themeDark', icon: Moon },
    { value: 'light', labelKey: 'settings.appearance.themeLight', icon: Sun },
    { value: 'system', labelKey: 'settings.appearance.themeSystem', icon: Monitor },
  ]

  const langCards: { value: 'vi' | 'en'; labelKey: 'settings.appearance.langVi' | 'settings.appearance.langEn' }[] = [
    { value: 'vi', labelKey: 'settings.appearance.langVi' },
    { value: 'en', labelKey: 'settings.appearance.langEn' },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <section className="space-y-2">
        <h2 className="text-sm font-semibold">{t('settings.appearance.theme')}</h2>
        <div className="grid grid-cols-3 gap-3">
          {themeCards.map((card) => {
            const Icon = card.icon
            const selected = theme === card.value
            return (
              <button
                key={card.value}
                type="button"
                onClick={() => setTheme(card.value)}
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition ${
                  selected ? 'border-accent bg-surface text-fg' : 'border-line text-muted hover:bg-surface2'
                }`}
              >
                <Icon className="size-4" />
                <span>{t(card.labelKey)}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">{t('settings.appearance.language')}</h2>
        <div className="grid max-w-md grid-cols-2 gap-3">
          {langCards.map((card) => {
            const selected = settingsLang === card.value
            return (
              <button
                key={card.value}
                type="button"
                onClick={() => chooseLang(card.value)}
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition ${
                  selected ? 'border-accent bg-surface text-fg' : 'border-line text-muted hover:bg-surface2'
                }`}
              >
                <Languages className="size-4" />
                <span>{t(card.labelKey)}</span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
