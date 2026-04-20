# Cook-Along Mode — Implementation Plan

## Design decisions locked in
- **Two modes only**: "שלב אחר שלב" (Cozy/focus) and "מצב מטבח" (Studio/overview)
- **No voice button** — dropped entirely
- **No servings scaler** — dropped entirely
- **No family_note** — dropped entirely
- **Cozy navigation**: swipe left/right + large tap zones (left half = next, right half = prev, RTL); no explicit prev/next buttons
- **Mode selector**: simple 2-pill toggle, shown on the recipe page CTA and inside the cook-along header

---

## Schema gap analysis

### recipe_instructions (and recipe_sauces, recipe_garnish_instructions)

| Prototype field | DB column | Gap |
|---|---|---|
| `step_number` | `step_number INT` | ✅ exists |
| `description` | `description TEXT` | ✅ exists |
| `title` | — | ❌ missing — big heading per step; Phase 2 addition |
| `timer_seconds` | — | ❌ missing — countdown timers; Phase 2 addition |
| `tip` | — | ❌ missing — "טיפ מסבתא" callout; Phase 2 addition |

### recipe_ingredients (and sauce/garnish ingredient tables)

| Prototype field | DB column | Gap |
|---|---|---|
| `description` (full string) | `description TEXT` | ✅ exists — used as-is for checklist |
| `qty`, `unit`, `name`, `note` | — | ❌ structured fields — only needed for scaler (dropped) |

### recipes table

| Prototype field | DB column | Gap |
|---|---|---|
| `name`, `description`, `image_url` | ✅ exist | — |
| `prep_time`, `cook_time`, `difficulty` | — | ❌ not needed for cook-along |
| `servings_default` | — | ❌ scaler dropped |

### What this means for Phase 1

Cook-along works fully with current schema. Cozy shows "שלב X" as heading (no semantic title). Studio renders ingredients as plain text checklist items. No timers, no tips.

---

## Phase 1 — Cook-Along UI (no DB changes)

### Step 1.1 — Mode selector component ✅ TODO
**File:** `src/components/cook-along/ModeSelector.tsx`

2-pill toggle used on the recipe page CTA and inside cook-along header.

```
[ שלב אחר שלב ]  [ מצב מטבח ]
```

Props: `mode: 'cozy' | 'studio'`, `onChange: (mode) => void`
- Active pill: coral background, white text
- Inactive pill: transparent, choco/60 text
- Persist chosen mode in `localStorage` key `mika.cookAlongMode`

---

### Step 1.2 — CookAlongCozy component
**File:** `src/components/cook-along/CookAlongCozy.tsx`

Full-screen fixed overlay, one step at a time.

**Layout:**
```
┌─────────────────────────────────┐
│  ✕ סגור   [שלב אחר שלב|מטבח]  │  ← header
│  ● ● ● ○ ○ ○ ○  (progress bar) │  ← clickable dots
│                                 │
│   [        step card        ]   │  ← glass card, centered
│     שלב 2 מתוך 7               │
│     description text            │
│                                 │
│  ◀ tap zone  │  tap zone ▶     │  ← invisible, full height
└─────────────────────────────────┘
```

**Navigation:**
- **Swipe**: `touchstart`/`touchend` — `|deltaX| > 50px` → advance/go back (RTL: swipe right = next, swipe left = prev)
- **Tap zones**: left 40% = next, right 40% = prev (RTL); center 20% neutral
- **Keyboard**: `ArrowLeft` = next, `ArrowRight` = prev, `Escape` = close
- **Progress dots**: clickable, jump to any step

**Step sequence** (flat list):
1. All `recipe_instructions` (שלב 1…N)
2. If `recipe_sauces` exists: section divider card ("עכשיו נכין את הרוטב") + sauce steps
3. If `recipe_garnish_instructions` exists: section divider card ("עכשיו נכין את התוספת") + garnish steps
4. Completion slide: 🎉 + "סיימתם!" + "חזרה למתכון"

Section divider card counts as a dot in the progress bar.

**State persistence**: `localStorage` key `mika.cozy.${recipeId}` → `{ stepIndex: number }`

**Styling:**
- Background: `bg-gradient-mesh` + `baking-pattern`
- Step card: `bg-white/85 glass rounded-3xl shadow-lg`
- Section label: `text-coral font-fredoka text-sm uppercase tracking-widest`
- Step body: `font-frank text-choco leading-relaxed text-lg`

**Phase 2 hook:** when `title` is present on a step, show it as big heading; otherwise "שלב X". When `timer_seconds` present, show TimerBadge. When `tip` present, show pastelYellow callout.

---

### Step 1.3 — CookAlongStudio component
**File:** `src/components/cook-along/CookAlongStudio.tsx`

Full-screen fixed overlay. Ingredient checklist + scrolling steps.

