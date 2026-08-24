/**
 * Kiểu dữ liệu cho Harness (bộ agent + subagent) và model.
 *
 * Một harness là một cấu hình: model chính, có hỗ trợ ảnh hay không, mặc định
 * cho nhóm/cá nhân, và danh sách subagent. Mỗi subagent có thể bật/tắt, đổi
 * model, và nhận thêm system prompt do người dùng viết.
 */

export interface Subagent {
  id: string
  /** "Explore", "Plan", "Design", "Build", "Debug", "Review" hoặc tên custom */
  name: string
  /** Mô tả ngắn tiếng Việt */
  description: string
  /** key của model (khớp với ModelOption.key) */
  model: string
  enabled: boolean
  isBuiltin: boolean
  /** Prompt bổ sung từ người dùng, được nối vào system prompt sẵn có */
  systemPrompt: string
}

export interface Harness {
  id: string
  name: string
  description: string
  model: string
  supportsImages: boolean
  isBuiltin: boolean
  defaultFor: ('team' | 'my')[]
  subagents: Subagent[]
}

export interface ModelOption {
  key: string
  label: string
  supportsImages: boolean
  /** tên màu dùng cho chấm định danh: blue | purple | emerald | amber */
  color: string
}
