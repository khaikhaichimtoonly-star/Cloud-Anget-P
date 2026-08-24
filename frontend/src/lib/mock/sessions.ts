/**
 * Danh sách phiên giả cho thanh bên trái.
 *
 * Mỗi phiên mang thêm CHẾ ĐỘ và SỐ GIẤY PHÉP còn hiệu lực — hai thứ Devin và
 * OpenHands không hiện ở danh sách phiên. Mục đích: trạng thái bảo mật của
 * mọi phiên nhìn thấy được từ một chỗ, không phải mở từng phiên ra xem.
 */
import type { SessionSummary } from '../../types/session'

/** Phiên đang mở — kịch bản demo chạy trên phiên này. */
export const ACTIVE_SESSION_ID = 's-01'

export const MOCK_SESSIONS: SessionSummary[] = [
  {
    session_id: ACTIVE_SESSION_ID,
    initials: 'SP',
    title: 'Sửa lỗi parser trong src/parser.py và thêm test',
    relative_time: '3 phút',
    status: 'dang_chay',
    mode: 'PLAN',
    active_lease_count: 0,
  },
  {
    session_id: 's-02',
    initials: 'GH',
    title: 'Gộp hai bảng người dùng trong migration 0042',
    relative_time: '26 phút',
    status: 'cho_nguoi_dung',
    mode: 'ACT',
    active_lease_count: 2,
  },
  {
    session_id: 's-03',
    initials: 'ĐT',
    title: 'Đổi tên biến môi trường cho dịch vụ thanh toán',
    relative_time: '2 giờ',
    status: 'da_tu_choi',
    mode: 'ACT',
    active_lease_count: 0,
  },
  {
    session_id: 's-04',
    initials: 'CT',
    title: 'Cắt ảnh sản phẩm và xuất bộ thumbnail',
    relative_time: '5 giờ',
    status: 'xong',
    mode: 'ACT',
    active_lease_count: 0,
  },
  {
    session_id: 's-05',
    initials: 'TK',
    title: 'Tìm kiếm tài liệu API của nhà cung cấp mới',
    relative_time: 'hôm qua',
    status: 'het_ngan_sach',
    mode: 'ACT',
    active_lease_count: 1,
  },
  {
    session_id: 's-06',
    initials: 'VB',
    title: 'Viết báo cáo tuần từ log build',
    relative_time: '2 ngày',
    status: 'xong',
    mode: 'PLAN',
    active_lease_count: 0,
  },
]

export const MOCK_ACCOUNT = {
  displayName: 'khải vũ (tôi)',
  email: 'khaikhaichimtoonly@gmail.com',
  initials: 'KV',
  workspace: 'agent-box / máy cá nhân',
}
