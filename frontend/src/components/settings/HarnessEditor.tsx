/**
 * Trang sửa harness. Built-in mở ở chế độ chỉ xem (tên/mô tả/model/khoá,
 * checkbox/subagent model khoá), nhưng ô system prompt LUÔN mở — đó là phần
 * ghi đè của người dùng. Custom thì sửa/xoá/thêm subagent thoải mái. Nhân bản
 * tạo bản custom và chuyển sang sửa bản sao.
 */
import { useMemo, useState } from 'react'
import { Lock, TriangleAlert, X, ChevronRight, Plus, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useT } from '../../i18n/context'
import { useUiStore } from '../../store/uiStore'
import { useHarnessStore } from '../../store/harnessStore'
import { MODELS } from '../../lib/mock/harnesses'
import { ModelSelect } from './ModelSelect'
import type { Harness, Subagent } from '../../types/harness'

function mapSubagent(draft: Harness, id: string, fn: (sa: Subagent) => Subagent): Harness {
  return { ...draft, subagents: draft.subagents.map((sa) => (sa.id === id ? fn(sa) : sa)) }
}

export function HarnessEditor() {
  const t = useT()
  const editingHarnessId = useUiStore((s) => s.editingHarnessId)
  const setEditingHarnessId = useUiStore((s) => s.setEditingHarnessId)
  const setSection = useUiStore((s) => s.setSettingsSection)
  const harnessFromStore = useHarnessStore((s) => s.harnesses.find((h) => h.id === editingHarnessId) ?? null)
  const cloneHarness = useHarnessStore((s) => s.cloneHarness)
  const updateHarness = useHarnessStore((s) => s.updateHarness)

  const [draft, setDraft] = useState<Harness | null>(harnessFromStore)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [showAddSub, setShowAddSub] = useState(false)
  const [savedToast, setSavedToast] = useState(false)

  const goBack = () => {
    setSection('harness')
    setEditingHarnessId(null)
  }

  const noImageModels = useMemo(() => {
    if (!draft) return []
    const keys = new Set<string>([draft.model, ...draft.subagents.map((sa) => sa.model)])
    return MODELS.filter((m) => keys.has(m.key) && !m.supportsImages)
  }, [draft])

  if (!draft) {
    return (
      <div className="flex h-full items-center justify-center">
        <button type="button" onClick={goBack} className="text-sm text-accent hover:underline">
          {t('settings.backToApp')}
        </button>
      </div>
    )
  }

  const canEdit = !draft.isBuiltin

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const setSubEnabled = (id: string, enabled: boolean) =>
    setDraft((d) => (d ? mapSubagent(d, id, (sa) => ({ ...sa, enabled })) : d))
  const setSubModel = (id: string, model: string) =>
    setDraft((d) => (d ? mapSubagent(d, id, (sa) => ({ ...sa, model })) : d))
  const setSubPrompt = (id: string, systemPrompt: string) =>
    setDraft((d) => (d ? mapSubagent(d, id, (sa) => ({ ...sa, systemPrompt })) : d))
  const removeSub = (id: string) =>
    setDraft((d) => (d ? { ...d, subagents: d.subagents.filter((sa) => sa.id !== id) } : d))

  const addSub = (sub: Omit<Subagent, 'id' | 'isBuiltin'>) => {
    setDraft((d) =>
      d
        ? {
            ...d,
            subagents: [
              ...d.subagents,
              { ...sub, id: Math.random().toString(36).slice(2, 10), isBuiltin: false },
            ],
          }
        : d,
    )
    setShowAddSub(false)
  }

  const handleClone = () => {
    const newId = cloneHarness(draft.id)
    if (newId) setEditingHarnessId(newId)
  }

  const handleSave = () => {
    updateHarness(draft.id, draft)
    setSavedToast(true)
    window.setTimeout(() => setSavedToast(false), 2000)
  }

  const onModelChange = (key: string) => {
    const m = MODELS.find((mm) => mm.key === key)
    setDraft((d) => (d ? { ...d, model: key, supportsImages: m?.supportsImages ?? d.supportsImages } : d))
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl space-y-4 p-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs">
            <button type="button" onClick={goBack} className="text-muted hover:text-fg">
              {t('settings.title')}
            </button>
            <span className="text-muted">›</span>
            <button type="button" onClick={goBack} className="text-muted hover:text-fg">
              {t('settings.sections.agentsLabel')}
            </button>
            <span className="text-muted">›</span>
            <button type="button" onClick={goBack} className="text-muted hover:text-fg">
              {t('settings.sections.harness')}
            </button>
            <span className="text-muted">›</span>
            <span className="text-fg">{t('settings.harness.editor.title')}</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{draft.name}</h1>
            {draft.isBuiltin && <Lock className="size-4 text-muted" />}
            <div className="ml-auto">
              <button
                type="button"
                onClick={handleClone}
                className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-sm text-accentfg"
              >
                <Copy className="size-4" />
                {t('settings.harness.clone')}
              </button>
            </div>
          </div>

          {/* Cảnh báo ảnh */}
          {noImageModels.length > 0 && !bannerDismissed && (
            <div className="flex items-start gap-3 rounded-lg border border-warn/30 bg-warn/10 p-3">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warn" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-warn">
                  {t('settings.harness.editor.imageWarningTitle')}
                </div>
                <div className="text-xs text-muted">
                  {t('settings.harness.editor.imageWarningDetail', {
                    models: noImageModels.map((m) => m.label).join(', '),
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                className="text-muted hover:text-fg"
                aria-label={t('common.close')}
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-muted">{t('settings.harness.editor.name')}</label>
              <input
                value={draft.name}
                disabled={!canEdit}
                onChange={(e) => setDraft((d) => (d ? { ...d, name: e.target.value } : d))}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm disabled:opacity-60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">{t('settings.harness.editor.description')}</label>
              <textarea
                value={draft.description}
                disabled={!canEdit}
                rows={3}
                onChange={(e) => setDraft((d) => (d ? { ...d, description: e.target.value } : d))}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm disabled:opacity-60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">{t('settings.harness.editor.model')}</label>
              <ModelSelect value={draft.model} disabled={!canEdit} onChange={onModelChange} />
            </div>
          </div>

          {/* Subagents */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">{t('settings.harness.editor.subagents')}</h2>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setShowAddSub((v) => !v)}
                  className="text-sm text-accent hover:underline"
                >
                  {t('settings.harness.editor.addSubagent')}
                </button>
              )}
            </div>

            <div className="space-y-2">
              {draft.subagents.map((sa) => (
                <SubagentCard
                  key={sa.id}
                  harness={draft}
                  subagent={sa}
                  expanded={expanded.has(sa.id)}
                  onToggleExpand={() => toggleExpand(sa.id)}
                  onToggleEnabled={(v) => setSubEnabled(sa.id, v)}
                  onModelChange={(key) => setSubModel(sa.id, key)}
                  onPromptChange={(v) => setSubPrompt(sa.id, v)}
                  onDelete={() => removeSub(sa.id)}
                />
              ))}
            </div>

            {showAddSub && canEdit && (
              <AddSubagentForm onAdd={addSub} onCancel={() => setShowAddSub(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Thanh lưu */}
      <div className="flex shrink-0 justify-end border-t border-line bg-panel px-4 py-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-accentfg"
        >
          {t('settings.harness.editor.save')}
        </button>
      </div>

      {/* Toast đã lưu */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-surface2 px-4 py-2 text-sm shadow-lg"
          >
            {t('settings.harness.editor.saved')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SubagentCard({
  harness,
  subagent,
  expanded,
  onToggleExpand,
  onToggleEnabled,
  onModelChange,
  onPromptChange,
  onDelete,
}: {
  harness: Harness
  subagent: Subagent
  expanded: boolean
  onToggleExpand: () => void
  onToggleEnabled: (enabled: boolean) => void
  onModelChange: (key: string) => void
  onPromptChange: (prompt: string) => void
  onDelete: () => void
}) {
  const t = useT()
  const canEdit = !harness.isBuiltin
  const checkboxDisabled = subagent.isBuiltin || harness.isBuiltin

  return (
    <div className="rounded-card border border-line bg-surface p-3">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={subagent.enabled}
          disabled={checkboxDisabled}
          onChange={(e) => onToggleEnabled(e.target.checked)}
          className="size-4 shrink-0 disabled:opacity-60"
        />
        <button type="button" onClick={onToggleExpand} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <ChevronRight
            className={`size-4 shrink-0 text-muted transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
          <span className="truncate text-sm font-medium">{subagent.name}</span>
        </button>
        <span className="shrink-0 rounded-chip bg-surface2 px-2 py-0.5 text-xs text-muted">
          {subagent.isBuiltin ? t('settings.harness.builtIn') : t('settings.harness.custom')}
        </span>
        <ModelSelect
          value={subagent.model}
          disabled={!canEdit}
          compact
          onChange={onModelChange}
        />
        {!subagent.isBuiltin && canEdit && (
          <button
            type="button"
            onClick={onDelete}
            className="shrink-0 text-muted hover:text-danger"
            aria-label={t('settings.harness.delete')}
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <div className="mb-1 text-xs text-muted">{t('settings.harness.editor.systemPrompt')}</div>
              <div className="mb-1 text-xs text-muted">{t('settings.harness.editor.systemPromptHelper')}</div>
              <textarea
                value={subagent.systemPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder={t('settings.harness.editor.systemPromptPlaceholder')}
                className="min-h-[80px] w-full rounded-lg border border-line bg-panel p-2 font-mono text-xs"
              />
              <div className="text-right text-xs text-muted">{subagent.systemPrompt.length}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AddSubagentForm({
  onAdd,
  onCancel,
}: {
  onAdd: (sub: Omit<Subagent, 'id' | 'isBuiltin'>) => void
  onCancel: () => void
}) {
  const t = useT()
  const [name, setName] = useState('')
  const [model, setModel] = useState(MODELS[0].key)

  const submit = () => {
    onAdd({ name: name.trim() || 'Subagent', description: '', model, enabled: true, systemPrompt: '' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="mt-2 rounded-card border border-line bg-surface p-3"
    >
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[160px] flex-1">
          <label className="mb-1 block text-xs text-muted">{t('settings.harness.editor.name')}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{t('settings.harness.editor.model')}</label>
          <ModelSelect value={model} onChange={setModel} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface2 hover:text-fg"
          >
            {t('common.close')}
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm text-accentfg"
          >
            <Plus className="size-4" />
            {t('chatHeader.more')}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