**Layout mobile (single column):**
```
┌───────────────────────────────────┐
│  ✕  recipe name  [שלב אחר שלב|מטבח] │  ← sticky header + progress strip
├───────────────────────────────────┤
│ [מצרכים ▾]  (collapsible)        │  ← collapsed by default on mobile
│   ☐ 220 גרם חמאה רכה             │
│   ☐ ...                          │
├───────────────────────────────────┤
│ ①  שלב 1                         │  ← highlighted when in view
│ description...                    │
│ ②  שלב 2                         │
│ ...                               │
│ 🎉 סיימתם!                        │
└───────────────────────────────────┘
```

**Layout desktop (lg+):** sticky ingredients sidebar left, scrolling steps right.

**Checklist behaviour:**
- Tap to toggle; checked: `line-through text-choco/40 bg-pastelGreen/30`
- Sections: "מצרכים" → "לרוטב" (if any) → "לתוספת" (if any)
- State in component only (not persisted)

**Steps auto-highlight:** `IntersectionObserver` (threshold 0.5) sets active step → coral border + orange number circle.

**Step sections:** main instructions → "רוטב" heading + sauce steps (if any) → "תוספת" heading + garnish steps (if any).

**Header progress strip:** `h-0.5 bg-coral` fills to `activeStep / total`.

---

### Step 1.4 — CookAlong container + integration
**File:** `src/components/cook-along/CookAlong.tsx`

Thin wrapper: holds `mode` state, reads/writes localStorage, renders Cozy or Studio.

**RecipePage.tsx:** add `isCookAlongOpen` state; render `<CookAlong>` as `z-50` fixed overlay when open.

**CTA card** added to `RecipeDisplay.tsx` (before `<RecipeContent>`):
```
┌──────────────────────────────────────────────────┐
│  ✨ בואו נבשל יחד 🧁                             │
│  שלב-אחר-שלב עם מסך גדול                       │
│  [ שלב אחר שלב | מצב מטבח ]   [ התחילו לבשל ▶ ]│
└──────────────────────────────────────────────────┘
```

Second smaller CTA at bottom of recipe: "מוכנים לבשל? התחילו".

---

### Step 1.5 — Animations
- Overlay enters: `animate-fade-in` + `scale-95 → scale-100`
- Cozy step transition: `opacity-0 → opacity-100` + `translateY(8px) → 0`, keyed on step index

---

## Phase 2 — Schema enhancements (post Phase 1, each independently deployable)

### Step 2.1 — Add `title` to instruction tables
```sql
ALTER TABLE recipe_instructions         ADD COLUMN title TEXT;
ALTER TABLE recipe_sauces               ADD COLUMN title TEXT;
ALTER TABLE recipe_garnish_instructions ADD COLUMN title TEXT;
```
- API: add `title` to SELECT in `api/recipe/[id].ts`
- Types: `title?: string` on all three instruction arrays
- Edit form: optional title input above description in `InstructionsFieldArray.tsx` (and sauce/garnish equivalents)
- Cozy: use title as heading when present, else "שלב X"
- `RecipeContent.tsx`: show title as sub-heading in static step list

### Step 2.2 — Add `timer_seconds` to recipe_instructions
```sql
ALTER TABLE recipe_instructions ADD COLUMN timer_seconds INT;
```
- API, types, edit form: optional INT field per step
- Cozy: show `TimerBadge` (play/pause countdown) when present

### Step 2.3 — Add `tip` to recipe_instructions
```sql
ALTER TABLE recipe_instructions ADD COLUMN tip TEXT;
```
- API, types, edit form: optional text field per step
- Cozy: show pastelYellow callout below step text when present

---

## File checklist

```
src/components/cook-along/
  ModeSelector.tsx       ← 2-pill toggle
  CookAlong.tsx          ← wrapper, mode state, localStorage
  CookAlongCozy.tsx      ← focus mode, swipe + tap zone nav
  CookAlongStudio.tsx    ← checklist sidebar + scrolling steps
```

Phase 1 modified files:
- `src/components/recipe-page/RecipeDisplay.tsx` — CTA card
- `src/pages/RecipePage.tsx` — isCookAlongOpen state + overlay render

Phase 2 modified files:
- `scripts/neon-schema.sql` — DDL reference
- `api/recipe/[id].ts` — SELECT queries
- `src/types/index.ts` — optional fields
- `src/components/form/InstructionsFieldArray.tsx` — title/timer/tip inputs
- `src/components/recipe-page/RecipeContent.tsx` — display title in static view
- `src/schemas/recipeEditSchema.ts` + `recipeSchema.ts` — optional fields

---

## Implementation order

1. **Step 1.1** — ModeSelector
2. **Step 1.4** — CookAlong container + CTA card
3. **Step 1.2** — CookAlongCozy
4. **Step 1.3** — CookAlongStudio
5. **Step 1.5** — Polish animations
6. **Phase 2 steps** — any order, each independent
