/**
 * Khung ① — Chat.
 */
import { useAgentStore } from '../../store/agentStore'
import { useUiStore } from '../../store/uiStore'
import { useT } from '../../i18n/context'
import type { ChatMessage } from '../../types/ui'
import { LabelDot } from '../LabelDot'
import { PlainText, Chip } from '../ui'
import { motion, AnimatePresence } from 'motion/react'
import { Bot, Brain } from 'lucide-react'

export function ChatPanel() {
  const t = useT()
  const messages = useAgentStore((s) => s.messages)
  const requests = useAgentStore((s) => s.requests)
  const proposal = useAgentStore((s) => s.proposal)
  const openTab = useUiStore((s) => s.openTab)

  const pendingRequestIds = Object.values(requests)
    .filter((r) => r.status === 'dang_cho')
    .map((r) => r.request_id)

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <p className="mb-2 text-[14px] font-semibold">{t('chat.empty.title')}</p>
          <p className="text-[12px] leading-relaxed text-muted">{t('chat.empty.body')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 p-3">
      <AnimatePresence>
        {messages.map((message, idx) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <MessageRow
              message={message}
              hasPendingPermission={pendingRequestIds.includes(
                message.kind === 'permission_request' ? message.request_id : '',
              )}
              hasModeSwitch={proposal !== null && message.kind === 'mode_switch'}
              onOpenPermission={() => openTab('labels')}
              onOpenModeSwitch={() => openTab('plan')}
              showDivider={
                idx > 0 &&
                messages[idx - 1].kind !== 'agent_step' &&
                message.kind === 'agent_step'
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function MessageRow({
  message, hasPendingPermission, hasModeSwitch, onOpenPermission, onOpenModeSwitch, showDivider,
}: {
  message: ChatMessage
  hasPendingPermission: boolean
  hasModeSwitch: boolean
  onOpenPermission: () => void
  onOpenModeSwitch: () => void
  showDivider: boolean
}) {
  switch (message.kind) {
    case 'user_text':
      return <UserBubble text={message.text} />
    case 'agent_text':
      return <AgentBubble message={message} />
    case 'agent_step':
      return <StepBlock message={message} showDivider={showDivider} />
    case 'system_note':
      return <p className="py-1 text-center text-[11px] italic text-muted">{message.text}</p>
    case 'permission_request':
      return (
        <PermissionChatRow requestId={message.request_id} pending={hasPendingPermission} onClick={onOpenPermission} />
      )
    case 'mode_switch':
      return <ModeSwitchChatRow pending={hasModeSwitch} onClick={onOpenModeSwitch} />
  }
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] rounded-2xl rounded-br-md bg-surface px-3 py-2 text-[13px] leading-relaxed text-fg">
        {text}
      </div>
    </div>
  )
}

function AgentBubble({ message }: { message: Extract<ChatMessage, { kind: 'agent_text' }> }) {
  return (
    <div className="flex gap-2">
      <Bot className="mt-0.5 size-4 shrink-0 text-muted" />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] leading-relaxed">{message.text}</div>
        <div className="mt-1 flex items-center gap-1.5">
          <LabelDot integrity={message.integrity} confidentiality={message.confidentiality} />
          <span className="text-[10px] text-muted">{message.label_id}</span>
        </div>
      </div>
    </div>
  )
}

function StepBlock({ message, showDivider }: { message: Extract<ChatMessage, { kind: 'agent_step' }>; showDivider: boolean }) {
  return (
    <>
      {showDivider && <div className="my-2 border-t border-line" />}
      <div className="flex gap-2 bg-surface rounded-lg px-3 py-2">
        <Brain className="mt-0.5 size-4 shrink-0 text-muted" />
        <div className="min-w-0 flex-1 text-[12px] leading-relaxed">
          {message.thought && <p className="mb-1 text-muted italic">{message.thought}</p>}
          {message.tool_name && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip tone="brand">{message.tool_name}</Chip>
              {message.params && (
                <span className="truncate text-[11px] font-mono text-muted">
                  {Object.entries(message.params).map(([k, v]) => `${k}=${String(v).slice(0, 60)}`).join(' ')}
                </span>
              )}
            </div>
          )}
          {message.result_preview && (
            <div className="mt-1.5 rounded border border-line bg-panel p-2">
              <PlainText text={message.result_preview} />
              {message.truncated_lines && message.truncated_lines > 0 && (
                <p className="mt-1 text-[10px] text-muted">…đã cắt bớt {message.truncated_lines} dòng</p>
              )}
            </div>
          )}
          {message.label_id && (
            <div className="mt-1 flex items-center gap-1.5">
              <LabelDot integrity={message.integrity} confidentiality={message.confidentiality} />
              <span className="text-[10px] text-muted">{message.label_id}</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function PermissionChatRow({ requestId, pending, onClick }: { requestId: string; pending: boolean; onClick: () => void }) {
  const t = useT()
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 rounded-md border border-line p-2 text-left hover:bg-surface2">
      <span className={`size-2 rounded-full ${pending ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
      <span className="flex-1 text-[12px]">
        {pending ? t('chat.permissionPending', { id: requestId }) : t('chat.permissionResolved', { id: requestId })}
      </span>
      <span className="text-[11px] text-accent">{t('chat.view')}</span>
    </button>
  )
}

function ModeSwitchChatRow({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  const t = useT()
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 rounded-md border border-warn/30 bg-warn/5 p-2 text-left hover:bg-surface2">
      <span className={`size-2 rounded-full ${pending ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
      <span className="flex-1 text-[12px]">{t('chat.modeSwitchPending')}</span>
      <span className="text-[11px] text-accent">{t('chat.view')}</span>
    </button>
  )
}
