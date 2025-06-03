# UI Style Guide for Business Modules (Cursor Prompt Guide)

This guide defines the preferred structure and style for designing **business module management cards** (like Dairy Management, Pottery, etc.).

---

## ✅ Preferred Output (Follow This Style)
- Clean, organized layout
- Bold, consistent headings
- Tags styled like pills/chips for features
- Eye-catching toggle switches (e.g., for "Active")
- Icons next to module names
- Clear separation between cards
- Slight shadow or border on cards
- Date aligned to bottom right
- Action icons: view, edit, delete


---

## ❌ Avoid This (Incorrect Output)

- No tag styling (features in plain text)
- No icons next to titles or buttons
- Unstyled "Active" text (no toggle)
- Module layout looks too basic or inconsistent
- Lack of spacing or grouping
- Missing hierarchy in text elements

---

## 💅 UI Component Rules

### Typography
- Use consistent font size: 
  - Title: `font-bold text-lg`
  - Subtitle: `text-sm text-gray-500`
  - Feature labels: `text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-0.5`

### Colors
- Base accent: `purple`
- Active tag: `purple-600 bg-purple-100`
- Text: dark for titles, muted for descriptions

### Icons
- Use minimal Lucide/FontAwesome-style icons:
  - View: 👁
  - Edit: ✏️
  - Delete: 🗑️
  - Module-specific (milk, pottery, garment, etc.)

### Layout
- Grid layout with consistent spacing
- Each card has:
  - Padding: `p-4`
  - Rounded corners: `rounded-xl`
  - Light shadow or border
  - Bottom-aligned date & status toggle

---

## 🧩 Future Requests

When asking to create new UI:
> "Follow the `ui-style-guide.md` and generate a card/module layout similar to the one with Dairy Management (1st image), not the 2nd version."

---

## 🔗 Reuse

Use this file in every project where module-based UI is involved. Paste or link it in your prompt for best results.

