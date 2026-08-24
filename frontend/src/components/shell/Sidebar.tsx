/**
 * Thanh bên trái — thanh đa năng.
 *
 * Từ trên xuống: thương hiệu + 3 nút icon, khối tài khoản, "Phiên mới", hai
 * tab Gần đây / Nhóm, bộ chọn không gian làm việc, danh sách phiên, và đáy là
 * Cài đặt / Trợ giúp.
 *
 * Điểm khác Devin và OpenHands: mỗi dòng phiên hiện thêm CHIP CHẾ ĐỘ
 * (PLAN/ACT) và CHIP SỐ GIẤY PHÉP còn hiệu lực. Nhờ vậy trạng thái bảo mật
 * của mọi phiên nhìn thấy được từ một chỗ. Đừng bỏ hai chip này.
 */
import {
  ChevronDown,
  ChevronsUpDown,
  CircleQuestionMark,
  ListFilter,
  LogOut,
  PanelLeft,
  Plus,
  Search,
  Settings,
  UserRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useT, type TKey } from '../../i18n/context'
import { useUiStore } from '../../store/uiStore'
import { useAgentStore } from '../../store/agentStore'
import { MOCK_ACCOUNT } from '../../lib/mock/sessions'
import type { SessionStatus, SessionSummary } from '../../types/session'
import { Chip, IconButton } from '../ui'
import { ThemeToggle } from './ThemeToggle'
import type { Theme } from '../../hooks/useTheme'

/** Chấm màu trạng thái phiên. Luôn đi kèm chữ ở ngay bên phải. */
const STATUS_KEY: Record<SessionStatus, TKey> = {
  dang_chay: 'sidebar.status.dang_chay',
  cho_nguoi_dung: 'sidebar.status.cho_nguoi_dung',
  xong: 'sidebar.status.xong',
  da_tu_choi: 'sidebar.status.da_tu_choi',
  het_ngan_sach: 'sidebar.status.het_ngan_sach',
}

const STATUS_DOT: Record<SessionStatus, string> = {
  dang_chay: 'bg-emerald-500',
  cho_nguoi_dung: 'bg-amber-500',
  xong: 'bg-slate-400',
  da_tu_choi: 'bg-red-500',
  het_ngan_sach: 'bg-blue-500',
}

