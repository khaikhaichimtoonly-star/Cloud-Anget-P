/**
 * Trang danh sách Harness. Hai select mặc định (nhóm / của tôi), ô tìm kiếm,
 * nút "+ Harness mới", và bảng các harness. Hàng built-in: Xem + Nhân bản.
 * Hàng custom: Nhân bản + Sửa + Xoá (xoá cần xác nhận).
 */
import { useMemo, useState } from 'react'
import { Search, Plus, Eye, Copy, Pencil, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useT } from '../../i18n/context'
import { useUiStore } from '../../store/uiStore'
import { useHarnessStore } from '../../store/harnessStore'
import { MODELS, makeDefaultSubagents } from '../../lib/mock/harnesses'
import { MODEL_DOT } from './ModelSelect'
import { IconButton } from '../ui'
import type { Harness } from '../../types/harness'

function rid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export function HarnessList() {
  const t = useT()
  const harnesses = useHarnessStore((s) => s.harnesses)
  const addHarness = useHarnessStore((s) => s.addHarness)
  const cloneHarness = useHarnessStore((s) => s.cloneHarness)
  const deleteHarness = useHarnessStore((s) => s.deleteHarness)
  const setDefaultFor = useHarnessStore((s) => s.setDefaultFor)
  const setEditingHarnessId = useUiStore((s) => s.setEditingHarnessId)

  const [query, setQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Harness | null>(null)

  const teamDefault = harnesses.find((h) => h.defaultFor.includes('team'))
  const myDefault = harnesses.find((h) => h.defaultFor.includes('my'))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return harnesses
    return harnesses.filter((h) => h.name.toLowerCase().includes(q))
  }, [harnesses, query])

  const handleNew = () => {
    const model = MODELS[0]
    const id = rid()
    addHarness({
      id,
      name: t('settings.harness.newHarness').replace(/^\+\s*/, ''),
      description: '',
      model: model.key,
      supportsImages: model.supportsImages,
      isBuiltin: false,
      defaultFor: [],
      subagents: makeDefaultSubagents(model.key),
    })
    setEditingHarnessId(id)
  }

  const handleClone = (id: string) => {
    const newId = cloneHarness(id)
    if (newId) setEditingHarnessId(newId)
  }

  const confirmDelete = () => {
    if (deleteTarget) deleteHarness(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      {/* Hàng 1: mặc định nhóm / của tôi */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted">{t('settings.harness.defaultForTeam')}</label>
          <select
            value={teamDefault?.id ?? ''}
            onChange={(e) => setDefaultFor(e.target.value, 'team')}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          >
            <option value="" disabled>
              {t('common.none')}
            </option>
            {harnesses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{t('settings.harness.defaultForMe')}</label>
          <select
            value={myDefault?.id ?? ''}
            onChange={(e) => setDefaultFor(e.target.value, 'my')}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          >
            <option value="" disabled>
              {t('common.none')}
            </option>
            {harnesses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hàng 2: tìm kiếm + harness mới */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('settings.harness.searchPlaceholder')}
            className="w-full rounded-lg border border-line bg-surface py-1.5 pl-8 pr-3 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-1 rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accentfg"
        >
          <Plus className="size-4" />
          {t('settings.harness.newHarness')}
        </button>
      </div>

      {/* Bảng harness */}
      <div className="space-y-1">
        {filtered.map((h) => {
          const model = MODELS.find((m) => m.key === h.model)
          return (
            <div
              key={h.id}
              className="group flex items-center gap-3 rounded-lg bg-surface px-3 py-2"
            >
              <span className={`size-2 shrink-0 rounded-full ${MODEL_DOT[model?.color ?? 'blue'] ?? 'bg-muted'}`} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{h.name}</span>
              <span className="rounded-chip bg-surface2 px-2 py-0.5 text-xs text-muted">
                {h.isBuiltin ? t('settings.harness.builtIn') : t('settings.harness.custom')}
              </span>
              <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                {h.isBuiltin ? (
                  <>
                    <IconButton label={t('settings.harness.view')} onClick={() => setEditingHarnessId(h.id)}>
                      <Eye className="size-4" />
                    </IconButton>
                    <IconButton label={t('settings.harness.clone')} onClick={() => handleClone(h.id)}>
                      <Copy className="size-4" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton label={t('settings.harness.clone')} onClick={() => handleClone(h.id)}>
                      <Copy className="size-4" />
                    </IconButton>
                    <IconButton label={t('settings.harness.edit')} onClick={() => setEditingHarnessId(h.id)}>
                      <Pencil className="size-4" />
                    </IconButton>
                    <IconButton label={t('settings.harness.delete')} onClick={() => setDeleteTarget(h)}>
                      <Trash2 className="size-4" />
                    </IconButton>
                  </>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-xs text-muted">{t('common.none')}</p>
        )}
      </div>

      {/* Hộp xác nhận xoá */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[320px] rounded-card border border-line bg-panel p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-sm">{t('settings.harness.deleteConfirm')}</p>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="text-muted hover:text-fg"
                  aria-label={t('common.close')}
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface2 hover:text-fg"
                >
                  {t('common.close')}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-lg bg-danger px-3 py-1.5 text-sm font-medium text-white"
                >
                  {t('settings.harness.delete')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
