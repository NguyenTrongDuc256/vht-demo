# SituationItem — Hướng dẫn refactor (Cách 1: Compound Component)

Tài liệu này hướng dẫn cách refactor component tình huống từ code monolithic (một khối JSX lớn) sang **Cách 1: compose đầy đủ** — pattern giống [shadcn Card](https://ui.shadcn.com/docs/components/card), tối ưu cho **Nx monorepo** và **tách Redux**.

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Kiến trúc Nx monorepo](#2-kiến-trúc-nx-monorepo)
3. [Cấu trúc thư mục SituationItem](#3-cấu-trúc-thư-mục-situationitem)
4. [Cách 1 — Compose đầy đủ](#4-cách-1--compose-đầy-đủ)
5. [Quy trình refactor từng bước](#5-quy-trình-refactor-từng-bước)
6. [Chi tiết từng part](#6-chi-tiết-từng-part)
7. [Dữ liệu đầu vào `IEventSituation`](#7-dữ-liệu-đầu-vào-ieventsituation)
8. [Tách Redux — nối side effect ở feature layer](#8-tách-redux--nối-side-effect-ở-feature-layer)
9. [Tùy biến UI](#9-tùy-biến-ui)
10. [Ví dụ thực tế trong dự án](#10-ví-dụ-thực-tế-trong-dự-án)
11. [Checklist migrate](#11-checklist-migrate)
12. [Lỗi thường gặp](#12-lỗi-thường-gặp)

---

## 1. Tổng quan

`SituationItem` hiển thị **một tình huống** (situation) gồm:

- Tiêu đề (`mention`)
- Badge mức độ đe dọa (`threatLevel`)
- Nút mở/đóng (toggle)
- Danh sách tham chiếu (`refs`)
- Khu vực nguồn (`sources`) — tùy biến tại feature

**Cách 1** yêu cầu bạn **tự ghép từng part** thay vì dùng layout mặc định. Đổi lại bạn kiểm soát hoàn toàn thứ tự, nội dung và phần custom (ví dụ link nguồn, nút hành động).

```tsx
<SituationItem situation={data} variant="timeline">
  <SituationItemHeader>
    <SituationItemMention />
    <SituationItemThreatBadge />
    <SituationItemToggle />
  </SituationItemHeader>
  <SituationItemRefs />
  <SituationItemSources>
    {/* custom */}
  </SituationItemSources>
</SituationItem>
```

> **Lưu ý:** Nếu không truyền `children`, `SituationItem` tự render layout mặc định (Cách 2). Tài liệu này tập trung vào **Cách 1**.

---

## 2. Kiến trúc Nx monorepo

```
apps/*  →  @smart-duty/view  →  @smart-duty/logic
```

| Layer | Package | Trách nhiệm |
|-------|---------|-------------|
| **Logic** | `@smart-duty/logic` | Types, constants, utils — **không React, không Redux** |
| **View** | `@smart-duty/view` | UI components (`SituationItem` nằm ở đây) |
| **Feature / App** | `military-knowledge`, `event-target`… | Compose UI, nối Redux/API, mock data |

**Rule quan trọng:**

- `SituationItem` **không** `import` Redux, `useDispatch`, store.
- Side effect (mở drawer, dispatch action, navigate…) truyền qua **callback prop** `onOpenByClick`.
- Dữ liệu domain lấy từ `@smart-duty/logic`, không định nghĩa type lại trong feature.

---

## 3. Cấu trúc thư mục SituationItem

```
view/src/components/SituationItem/
├── README.md                    ← tài liệu này
├── index.ts                     ← public API của component
├── situation-item-context.tsx   ← Context + useSituationItem (UI state)
└── situation-item.tsx           ← Root + các part (Header, Mention, …)
```

**Logic lib** (tách riêng, không nằm trong folder này):

```
logic/src/
├── models/situation.types.ts
├── const/situation-threat-level.ts
└── utils/situation.utils.ts
```

### Import đúng

```tsx
// UI parts
import {
  SituationItem,
  SituationItemHeader,
  SituationItemMention,
  SituationItemThreatBadge,
  SituationItemToggle,
  SituationItemRefs,
  SituationItemSources,
  SituationItemSourcesLabel,
  useSituationItem,          // chỉ khi cần custom part riêng
} from '@smart-duty/view';

// Types & logic
import type { IEventSituation } from '@smart-duty/logic';
```

**Không import** đường dẫn sâu kiểu:

```tsx
// ❌ tránh
import { SituationItem } from '@smart-duty/view/components/SituationItem/situation-item';
```

---

## 4. Cách 1 — Compose đầy đủ

### Cây component chuẩn

```
SituationItem                    ← Root: border, background, Provider
├── SituationItemHeader          ← Hàng trên, click để toggle
│   ├── SituationItemMention     ← Tiêu đề (situation.mention)
│   ├── SituationItemThreatBadge ← Badge "Nghiêm trọng" / "Cao" / …
│   └── SituationItemToggle      ← Mũi tên xoay
├── SituationItemRefs            ← Nội dung refs (ẩn khi collapse)
└── SituationItemSources         ← Footer nguồn (ẩn theo variant/focus)
    ├── SituationItemSourcesLabel
    └── … custom links / buttons
```

### Template tối thiểu

```tsx
<SituationItem
  situation={situation}
  variant="timeline"
  onOpenByClick={() => {
    // side effect ở feature layer — KHÔNG viết trong SituationItem
  }}
>
  <SituationItemHeader>
    <SituationItemMention />
    <SituationItemThreatBadge />
    <SituationItemToggle />
  </SituationItemHeader>

  <SituationItemRefs />

  <SituationItemSources>
    <SituationItemSourcesLabel />
    {/* nội dung custom */}
  </SituationItemSources>
</SituationItem>
```

### Props của Root (`SituationItem`)

| Prop | Kiểu | Mặc định | Mô tả |
|------|------|----------|-------|
| `situation` | `IEventSituation` | — | **Bắt buộc.** Dữ liệu tình huống |
| `variant` | `'timeline' \| 'list' \| 'notification'` | `'list'` | Kiểu hiển thị |
| `defaultExpandAllCards` | `boolean` | — | Đồng bộ trạng thái mở (dùng với `notification`) |
| `onOpenByClick` | `() => void` | — | Gọi khi user mở card lần đầu (click header) |
| `sx` | `SxProps` | — | Override style container (MUI) |
| `children` | `ReactNode` | layout mặc định | **Cách 1: luôn truyền children** |

---

## 5. Quy trình refactor từng bước

Giả sử bạn đang có component cũ dạng monolithic (như `SituationItem` ban đầu trong `event-target`):

### Bước 1 — Tách logic sang `@smart-duty/logic`

Di chuyển ra khỏi file UI:

- `IEventSituation`, `IEventSituationSource`
- `SituationThreatLevel`, `situationThreatLevelDefinition`
- `resolveThreatLevelThreshHold()`

```ts
// @smart-duty/logic
import {
  type IEventSituation,
  resolveThreatLevelThreshHold,
  SituationThreatLevel,
} from '@smart-duty/logic';
```

### Bước 2 — Xóa Redux khỏi component

Trong component cũ, tìm và **loại bỏ**:

```tsx
// ❌ xóa khỏi SituationItem
import { useDispatch } from 'react-redux';
const dispatch = useDispatch();
dispatch(smartDutyAssistantActions.open(...));
```

Thay bằng callback ở nơi gọi:

```tsx
// ✅ feature layer
<SituationItem
  situation={situation}
  onOpenByClick={() => dispatch(openSituation(situation))}
/>
```

### Bước 3 — Tách UI state vào Context

State chỉ thuộc UI, giữ trong `situation-item-context.tsx`:

- `expanded` — card đang mở hay đóng
- `toggle()` — đổi trạng thái
- `showDetails` — có hiện badge/sources không (phụ thuộc `variant`)

**Không** đưa Redux state vào Context.

### Bước 4 — Tách từng vùng JSX thành part

| JSX cũ | Part mới |
|--------|----------|
| `<Stack onClick={toggle}>` + mention + badge + arrow | `SituationItemHeader` + 3 part con |
| `{situation.refs.join('\n')}` | `SituationItemRefs` |
| Block "Nguồn:" + map sources | `SituationItemSources` + custom children |

### Bước 5 — Ghép lại tại feature (Cách 1)

Tạo component wrapper ở feature nếu cần tái sử dụng:

```tsx
// event-target/components/SituationCard.tsx
export function SituationCard({ situation, onOpen }: Props) {
  return (
    <SituationItem situation={situation} variant="timeline" onOpenByClick={onOpen}>
      <SituationItemHeader>
        <SituationItemMention />
        <SituationItemThreatBadge />
        <SituationItemToggle />
      </SituationItemHeader>
      <SituationItemRefs />
      <SituationItemSources>
        <SituationItemSourcesLabel />
        {situation.sources.map((src) => (
          <SituationSourceLink key={src.id} source={src} />
        ))}
      </SituationItemSources>
    </SituationItem>
  );
}
```

### Bước 6 — Export public API

Đảm bảo `view/src/index.ts` export đủ part để app khác dùng qua `@smart-duty/view`.

---

## 6. Chi tiết từng part

### `SituationItem` (Root)

- Bọc `SituationItemProvider` + container (border, màu nền theo `variant` / `expanded` / `threatLevel`).
- Khi dùng **Cách 1**, luôn truyền `children` — **không** rely vào layout mặc định.

### `SituationItemHeader`

- `direction="row"`, `cursor: pointer`.
- `onClick` → `toggle()` + gọi `onOpenByClick` nếu đang đóng.
- Chứa các part con theo thứ tự bạn muốn.

### `SituationItemMention`

- Render `situation.mention` (hoặc `children` để override).
- Font size phụ thuộc `variant` (`notification` → 14px, còn lại → 16px).

### `SituationItemThreatBadge`

- Tự ẩn khi `showDetails === false`.
- Màu/label lấy từ `situationThreatLevelDefinition[threatLevel]`.

### `SituationItemToggle`

- Icon mũi tên, xoay `-90deg` khi đóng.

### `SituationItemRefs`

- Hiển thị `situation.refs.join('\n')`.
- `display: none` khi `expanded === false`.
- `stopPropagation` trên click — tránh toggle nhầm khi bôi đen text.

### `SituationItemSources`

- Tự ẩn khi `showDetails === false`.
- **Chỉ** cung cấp layout hàng ngang — nội dung nguồn do feature tự render.
- Dùng `SituationItemSourcesLabel` cho nhãn "Nguồn:".

---

## 7. Dữ liệu đầu vào `IEventSituation`

```ts
interface IEventSituation {
  mention: string;           // tiêu đề in đậm
  refs: string[];            // mỗi phần tử = 1 dòng khi join
  sources: IEventSituationSource[];
  threatLevel: number;       // 0–4+ → map sang CRITICAL/HIGH/…
  entities: IEventSituationEntity[];
}
```

### Mock data (demo)

```ts
// military-knowledge/constants/equipment-dashboard.mock.ts
import { MOCK_SITUATIONS } from '...';
// hoặc
const situation = EQUIPMENT_DASHBOARD_MOCK.situations[0];
```

### Map `threatLevel` → badge

| `threatLevel` | Badge |
|---------------|-------|
| `>= 4` | Nghiêm trọng (đỏ) |
| `3` | Cao (cam) |
| `2` | Trung bình (xanh) |
| `1` | Thấp (xám xanh) |
| `0` | Thông tin |

---

## 8. Tách Redux — nối side effect ở feature layer

```
┌─────────────────────────────────────────┐
│  Feature Page (có Redux)                │
│  onOpenByClick={() => dispatch(...)}    │
└─────────────────┬───────────────────────┘
                  │ callback prop
┌─────────────────▼───────────────────────┐
│  SituationItem (@smart-duty/view)       │
│  Chỉ UI state: expanded, toggle         │
│  Không biết Redux tồn tại               │
└─────────────────────────────────────────┘
```

**Ví dụ nối Redux (ở page, không phải trong SituationItem):**

```tsx
import { useDispatch } from 'react-redux';
import { SituationItem, SituationItemHeader, ... } from '@smart-duty/view';

function EventTargetPage() {
  const dispatch = useDispatch();

  return (
    <SituationItem
      situation={situation}
      variant="timeline"
      onOpenByClick={() => {
        dispatch(smartDutyAssistantActions.focusSituation(situation));
      }}
    >
      {/* Cách 1 compose */}
    </SituationItem>
  );
}
```

---

## 9. Tùy biến UI

### Override text

```tsx
<SituationItemMention>
  [Khẩn] {situation.mention}
</SituationItemMention>
```

### Override style từng part

Mọi part hỗ trợ `sx` (MUI):

```tsx
<SituationItemMention sx={{ color: '#ff6b8a' }} />
<SituationItemHeader sx={{ gap: 2 }} />
```

### Custom part với `useSituationItem`

Khi cần part hoàn toàn mới (ví dụ nút "Phân tích"):

```tsx
function AnalyzeButton() {
  const { situation, expanded } = useSituationItem();
  if (!expanded) return null;

  return (
    <Button size="small" onClick={() => analyze(situation)}>
      Phân tích
    </Button>
  );
}

// Dùng trong compose
<SituationItem situation={situation}>
  <SituationItemHeader>...</SituationItemHeader>
  <SituationItemRefs />
  <AnalyzeButton />
</SituationItem>
```

> `useSituationItem()` chỉ hoạt động **bên trong** `<SituationItem>`.

### Chặn toggle khi click header

```tsx
<SituationItemHeader
  onClick={(e) => {
    e.preventDefault(); // chặn toggle mặc định
    // xử lý riêng
  }}
>
```

---

## 10. Ví dụ thực tế trong dự án

File tham chiếu: `military-knowledge/components/EquipmentDetail/index.tsx`

```tsx
import {
  SituationItem,
  SituationItemHeader,
  SituationItemMention,
  SituationItemThreatBadge,
  SituationItemToggle,
  SituationItemRefs,
  SituationItemSources,
  SituationItemSourcesLabel,
} from '@smart-duty/view';

const critical = EQUIPMENT_DASHBOARD_MOCK.situations[0];

<SituationItem
  situation={critical}
  variant="timeline"
  onOpenByClick={() => console.log('Mở:', critical.mention)}
>
  <SituationItemHeader>
    <SituationItemMention />
    <SituationItemThreatBadge />
    <SituationItemToggle />
  </SituationItemHeader>

  <SituationItemRefs />

  <SituationItemSources>
    <SituationItemSourcesLabel />
    {critical.sources.map((src) => (
      <Typography
        key={src.id}
        component="span"
        sx={{ fontSize: 12, color: '#00d4ff', cursor: 'pointer' }}
      >
        {src.name}
      </Typography>
    ))}
  </SituationItemSources>
</SituationItem>
```

Chạy demo: `npm run dev` → mở trang Equipment Detail → cột **"Tình huống (demo SituationItem)"**.

---

## 11. Checklist migrate

Dùng checklist này khi refactor một màn từ code cũ sang Cách 1:

- [ ] Types `IEventSituation` import từ `@smart-duty/logic`, không copy local
- [ ] Xóa `useDispatch` / store import khỏi `SituationItem` và các part
- [ ] Side effect chuyển sang `onOpenByClick` hoặc handler riêng ở feature
- [ ] Dùng Cách 1: truyền đủ `children` (Header → Refs → Sources)
- [ ] `SituationItemHeader` luôn chứa `Mention` + `ThreatBadge` + `Toggle` (hoặc custom tương đương)
- [ ] Phần sources render ở feature (link, icon, menu…) — không hardcode trong lib
- [ ] Import từ `@smart-duty/view`, không relative path sâu
- [ ] Test 3 variant: `timeline`, `list`, `notification`
- [ ] Test click toggle, click refs không toggle nhầm
- [ ] Test `threatLevel: 4` → card CRITICAL mở sẵn (variant `list`)

---

## 12. Lỗi thường gặp

### Cast `as unknown as IEventSituation`

```tsx
// ❌ sai — events timeline khác shape với IEventSituation
<SituationItem situation={dashboard.events[0] as unknown as IEventSituation} />

// ✅ đúng — dùng mock/domain data đúng type
<SituationItem situation={MOCK_SITUATIONS[0]} />
```

### Import Redux vào part

```tsx
// ❌ trong situation-item.tsx hoặc part
import { useDispatch } from 'react-redux';
```

→ Giữ Redux ở page/feature wrapper.

### Dùng part ngoài Root

```tsx
// ❌ runtime error
<SituationItemMention />  // "useSituationItem must be used within SituationItem"
```

→ Luôn bọc trong `<SituationItem>`.

### Quên `SituationItemSources` khi cần hiện nguồn

`Sources` không tự map `situation.sources` — bạn phải tự render trong `children` (Cách 1).

### Nhầm Cách 1 và Cách 2

| | Cách 1 | Cách 2 |
|---|--------|--------|
| `children` | Truyền đủ parts | Không truyền |
| Kiểm soát layout | Toàn bộ | Layout cố định trong lib |
| Custom sources | Có | Không (trống) |

---

## Tóm tắt

**Cách 1** = bạn là người compose, `SituationItem` chỉ cung cấp **bộ khung UI tách Redux**, chia sẻ state qua Context. Logic domain nằm ở `@smart-duty/logic`, side effect nằm ở feature/app.

Khi migrate sang Nx workspace thật, cấu trúc folder này map trực tiếp sang:

```
libs/features/smart-duty/view/src/components/SituationItem/
libs/features/smart-duty/logic/src/models/situation.types.ts
```

Không cần đổi API public nếu giữ import `@smart-duty/view` và `@smart-duty/logic`.
