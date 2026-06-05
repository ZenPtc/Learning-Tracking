/* ============================================================
   Learning Journal — entry manifest
   ------------------------------------------------------------
   Every learning entry is one HTML file in /entries.
   This list tells the dashboard which entries exist.

   To add an entry: create the HTML file, then add one object
   to the TOP of this array (newest first).

   Fields:
     id       unique slug, usually "<date>-<topic>"
     file     path to the entry's HTML page
     title    shown on the card + page
     date     "YYYY-MM-DD"  (drives streak + day stats)
     category must match a category name in the dashboard
     emoji    a little icon for the card
     summary  one short sentence shown on the card
   ============================================================ */
window.ENTRIES = [
  {
    id: "2026-06-06-claude-code-hooks",
    file: "entries/2026-06-06-claude-code-hooks.html",
    title: "Wiring Up Claude Code Stop Hooks",
    date: "2026-06-06",
    category: "Dev Tools",
    emoji: "🔔",
    summary: "Why 'just remember this' doesn't work for automation — and how Stop hooks + PowerShell bridge WSL2 to Windows notifications."
  }
];
