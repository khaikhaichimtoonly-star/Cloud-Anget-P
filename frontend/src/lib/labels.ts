/**
 * Bảng màu nhãn thống nhất (đầu bài) + hai hàm suy ra integrity_floor /
 * confidentiality_ceiling (mục 9.3). Đừng chỉ dùng màu — mỗi mục có nhãn
 * chữ tiếng Việt để người mù màu / ảnh chụp đen trắng vẫn đọc được.
 */
import { CONFIDENTIALITY_ORDER, INTEGRITY_ORDER, type Confidentiality, type Integrity } from '../types/labels'

export interface AxisMeta {
  value: string
  /** Nhãn tiếng Việt hiển thị. */
  label: string
  /** Lớp Tailwind cho chấm màu. */
  dotClass: string
  /** Lớp Tailwind cho chữ/badge. Dùng CSS token — tự đổi giữa sáng/tối. */
  badgeClass: string
}

export const INTEGRITY_META: Record<Integrity, AxisMeta> = {
  duoc_nguoi_dung_cho_phep: {
    value: 'duoc_nguoi_dung_cho_phep',
    label: 'Được người dùng cho phép',
    dotClass: 'bg-success',
    badgeClass: 'bg-success/10 text-success ring-1 ring-success/40',
  },
  khong_tin_duoc: {
    value: 'khong_tin_duoc',
    label: 'Không tin được',
    dotClass: 'bg-warn',
    badgeClass: 'bg-warn/10 text-warn ring-1 ring-warn/40',
  },
}

export const CONFIDENTIALITY_META: Record<Confidentiality, AxisMeta> = {
  cong_khai: {
    value: 'cong_khai',
    label: 'Công khai',
    dotClass: 'bg-slate-400',
    badgeClass: 'bg-surface2 text-muted ring-1 ring-line',
  },
  noi_bo: {
    value: 'noi_bo',
    label: 'Nội bộ',
    dotClass: 'bg-accent',
    badgeClass: 'bg-accent/15 text-accent ring-1 ring-accent/40',
  },
  bi_mat: {
    value: 'bi_mat',
    label: 'Bí mật',
    dotClass: 'bg-danger',
    badgeClass: 'bg-danger/10 text-danger ring-1 ring-danger/40',
  },
}

/**
 * integrity_floor = min(integrity của mọi artifact trong ngữ cảnh).
 * KHÔNG_TIN_ĐƯỢC < ĐƯỢC_CHO_PHÉP → một artifact bẩn làm cả ngữ cảnh bẩn.
 * Ngữ cảnh rỗng coi là sạch (mặc định của một phiên mới).
 */
export function computeIntegrityFloor(items: readonly { integrity: Integrity }[]): Integrity {
  let floorIndex = INTEGRITY_ORDER.length - 1
  for (const item of items) {
    const idx = INTEGRITY_ORDER.indexOf(item.integrity)
    if (idx < floorIndex) floorIndex = idx
  }
  return INTEGRITY_ORDER[floorIndex]
}

/**
 * confidentiality_ceiling = max(confidentiality của mọi artifact).
 * CÔNG_KHAI < NỘI_BỘ < BÍ_MẬT → một artifact bí mật làm cả ngữ cảnh bí mật.
 * Ngữ cảnh rỗng coi là công khai (mặc định của một phiên mới).
 */
export function computeConfidentialityCeiling(
  items: readonly { confidentiality: Confidentiality }[],
): Confidentiality {
  let ceilingIndex = 0
  for (const item of items) {
    const idx = CONFIDENTIALITY_ORDER.indexOf(item.confidentiality)
    if (idx > ceilingIndex) ceilingIndex = idx
  }
  return CONFIDENTIALITY_ORDER[ceilingIndex]
}
