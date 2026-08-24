/**
 * Dữ liệu giả cho Harness: danh sách model, 4 harness built-in và 2 harness
 * tuỳ chỉnh. Đây là dữ liệu demo, không phải chữ khung giao diện.
 */
import type { Harness, ModelOption, Subagent } from '../../types/harness'

export const MODELS: ModelOption[] = [
  { key: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', supportsImages: true, color: 'blue' },
  { key: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', supportsImages: true, color: 'purple' },
  { key: 'ollama-qwen3-8b', label: 'Ollama Qwen3 8B', supportsImages: false, color: 'emerald' },
  { key: 'deepseek-v4', label: 'DeepSeek V4', supportsImages: false, color: 'amber' },
]

/** 6 subagent chuẩn theo tên + mô tả ngắn tiếng Việt. */
const SUBAGENT_DEFS: ReadonlyArray<readonly [string, string, string]> = [
  ['explore', 'Explore', 'Khám phá codebase, tìm vị trí cần sửa.'],
  ['plan', 'Plan', 'Lập kế hoạch từng bước trước khi làm.'],
  ['design', 'Design', 'Thiết kế kiến trúc và giao diện.'],
  ['build', 'Build', 'Thực thi thay đổi, viết code.'],
  ['debug', 'Debug', 'Chạy, kiểm tra và sửa lỗi.'],
  ['review', 'Review', 'Rà soát diff trước khi báo hoàn thành.'],
]

function makeSubagents(model: string, isBuiltin: boolean, enabledIds: Set<string>): Subagent[] {
  return SUBAGENT_DEFS.map(([id, name, description]) => ({
    id,
    name,
    description,
    model,
    enabled: enabledIds.has(id),
    isBuiltin,
    systemPrompt: '',
  }))
}

const ALL_IDS = new Set(SUBAGENT_DEFS.map(([id]) => id))
const NO_DEBUG_REVIEW = new Set(['explore', 'plan', 'design', 'build'])
const EXPLORE_REVIEW = new Set(['explore', 'review'])

/**
 * Tạo 6 subagent mặc định (isBuiltin=false, bật hết) cho harness mới do người
 * dùng tạo. Component gọi khi bấm "+ Harness mới".
 */
export function makeDefaultSubagents(model: string): Subagent[] {
  return makeSubagents(model, false, ALL_IDS)
}

export const BUILTIN_HARNESSES: Harness[] = [
  {
    id: 'builtin-gemini-flash',
    name: 'Gemini Flash code + review',
    description: 'Harness nhanh cho code và review, dùng Gemini 2.5 Flash.',
    model: 'gemini-2.5-flash',
    supportsImages: true,
    isBuiltin: true,
    defaultFor: ['team'],
    subagents: makeSubagents('gemini-2.5-flash', true, ALL_IDS),
  },
  {
    id: 'builtin-gemini-pro',
    name: 'Gemini Pro plan-first',
    description: 'Ưu tiên lập kế hoạch kỹ với Gemini 2.5 Pro.',
    model: 'gemini-2.5-pro',
    supportsImages: true,
    isBuiltin: true,
    defaultFor: ['my'],
    subagents: makeSubagents('gemini-2.5-pro', true, ALL_IDS),
  },
  {
    id: 'builtin-ollama',
    name: 'Ollama local — chỉ đọc',
    description: 'Chạy local, không gửi ảnh, chỉ Explore/Plan/Design/Build.',
    model: 'ollama-qwen3-8b',
    supportsImages: false,
    isBuiltin: true,
    defaultFor: [],
    subagents: makeSubagents('ollama-qwen3-8b', true, NO_DEBUG_REVIEW),
  },
  {
    id: 'builtin-deepseek',
    name: 'DeepSeek nhanh — rẻ',
    description: 'Harness rẻ cho việc lặp nhanh, không hỗ trợ ảnh.',
    model: 'deepseek-v4',
    supportsImages: false,
    isBuiltin: true,
    defaultFor: [],
    subagents: makeSubagents('deepseek-v4', true, ALL_IDS),
  },
]

export const MOCK_CUSTOM_HARNESSES: Harness[] = [
  {
    id: 'custom-do-an',
    name: 'Dự án đồ án tốt nghiệp',
    description: 'Harness tuỳ chỉnh cho đồ án, ưu tiên Plan và Build.',
    model: 'gemini-2.5-pro',
    supportsImages: true,
    isBuiltin: false,
    defaultFor: [],
    subagents: makeSubagents('gemini-2.5-pro', false, ALL_IDS),
  },
  {
    id: 'custom-code-review',
    name: 'Code review riêng cho PR',
    description: 'Chỉ chạy Explore và Review cho việc rà soát PR.',
    model: 'deepseek-v4',
    supportsImages: false,
    isBuiltin: false,
    defaultFor: [],
    subagents: makeSubagents('deepseek-v4', false, EXPLORE_REVIEW),
  },
]
