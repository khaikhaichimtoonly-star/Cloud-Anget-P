/**
 * Kiểu dữ liệu thuần giao diện — không cần khớp schema backend, nhưng vẫn
 * tái dùng ba trục nhãn để mỗi mảnh nội dung có chấm màu đúng (mục 12.6).
 */
import type { Confidentiality, Integrity } from './labels'
import type { ToolName } from './lease'

export type FileNodeKind = 'file' | 'dir'

export interface FileNode {
  path: string // đường dẫn tương đối trong workspace, dùng làm id
  name: string
  kind: FileNodeKind
  children?: FileNode[]
  /** Chỉ file mới có nhãn + nội dung; thư mục không mang nhãn riêng. */
  integrity?: Integrity
  confidentiality?: Confidentiality
  source_uri?: string
  content_hash?: string
  /** Nội dung văn bản thuần — không có file nào được sửa trong giao diện (mục 12.3). */
  content?: string
}

export type TerminalLineKind = 'prompt' | 'stdout' | 'stderr' | 'exit'

export interface TerminalLine {
  kind: TerminalLineKind
  text: string
}

/**
 * Một dòng trong khung hội thoại ①. `agent_step` gộp cả ba thứ ReAct
 * (suy nghĩ, tool gọi, kết quả) làm một để hiện gọn theo mục 12.5 đầu bài.
 */
export type ChatMessage =
  | { id: string; kind: 'user_text'; text: string; created_at: string }
  | {
      id: string
      kind: 'agent_text'
      text: string
      label_id: string
      integrity: Integrity
      confidentiality: Confidentiality
      created_at: string
    }
  /**
   * Một bước ReAct. Ba phần (suy nghĩ → gọi tool → kết quả) đến RỜI NHAU qua
   * ba sự kiện khác nhau, nên mọi trường sau `thought` đều tuỳ chọn: lúc mới
   * bắt đầu bước thì chưa có tool, lúc gọi tool thì chưa có kết quả.
   */
  | {
      id: string
      kind: 'agent_step'
      thought: string
      tool_name?: ToolName
      params?: Record<string, string>
      result_preview?: string
      truncated_lines?: number
      label_id?: string
      integrity?: Integrity
      confidentiality?: Confidentiality
      created_at: string
    }
  | { id: string; kind: 'permission_request'; request_id: string; created_at: string }
  | { id: string; kind: 'mode_switch'; created_at: string }
  | { id: string; kind: 'system_note'; text: string; created_at: string }
