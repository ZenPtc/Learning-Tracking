# 📚 My Learning Journal

A tiny, dependency-free learning journal. Each thing you learn becomes its own
**interactive HTML page**, and the dashboard lists them all.

No build step, no npm, no server — just **double-click `index.html`**.

## How to use it

### View your journal
Open **`index.html`** in any browser (double-click it). You'll see:
- 🔥 **Current streak** — consecutive days with at least one entry
- 📅 **Learning days** — how many distinct days you've logged
- 📚 **Total entries**
- 🎨 **Categories** used to group entries (defined in `data/categories.js`)
- 📖 A card for every entry — click one to open its full lesson page in a new tab

### Add a new entry
You don't type entries into the web. Instead, tell Claude:

> "Today I learned about **\<topic\>**"

Claude will:
1. Create a new lesson page in `entries/` (easy to read, with a visual or interactive demo)
2. Add it to the list in `data/entries.js`

Refresh `index.html` and the new card appears. ✨

## Project layout
```
index.html            ← the dashboard (open this)
README.md             ← you are here
assets/
  dashboard.css       ← dashboard styling
  dashboard.js        ← dashboard logic (stats, cards, category display)
  entry.css           ← shared styling for every lesson page
data/
  entries.js          ← the list of all entries (the manifest)
  categories.js       ← the list of categories (name + color)
entries/
  *.html              ← one self-contained lesson per file
```

## Notes
- **Categories** live in `data/categories.js` (part of the project, so they're portable and
  the same on every machine). Ask Claude to add, rename, or recolor them. If an entry uses a
  category that isn't in the list, it just shows in a neutral gray.
- Everything works fully **offline** — no internet or external libraries required.
