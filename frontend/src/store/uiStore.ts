/**
 * Trạng thái THUẦN GIAO DIỆN: thanh bên thu gọn, tab nào đang mở, tỉ lệ hai
 * cột, file nào đang chọn, modal nguồn nào đang mở.
 *
 * Tách khỏi `agentStore` có chủ ý: `agentStore` là ảnh chiếu của trạng thái
 * agent ở backend, còn đây là thứ chỉ tồn tại trong đầu người dùng. Trộn hai
 * loại vào một store làm việc thay transport về sau khó hơn.
 */
import { create } from 'zustand'
import type { AuditQueryId } from '../types/session'

export type PanelTabId = 'plan' | 'sandbox' | 'files' | 'terminal' | 'labels' | 'audit'

export const ALL_PANEL_TABS: PanelTabId[] = [
  'plan',
  'sandbox',
  'files',
  'terminal',
  'labels',
  'audit',
]

interface UiState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  accountMenuOpen: boolean
  setAccountMenuOpen: (open: boolean) => void

  sessionTab: 'recent' | 'groups'
  setSessionTab: (tab: 'recent' | 'groups') => void

  openTabs: PanelTabId[]
  activeTab: PanelTabId | null
  openTab: (tab: PanelTabId) => void
  closeTab: (tab: PanelTabId) => void
  closePanel: () => void

  panelFullscreen: boolean
  toggleFullscreen: () => void

  /** Bề rộng cột chat, tính theo phần của cả vùng làm việc (0,25 → 0,75). */
  splitRatio: number
  setSplitRatio: (ratio: number) => void

  selectedFilePath: string | null
  selectFile: (path: string) => void

  sourceLabelId: string | null
  openSource: (labelId: string) => void
  closeSource: () => void

  labelsTab: 'context' | 'leases'
  setLabelsTab: (tab: 'context' | 'leases') => void

  auditQuery: AuditQueryId | 'all'
  setAuditQuery: (query: AuditQueryId | 'all') => void
}

export const MIN_SPLIT = 0.25
export const MAX_SPLIT = 0.75

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  accountMenuOpen: false,
  setAccountMenuOpen: (open) => set({ accountMenuOpen: open }),

  sessionTab: 'recent',
  setSessionTab: (tab) => set({ sessionTab: tab }),

  openTabs: ALL_PANEL_TABS,
  activeTab: 'plan',
  openTab: (tab) =>
    set((s) => ({
      openTabs: s.openTabs.includes(tab) ? s.openTabs : [...s.openTabs, tab],
      activeTab: tab,
    })),
  closeTab: (tab) =>
    set((s) => {
      const openTabs = s.openTabs.filter((item) => item !== tab)
      const activeTab = s.activeTab === tab ? (openTabs[0] ?? null) : s.activeTab
      return { openTabs, activeTab, panelFullscreen: openTabs.length ? s.panelFullscreen : false }
    }),
  closePanel: () => set({ activeTab: null, panelFullscreen: false }),

  panelFullscreen: false,
  toggleFullscreen: () => set((s) => ({ panelFullscreen: !s.panelFullscreen })),

  splitRatio: 0.5,
  setSplitRatio: (ratio) =>
    set({ splitRatio: Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, ratio)) }),

  selectedFilePath: null,
  selectFile: (path) => set({ selectedFilePath: path }),

  sourceLabelId: null,
  openSource: (labelId) => set({ sourceLabelId: labelId }),
  closeSource: () => set({ sourceLabelId: null }),

  labelsTab: 'context',
  setLabelsTab: (tab) => set({ labelsTab: tab }),

  auditQuery: 'all',
  setAuditQuery: (query) => set({ auditQuery: query }),
}))
