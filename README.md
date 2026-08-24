# Agent Box

> **Tên dự án chưa chốt.** Repo hiện tên `Cloud-Anget-P`; "Anget" là lỗi chính tả của "Agent", và "Cloud" đi ngược thông điệp local-first của sản phẩm. Đây là một trong ba điểm phải quyết trước tuần 0 (mục 16.3 của bản kế hoạch).

Một **AI Computer tự host** — agent có một máy tính riêng để làm việc: đọc file, chạy lệnh, điều khiển trình duyệt — trong đó:

- mọi dữ liệu đi vào agent đều mang **nhãn nguồn gốc**: đến từ đâu, có được quyền chỉ đạo agent không, được gửi ra đâu;
- mọi hành động ra ngoài (ghi file, chạy lệnh, gửi mạng) đều cần một **cho phép có phạm vi và có thời hạn**, được cấp **sau** thời điểm dữ liệu bẩn nhất đi vào ngữ cảnh.

Điều kiện "**cấp sau**" là chỗ khác biệt. Nó chặn đúng lỗi mà các agent hiện tại mắc: người dùng đồng ý một hành động vô hại, rồi chuẩn thuận đó bị mang sang đúng bước rò rỉ dữ liệu mà không phát sinh thêm một lần hỏi nào (arXiv 2510.26328).

**Trạng thái: đang ở giai đoạn thiết kế.** Chưa có code chạy được. Cấu trúc thư mục dưới đây là bộ khung để bắt đầu.

## Tài liệu

| | |
|---|---|
| **[Bản kế hoạch đầy đủ](docs/plan/agent-box-plan.md)** | Phần 0 → XVI. Kiến trúc, mô hình bảo mật, benchmark, lộ trình |
| [Bản tóm tắt](docs/plan/agent-box-plan-summary.md) | Đọc trước nếu chỉ cần nắm quyết định lớn và con số nhân lực |
| [Nghiên cứu](docs/research/) | Bằng chứng thị trường, các ngách đã loại, phụ lục computer use |

## Cấu trúc repo

```
├── docs/          Tài liệu kế hoạch và nghiên cứu
├── backend/       FastAPI + Python — agent, bảo mật, sandbox        → backend/README.md
├── frontend/      React + Vite + TS + Tailwind — 5 khung giao diện  → frontend/README.md
├── benchmark/     Thí nghiệm: 7 nhóm ca, 4 cấu hình, bộ mô phỏng    → benchmark/README.md
├── deploy/        Dockerfile + docker compose + image sandbox       → deploy/README.md
└── scripts/       Script tiện dụng cho phát triển                   → scripts/README.md
```

Mỗi thư mục có README riêng nói **file gì nhét vào đâu** và **trỏ về mục nào trong bản kế hoạch**. Đọc README của thư mục trước khi thêm file vào đó.

`backend/` và `frontend/` là hai phần lớn như thường thấy. Ba thư mục còn lại tách riêng vì lý do cụ thể: `benchmark/` là thí nghiệm có số liệu chứ không phải test pass/fail nên không thuộc `backend/tests/`; `deploy/` chứa image sandbox — một **ranh giới bảo mật thật**, không phải một tiện ích build; `docs/` là nguồn duy nhất cho mọi quyết định thiết kế.

## Bảy tầng — một hành động đi qua đâu

Kiến trúc ở mục 2.1 của bản kế hoạch. Đọc từ trên xuống là đúng thứ tự một hành động đi qua hệ thống:

| Tầng | Là gì | Ở đâu trong repo |
|---|---|---|
| 1 | **Giao diện** — 5 khung | `frontend/`, `backend/src/agentbox/api/` |
| 2 | **Controller** — 7 thành phần con | `backend/src/agentbox/controller/` |
| 3 | **Agent Core** + Memory + Model Router | `backend/src/agentbox/{agent_core,memory,router}/` |
| 4 | **Cổng kiểm soát** — Policy Engine, Label Store, Lease Store, Secret Manager, Audit Ledger | `backend/src/agentbox/security/` |
| 5 | **Tool & Skill** — 8 tool, 4 mức rủi ro | `backend/src/agentbox/tools/` |
| 6 | **Sandbox / AI Computer** | `backend/src/agentbox/{sandbox,computer_use}/`, `deploy/docker/` |
| 7 | Bên ngoài | — |

## Năm nguyên tắc — mục 2.2

Năm câu này ràng buộc mọi quyết định code. Nếu một đoạn code vi phạm một trong năm câu thì đoạn code sai, không phải nguyên tắc sai.

| | |
|---|---|
| **N1** | Mọi hành động đi qua **đúng một** cổng kiểm soát |
| **N2** | **LLM không phải thành phần được tin.** Controller và tầng bảo mật không bao giờ gọi LLM |
| **N3** | Quyền do Controller cấp; **LLM không sinh được quyền cho chính nó** |
| **N4** | Sandbox là **ranh giới thật**, không phải một lớp trang trí |
| **N5** | **Nhãn không tự sạch lại.** Chỉ người dùng nâng được mức tin cậy, và chỉ trên một nội dung cụ thể họ đã đọc |

## Nền công nghệ

| Phần | Công nghệ |
|---|---|
| Backend | Python, FastAPI, WebSocket, SQLite (Label Store · Lease Store · Audit Ledger) |
| Agent | LiteLLM (Gemini họ Flash cho cloud, Ollama cho local) |
| Frontend | React, Vite, TypeScript, Tailwind, `xterm.js`, `noVNC` |
| Sandbox | Docker, Playwright cho a11y tree, `Xvfb` + `x11vnc` |
| Đánh giá | AgentDojo, VPI-Bench |

## Ba điểm phải quyết trước tuần 0

1. **Bao nhiêu người thực hiện** — quyết định trực tiếp phạm vi. Bản kế hoạch cộng ra **34,1-41,2 tuần-người**, sau đường cắt còn **30,1-35,7**. Ngân sách 13 tuần: 2 người = 26 (thiếu ở mọi điểm), 3 người = 39. **Khuyến nghị 3 người.**
2. **Giảng viên hướng dẫn có bắt buộc thành phần ML tự huấn luyện hay không** — nếu có thì **+4-6 tuần-người** và phải cắt bù.
3. **Tên dự án.**
