/**
 * Thanh điều hướng trái của trang Cài đặt. Bốn nhóm (AGENTS / MACHINES /
 * FEATURES / ADMINISTRATION), mỗi mục: icon 16px + nhãn 13px. Bấm vào mục nào
 * cũng xoá editingHarnessId để về danh sách harness khi chọn lại Harness.
 */
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
  Palette,
  Code,
  CreditCard,
  type LucideIcon,
} from 'lucide-react'
import { useT, type TKey } from '../../i18n/context'
import { useUiStore, type SettingsSection } from '../../store/uiStore'

interface Item {
  id: SettingsSection
  icon: LucideIcon
  labelKey: TKey
}
interface Group {
  labelKey: TKey
  items: Item[]
}

const GROUPS: Group[] = [
  {
    labelKey: 'settings.sections.agentsLabel',
    items: [
      { id: 'harness', icon: Cpu, labelKey: 'settings.sections.harness' },
      { id: 'instructions', icon: FileText, labelKey: 'settings.sections.instructions' },
      { id: 'skills', icon: Sparkles, labelKey: 'settings.sections.skills' },
      { id: 'llm-api-keys', icon: Key, labelKey: 'settings.sections.llmApiKeys' },
      { id: 'scheduled-sessions', icon: Clock, labelKey: 'settings.sections.scheduledSessions' },
    ],
  },
  {
    labelKey: 'settings.sections.machinesLabel',
    items: [
      { id: 'configuration', icon: Settings2, labelKey: 'settings.sections.configuration' },
      { id: 'secrets', icon: Shield, labelKey: 'settings.sections.secrets' },
      { id: 'browser', icon: Globe, labelKey: 'settings.sections.browser' },
    ],
  },
  {
    labelKey: 'settings.sections.featuresLabel',
    items: [
      { id: 'integrations', icon: Plug, labelKey: 'settings.sections.integrations' },
      { id: 'notifications', icon: Bell, labelKey: 'settings.sections.notifications' },
      { id: 'pull-requests', icon: GitPullRequest, labelKey: 'settings.sections.pullRequests' },
      { id: 'appearance', icon: Palette, labelKey: 'settings.sections.appearance' },
    ],
  },
  {
    labelKey: 'settings.sections.administrationLabel',
    items: [
      { id: 'api', icon: Code, labelKey: 'settings.sections.api' },
      { id: 'billing', icon: CreditCard, labelKey: 'settings.sections.billing' },
    ],
  },
]

export function SettingsSidebar() {
  const t = useT()
  const section = useUiStore((s) => s.settingsSection)
  const setSection = useUiStore((s) => s.setSettingsSection)
  const setEditingHarnessId = useUiStore((s) => s.setEditingHarnessId)

  const select = (id: SettingsSection) => {
    setSection(id)
    setEditingHarnessId(null)
  }

  return (
    <nav className="w-[260px] shrink-0 overflow-y-auto border-r border-line bg-panel p-2">
      {GROUPS.map((group) => (
        <div key={group.labelKey} className="mb-3">
          <div className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {t(group.labelKey)}
          </div>
          {group.items.map((item) => {
            const Icon = item.icon
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => select(item.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] transition ${
                  active ? 'bg-surface text-fg font-medium' : 'text-muted hover:bg-surface2'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{t(item.labelKey)}</span>
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
