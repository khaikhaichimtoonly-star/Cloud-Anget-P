/**
 * Toàn trang Cài đặt, thay giao diện chính khi `view === 'settings'`. Thanh
 * trên (Về ứng dụng + tiêu đề + ThemeToggle), bên trái SettingsSidebar, bên
 * phải vùng nội dung cuộn được. Nội dung fade 150ms khi đổi mục.
 */
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Cpu,
  FileText,
  Sparkles,
  Key,
  Clock,
  Settings2,
  Shield,
  Globe,
  Plug,
  Bell,
  GitPullRequest,
  Code,
  CreditCard,
} from 'lucide-react'
import { useT, type TKey } from '../../i18n/context'
import { useUiStore, type SettingsSection } from '../../store/uiStore'
import { ThemeToggle } from '../shell/ThemeToggle'
import type { ResolvedTheme, Theme } from '../../hooks/useTheme'
import { SettingsSidebar } from './SettingsSidebar'
import { AppearanceSettings } from './AppearanceSettings'
import { PlaceholderSettings } from './PlaceholderSettings'
import { HarnessList } from './HarnessList'
import { HarnessEditor } from './HarnessEditor'

/** Cấu hình cho 8 mục placeholder: icon 32px + khoá nhãn. */
const PLACEHOLDER: Record<SettingsSection, { icon: ReactNode; titleKey: TKey }> = {
  harness: { icon: <Cpu className="size-8" />, titleKey: 'settings.sections.harness' },
  appearance: { icon: <Cpu className="size-8" />, titleKey: 'settings.sections.appearance' },
  instructions: { icon: <FileText className="size-8" />, titleKey: 'settings.sections.instructions' },
  skills: { icon: <Sparkles className="size-8" />, titleKey: 'settings.sections.skills' },
  'llm-api-keys': { icon: <Key className="size-8" />, titleKey: 'settings.sections.llmApiKeys' },
  'scheduled-sessions': { icon: <Clock className="size-8" />, titleKey: 'settings.sections.scheduledSessions' },
  configuration: { icon: <Settings2 className="size-8" />, titleKey: 'settings.sections.configuration' },
  secrets: { icon: <Shield className="size-8" />, titleKey: 'settings.sections.secrets' },
  browser: { icon: <Globe className="size-8" />, titleKey: 'settings.sections.browser' },
  integrations: { icon: <Plug className="size-8" />, titleKey: 'settings.sections.integrations' },
  notifications: { icon: <Bell className="size-8" />, titleKey: 'settings.sections.notifications' },
  'pull-requests': { icon: <GitPullRequest className="size-8" />, titleKey: 'settings.sections.pullRequests' },
  api: { icon: <Code className="size-8" />, titleKey: 'settings.sections.api' },
  billing: { icon: <CreditCard className="size-8" />, titleKey: 'settings.sections.billing' },
}

export function SettingsShell({
  theme,
  resolvedTheme,
  setTheme,
  onToggleTheme,
}: {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  onToggleTheme: () => void
}) {
  const t = useT()
  const setView = useUiStore((s) => s.setView)
  const section = useUiStore((s) => s.settingsSection)
  const editingHarnessId = useUiStore((s) => s.editingHarnessId)

  const contentKey = `${section}:${editingHarnessId ?? 'list'}`

  const renderContent = () => {
    if (section === 'harness') {
      return editingHarnessId ? <HarnessEditor key={editingHarnessId} /> : <HarnessList />
    }
    if (section === 'appearance') {
      return <AppearanceSettings theme={theme} setTheme={setTheme} />
    }
    const cfg = PLACEHOLDER[section]
    return (
      <PlaceholderSettings
        icon={cfg.icon}
        title={t(cfg.titleKey)}
        description={t('settings.comingSoon')}
      />
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg text-fg">
      {/* Thanh trên */}
      <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-line bg-panel px-4">
        <button
          type="button"
          onClick={() => setView('app')}
          className="text-sm text-accent hover:underline"
        >
          {t('settings.backToApp')}
        </button>
        <span className="text-lg font-semibold">{t('settings.title')}</span>
        <div className="ml-auto">
          <ThemeToggle theme={resolvedTheme} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Thân: sidebar + nội dung */}
      <div className="flex min-h-0 flex-1">
        <SettingsSidebar />
        <div className="min-h-0 flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="min-h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
