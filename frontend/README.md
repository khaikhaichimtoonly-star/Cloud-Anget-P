# Frontend — giao diện web

React + Vite + TypeScript + Tailwind. Đây là **tầng 1** của kiến trúc bảy tầng.

Tài liệu: [`../docs/plan/agent-box-plan.md`](../docs/plan/agent-box-plan.md), **Phần XII**.

Quyết định đã chốt ở mục 12.1: **giao diện web, không làm CLI.**

## Năm khung — `src/panels/`

Bảng 12.2 của kế hoạch. Khung ⑤ là khung mà Devin và OpenHands đều không có.

| File đề xuất | Khung | Nội dung | Ghi chú bảo mật |
|---|---|---|---|
| `ChatPanel.tsx` | ① Hội thoại + Hỏi/Đáp | Dòng hội thoại, thẻ xin quyền hiện trong luồng này | — |
| `FileTreePanel.tsx` | ② Cây file + xem nội dung | Chấm màu cạnh mỗi file = nhãn của file đó | Nội dung file là dữ liệu bẩn — render **văn bản thuần** |
| `TerminalPanel.tsx` | ③ Terminal | `xterm.js` | **Chỉ đọc.** Người dùng không gõ được vào đây |
| `SandboxScreenPanel.tsx` | ④ Màn hình sandbox | `noVNC` | **Chỉ xem.** Không điều khiển được |
| `LabelsLeasesPanel.tsx` | ⑤ Bảng Nhãn & Giấy phép | Nhãn đang có trong ngữ cảnh, các giấy phép còn hạn, phạm vi từng cái | Đây là khung làm cơ chế bảo mật **nhìn thấy được** |

## Hai thẻ quan trọng nhất — `src/components/`

| File đề xuất | Mục | Vì sao quan trọng |
|---|---|---|
| `PermissionCard.tsx` | 12.5 | Thẻ xin quyền. Phải hiện đủ **năm thứ**: việc gì · nội dung nguyên văn (diff cho `write_file`) · vì sao phải hỏi · nguồn gốc bấm được · các nút |
| `ModeSwitchCard.tsx` | **12.5.1** | Thẻ chuyển chế độ Plan → Act. Ít gặp hơn nhưng **nặng hơn**: một cú bấm cấp giấy phép trùm cả một phạm vi trong 30 phút |

### Ba luật tuyệt đối cho hai thẻ này

1. **Không có nút "luôn cho phép" hay "đừng hỏi lại".** Đây chính xác là lỗi mà arXiv 2510.26328 chỉ ra, và cơ chế của dự án tồn tại để chặn nó. Thêm nút đó là bỏ luôn đóng góp.
2. **Mọi nội dung bẩn render dạng văn bản thuần, không dựng thành HTML.** Nếu một chỉ thị độc trong `README.md` được render thành HTML trong giao diện thì đã mở thêm một kênh tấn công ngay trong công cụ bảo mật.
3. **Dòng phạm vi trên `ModeSwitchCard` phải khớp tuyệt đối** `canonical_resources` của giấy phép sẽ được cấp. Ca test **T7f** kiểm đúng điều này — lệch một đường dẫn cũng là lỗi, vì đó là thứ người dùng đọc để đồng ý.

## Các thư mục còn lại

| Thư mục | Nội dung |
|---|---|
| `src/hooks/` | `useWebSocket.ts` (kết nối lại thì hiện lại yêu cầu còn hạn, mục 12.4), `usePermissionRequests.ts` |
| `src/lib/` | Client gọi API, hàm định dạng, hàm map nhãn sang màu |
| `src/types/` | Kiểu TypeScript **sinh từ schema của backend**, không gõ tay lại — nhãn và giấy phép lệch kiểu giữa hai bên là một lớp bug rất khó thấy |
| `public/` | Tài nguyên tĩnh |

## Bốn quy tắc luồng không đồng bộ (mục 12.4)

Vòng lặp agent là đồng bộ, giao diện web thì không. Bốn quy tắc phải cài đúng:

