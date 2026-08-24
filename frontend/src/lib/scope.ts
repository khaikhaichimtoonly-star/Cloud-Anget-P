/**
 * Hàm sinh "dòng phạm vi đã gộp" cho ModeSwitchCard (mục 12.5.1, chốt 1).
 * Đây là hàm bị ca test T7f kiểm — output phải khớp tuyệt đối với
 * `canonical_resources` của giấy phép sẽ được cấp, không viết cứng ở
 * component. Hàm THUẦN, không phụ thuộc i18n runtime để test dễ khẳng định.
 */
import type { ModeSwitchProposal } from '../types/agent'

/**
 * Sinh câu phạm vi đã gộp từ đúng canonical_resources + thời hạn của lease
 * đề xuất. Nếu `bundled_lease_rejected` thì trả về câu cảnh báo cố định của
 * mục 12.5.1 (chốt 2) — không có canonical_resources nào để nói tới.
 */
export function buildBundledScopeLine(proposal: ModeSwitchProposal): string {
  if (proposal.bundled_lease_rejected || !proposal.proposed_lease) {
    return 'Phạm vi kế hoạch quá rộng nên sẽ không cấp giấy phép gộp — mỗi bước ghi file hoặc chạy lệnh sẽ hỏi riêng.'
  }
  const { canonical_resources, duration_minutes } = proposal.proposed_lease
  const resourceList = formatResourceList(canonical_resources)
  return `Nếu bấm chuyển, agent được đọc và ghi trong ${resourceList} trong ${duration_minutes} phút, và không được gửi dữ liệu ra ngoài.`
}

/** "src/**" hoặc "src/** và tests/**" hoặc "src/**, tests/** và docs/**". */
export function formatResourceList(resources: readonly string[]): string {
  const quoted = resources.map((r) => `\`${r}\``)
  if (quoted.length === 0) return ''
  if (quoted.length === 1) return quoted[0]
  if (quoted.length === 2) return `${quoted[0]} và ${quoted[1]}`
  return `${quoted.slice(0, -1).join(', ')} và ${quoted[quoted.length - 1]}`
}