export function Sidebar({
  theme,
  onToggleTheme,
}: {
  theme: Theme
  onToggleTheme: () => void
}) {
  const t = useT()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const accountMenuOpen = useUiStore((s) => s.accountMenuOpen)
  const setAccountMenuOpen = useUiStore((s) => s.setAccountMenuOpen)
  const sessionTab = useUiStore((s) => s.sessionTab)
  const setSessionTab = useUiStore((s) => s.setSessionTab)
  const setView = useUiStore((s) => s.setView)
  const sessions = useAgentStore((s) => s.sessions)
  const activeSessionId = useAgentStore((s) => s.activeSessionId)

  if (collapsed) {
    return (
      <aside className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-line bg-panel py-3">
        <img src="/agent-box.svg" alt={t('app.title')} className="size-6" />
        <IconButton label={t('common.expandSidebar')} onClick={toggleSidebar}>
          <PanelLeft className="size-4" />
        </IconButton>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <IconButton label={t('common.search')}>
          <Search className="size-4" />
        </IconButton>
        <IconButton label={t('sidebar.newSession')}>
          <Plus className="size-4" />
        </IconButton>
        <div className="mt-auto flex flex-col items-center gap-2">
          <IconButton label={t('sidebar.settings')} onClick={() => setView('settings')}>
            <Settings className="size-4" />
          </IconButton>
          <IconButton label={t('sidebar.help')}>
            <CircleQuestionMark className="size-4" />
          </IconButton>
          <span
            className="flex size-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accentfg"
            title={MOCK_ACCOUNT.email}
          >
            {MOCK_ACCOUNT.initials}
          </span>
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex w-[264px] shrink-0 flex-col border-r border-line bg-panel">
      {/* Hàng thương hiệu */}
      <div className="flex items-center gap-2 px-3 py-3">
        <img src="/agent-box.svg" alt="" className="size-6" />
        <span className="flex-1 truncate text-sm font-semibold">{t('app.title')}</span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <IconButton label={t('common.search')}>
          <Search className="size-4" />
        </IconButton>
        <IconButton label={t('common.collapseSidebar')} onClick={toggleSidebar}>
          <PanelLeft className="size-4" />
        </IconButton>
      </div>

      {/* Khối tài khoản */}
      <div className="relative px-2">
        <button
          type="button"
          onClick={() => setAccountMenuOpen(!accountMenuOpen)}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-panel2"
          aria-expanded={accountMenuOpen}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accentfg">
            {MOCK_ACCOUNT.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium">
              {MOCK_ACCOUNT.displayName}
            </span>
            <span className="block truncate text-[11px] text-muted">{MOCK_ACCOUNT.email}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted" />
        </button>
        {accountMenuOpen && (
          <div className="absolute left-2 right-2 z-20 mt-1 overflow-hidden rounded-md border border-line bg-panel shadow-lg">
            <MenuItem icon={<UserRound className="size-4" />} label={t('sidebar.accountMenu')} />
            <MenuItem
              icon={<Settings className="size-4" />}
              label={t('sidebar.settings')}
              onClick={() => { setView('settings'); setAccountMenuOpen(false) }}
            />
            <MenuItem icon={<LogOut className="size-4" />} label={t('sidebar.signOut')} />
          </div>
        )}
      </div>

      {/* Phiên mới + tất cả phiên */}
      <div className="flex items-center gap-1 px-2 pt-2">
        <button
          type="button"
          className="flex flex-1 items-center gap-1.5 rounded-md bg-accent px-2 py-1.5 text-[12px] font-semibold text-accentfg hover:opacity-90"
        >
          <Plus className="size-4" />
          {t('sidebar.newSession')}
        </button>
        <button
          type="button"
          className="rounded-md px-2 py-1.5 text-[12px] text-muted hover:bg-panel2 hover:text-fg"
        >
          {t('sidebar.allSessions')}
        </button>
      </div>

      {/* Hai tab + nút lọc */}
      <div className="mt-3 flex items-center gap-1 border-b border-line px-2">
        <TabButton
          active={sessionTab === 'recent'}
          label={t('sidebar.tabRecent')}
          onClick={() => setSessionTab('recent')}
        />
        <TabButton
          active={sessionTab === 'groups'}
          label={t('sidebar.tabGroups')}
          onClick={() => setSessionTab('groups')}
        />
        <div className="ml-auto pb-1">
          <IconButton label={t('common.filter')}>
            <ListFilter className="size-4" />
          </IconButton>
        </div>
      </div>

      {/* Bộ chọn không gian làm việc */}
      <button
        type="button"
        className="mx-2 mt-2 flex items-center gap-2 rounded-md border border-line px-2 py-1.5 text-left text-[11px] hover:bg-panel2"
      >
        <span className="truncate text-muted">{t('sidebar.workspaceLabel')}</span>
        <span className="min-w-0 flex-1 truncate font-medium">{MOCK_ACCOUNT.workspace}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted" />
      </button>

      {/* Danh sách phiên */}
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {sessionTab === 'groups' ? (
          <p className="px-2 py-6 text-center text-[11px] text-muted">{t('sidebar.groupsEmpty')}</p>
        ) : (
          <ul className="space-y-0.5">
            {sessions.map((session) => (
              <li key={session.session_id}>
                <SessionRow session={session} active={session.session_id === activeSessionId} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Đáy */}
      <div className="border-t border-line px-2 py-1.5">
        <MenuItem icon={<Settings className="size-4" />} label={t('sidebar.settings')} onClick={() => setView('settings')} />
        <MenuItem icon={<CircleQuestionMark className="size-4" />} label={t('sidebar.help')} />
      </div>
    </aside>
  )
}

function SessionRow({ session, active }: { session: SessionSummary; active: boolean }) {
  const t = useT()
  return (
    <button
      type="button"
      className={`w-full rounded-md px-2 py-1.5 text-left transition ${
        active ? 'bg-surface2 border-l-2 border-accent rounded-r-md' : 'hover:bg-surface2'
      }`}
    >
      <span className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-panel2 text-[10px] font-bold text-muted ring-1 ring-line">
          {session.initials}
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{session.title}</span>
        <span className="shrink-0 text-[10px] text-muted">{session.relative_time}</span>
      </span>
      <span className="mt-1 flex flex-wrap items-center gap-1.5 pl-8">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-muted">
          <span className={`size-1.5 rounded-full ${STATUS_DOT[session.status]}`} />
          {t(STATUS_KEY[session.status])}
        </span>
        <Chip
          tone={session.mode === 'ACT' ? 'brand' : 'neutral'}
          title={t('sidebar.modeChipTitle', { mode: session.mode })}
        >
          {session.mode}
        </Chip>
        {session.active_lease_count > 0 && (
          <Chip
            tone="warn"
            title={t('sidebar.leaseChipTitle', { n: session.active_lease_count })}
          >
            {t('sidebar.leaseChip', { n: session.active_lease_count })}
          </Chip>
        )}
      </span>
    </button>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={active}
      className={`-mb-px border-b-2 px-2 pb-1.5 pt-1 text-[12px] font-medium transition ${
        active ? 'border-accent text-fg' : 'border-transparent text-muted hover:text-fg'
      }`}
    >
      {label}
    </button>
  )
}

function MenuItem({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-muted hover:bg-panel2 hover:text-fg"
    >
      {icon}
      {label}
    </button>
  )
}
