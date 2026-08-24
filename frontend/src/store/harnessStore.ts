/**
 * Store Harness (zustand + persist). Lưu danh sách harness trong localStorage
 * (khoá `agent-box:harnesses`). Built-in không xoá được; subagent built-in
 * không xoá được. Nhân bản luôn tạo bản custom (isBuiltin=false).
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Harness, Subagent } from '../types/harness'
import { BUILTIN_HARNESSES, MOCK_CUSTOM_HARNESSES } from '../lib/mock/harnesses'

/** Sinh id ngắn đủ khác biệt cho harness/subagent mới. */
function rid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

interface HarnessState {
  harnesses: Harness[]
  addHarness: (harness: Harness) => void
  updateHarness: (id: string, patch: Partial<Harness>) => void
  deleteHarness: (id: string) => void
  /** Tạo bản sao (custom), trả về id của bản sao. */
  cloneHarness: (id: string) => string
  updateSubagent: (harnessId: string, subagentId: string, patch: Partial<Subagent>) => void
  addSubagent: (harnessId: string, subagent: Omit<Subagent, 'id' | 'isBuiltin'>) => void
  deleteSubagent: (harnessId: string, subagentId: string) => void
  updateSubagentPrompt: (harnessId: string, subagentId: string, prompt: string) => void
  /** Đặt harness mặc định cho nhóm hoặc cá nhân (chỉ một harness/kind). */
  setDefaultFor: (id: string, kind: 'team' | 'my') => void
}

export const useHarnessStore = create<HarnessState>()(
  persist(
    (set, get) => ({
      harnesses: [...BUILTIN_HARNESSES, ...MOCK_CUSTOM_HARNESSES],

      addHarness: (harness) => set((s) => ({ harnesses: [harness, ...s.harnesses] })),

      updateHarness: (id, patch) =>
        set((s) => ({
          harnesses: s.harnesses.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      deleteHarness: (id) =>
        set((s) => {
          const target = s.harnesses.find((h) => h.id === id)
          if (!target || target.isBuiltin) return {}
          return { harnesses: s.harnesses.filter((h) => h.id !== id) }
        }),

      cloneHarness: (id) => {
        const src = get().harnesses.find((h) => h.id === id)
        if (!src) return ''
        const newId = rid()
        const clone: Harness = {
          ...src,
          id: newId,
          name: `${src.name} (Copy)`,
          isBuiltin: false,
          defaultFor: [],
          subagents: src.subagents.map((sa) => ({ ...sa, id: rid(), isBuiltin: false })),
        }
        set((s) => ({ harnesses: [clone, ...s.harnesses] }))
        return newId
      },

      updateSubagent: (harnessId, subagentId, patch) =>
        set((s) => ({
          harnesses: s.harnesses.map((h) =>
            h.id !== harnessId
              ? h
              : {
                  ...h,
                  subagents: h.subagents.map((sa) =>
                    sa.id === subagentId ? { ...sa, ...patch } : sa,
                  ),
                },
          ),
        })),

      addSubagent: (harnessId, subagent) =>
        set((s) => ({
          harnesses: s.harnesses.map((h) =>
            h.id !== harnessId
              ? h
              : { ...h, subagents: [...h.subagents, { ...subagent, id: rid(), isBuiltin: false }] },
          ),
        })),

      deleteSubagent: (harnessId, subagentId) =>
        set((s) => ({
          harnesses: s.harnesses.map((h) => {
            if (h.id !== harnessId) return h
            const target = h.subagents.find((sa) => sa.id === subagentId)
            if (!target || target.isBuiltin) return h
            return { ...h, subagents: h.subagents.filter((sa) => sa.id !== subagentId) }
          }),
        })),

      updateSubagentPrompt: (harnessId, subagentId, prompt) =>
        set((s) => ({
          harnesses: s.harnesses.map((h) =>
            h.id !== harnessId
              ? h
              : {
                  ...h,
                  subagents: h.subagents.map((sa) =>
                    sa.id === subagentId ? { ...sa, systemPrompt: prompt } : sa,
                  ),
                },
          ),
        })),

      setDefaultFor: (id, kind) =>
        set((s) => ({
          harnesses: s.harnesses.map((h) => {
            if (h.id === id) {
              return h.defaultFor.includes(kind)
                ? h
                : { ...h, defaultFor: [...h.defaultFor, kind] }
            }
            return h.defaultFor.includes(kind)
              ? { ...h, defaultFor: h.defaultFor.filter((k) => k !== kind) }
              : h
          }),
        })),
    }),
    {
      name: 'agent-box:harnesses',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ harnesses: s.harnesses }),
    },
  ),
)