1. Yêu cầu quyền có thời hạn **10 phút**; quá hạn tính là **từ chối**.
2. Trả lời phải kèm `request_id` và backend kiểm `task_epoch` còn khớp — chặn việc trả lời một thẻ của phiên cũ.
3. Agent **dừng thật** khi chờ, không chạy tiếp đoán trước câu trả lời.
4. Mất WebSocket rồi kết nối lại thì hiện lại các yêu cầu **còn hạn**.

## Trang Cài đặt — `src/components/settings/`

Trang Cài đặt thay thế toàn bộ giao diện chính khi người dùng bấm "Cài đặt" ở thanh bên. Cấu trúc: thanh trên (nút quay lại + tiêu đề + ThemeToggle), thanh bên trái (14 mục nav chia 4 nhóm: AGENTS, MACHINES, FEATURES, ADMINISTRATION), và vùng nội dung bên phải.

| File | Mục | Nội dung |
|---|---|---|
| `SettingsShell.tsx` | Layout toàn trang | Thanh trên + sidebar + vùng nội dung với AnimatePresence fade 150ms |
| `SettingsSidebar.tsx` | Thanh nav trái | 14 mục với lucide icons, 4 nhóm, active highlight |
| `AppearanceSettings.tsx` | Giao diện | Chọn theme Dark / Light / System + ngôn ngữ VI / EN |
| `HarnessList.tsx` | Danh sách Harness | Bảng với tìm kiếm, bộ chọn mặc định, nút view/clone/edit/delete |
| `HarnessEditor.tsx` | Trang sửa Harness | Form tên/mô tả/model, danh sách subagent với system prompt mở rộng, cảnh báo ảnh |
| `ModelSelect.tsx` | Bộ chọn model | Dropdown danh sách model (Gemini, Groq, OpenRouter) |
| `PlaceholderSettings.tsx` | Mục chưa làm | Icon + tiêu đề + badge "Sắp có" cho 12/14 mục còn lại |

### Store Harness — `src/store/harnessStore.ts`

Zustand + persist vào `localStorage` (key `agent-box:harnesses`). Hỗ trợ:
- 4 model (Gemini 2.5 Flash/Pro, Groq Llama, OpenRouter)
- 4 built-in harness (General, Code Review, Design Review, Security Audit) — không xoá được
- 2 custom harness mẫu
- 6 built-in subagent (Explore, Plan, Design, Build, Debug, Review)
- CRUD đầy đủ: thêm/sửa/xoá harness, thêm/xoá subagent, sửa system prompt

## Hệ thống thiết kế — CSS Tokens

Toàn bộ giao diện dùng CSS custom properties định nghĩa trong `src/index.css`, qua `@theme inline` của Tailwind v4. Dark mode là mặc định, light mode kích hoạt bằng class `.light` trên `<html>`.

| Token | Dark (mặc định) | Light | Dùng cho |
|---|---|---|---|
| `bg-bg` | `240 6% 7%` | `240 6% 97%` | Nền toàn trang |
| `bg-panel` | `240 6% 10%` | `240 6% 100%` | Nền panel, thanh bên |
| `bg-surface` | `240 6% 12%` | `240 6% 95%` | Thẻ nổi (card) |
| `bg-surface2` | `240 5% 17%` | `240 5% 89%` | Hover, chip |
| `text-fg` | `220 15% 88%` | `240 10% 14%` | Chữ chính |
| `text-muted` | `240 5% 55%` | `240 5% 45%` | Chữ phụ |
| `text-accent` | `239 84% 67%` | `239 84% 58%` | Indigo — nút chính, link |
| `text-success` | `155 70% 48%` | (kế thừa) | Thành công, được phép |
| `text-warn` | `38 92% 56%` | (kế thừa) | Cảnh báo, không tin được |
| `text-danger` | `0 75% 55%` | (kế thừa) | Nguy hiểm, từ chối |
| `rounded-card` | `16px` | — | Bo góc thẻ |
| `rounded-chip` | `24px` | — | Bo góc chip/badge |
| `bg-terminal` | `#131418` | `#f6f8fa` | Nền terminal |
| `text-terminal-fg` | `#c9d1d9` | `#1f2328` | Chữ terminal |

### Animation (motion/react)

- Tin nhắn chat: fade + slide-up 8px, 150ms
- Tab panel: fade 120ms khi chuyển tab
- Section Cài đặt: fade 150ms giữa các mục
- Subagent card: expand/collapse height 200ms
