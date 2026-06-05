/* ============================================================
   Learning Journal — dashboard logic
   Reads window.ENTRIES (data/entries.js) and window.CATEGORIES
   (data/categories.js) and renders everything. Both lists live
   in the project folder; the dashboard only displays them.
   ============================================================ */

(function () {
  "use strict";

  var ENTRIES = (window.ENTRIES || []).slice();
  var FALLBACK_COLOR = "#c9c2dd";

  var MOTIVATION = [
    "Every entry is a little win. ✨",
    "Small steps every day add up. 🌱",
    "Future you is grateful for today's learning. 💌",
    "Curiosity looks good on you. 🦊",
    "Knowledge grows when you revisit it. 📚",
    "You showed up — that's the hard part. 🌟"
  ];

  // Categories come from data/categories.js (window.CATEGORIES).
  var categories = (window.CATEGORIES || []).slice();
  var activeFilter = "All";
  var searchText = "";

  function colorFor(name) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].name === name) return categories[i].color;
    }
    return FALLBACK_COLOR;
  }

  /* ---------- stats ---------- */
  function uniqueDates() {
    var set = {};
    ENTRIES.forEach(function (e) { if (e.date) set[e.date] = true; });
    return Object.keys(set).sort();
  }

  function totalDays() { return uniqueDates().length; }

  function ymd(d) {
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  // Consecutive days with >=1 entry, counting back from today
  // (or from the most recent entry if that was yesterday).
  function currentStreak() {
    var dates = {};
    ENTRIES.forEach(function (e) { if (e.date) dates[e.date] = true; });
    if (!Object.keys(dates).length) return 0;

    var cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // Allow the streak to count even if today has no entry yet,
    // as long as yesterday did.
    if (!dates[ymd(cursor)]) {
      cursor.setDate(cursor.getDate() - 1);
      if (!dates[ymd(cursor)]) return 0;
    }

    var streak = 0;
    while (dates[ymd(cursor)]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderStats() {
    setText("stat-streak", currentStreak());
    setText("stat-days", totalDays());
    setText("stat-entries", ENTRIES.length);
  }

  /* ---------- filter chips ---------- */
  function renderChips() {
    var host = document.getElementById("chips");
    host.innerHTML = "";

    var all = makeChip("All", null);
    host.appendChild(all);

    categories.forEach(function (c) {
      host.appendChild(makeChip(c.name, c.color));
    });
  }

  function makeChip(name, color) {
    var b = document.createElement("button");
    b.className = "chip" + (activeFilter === name ? " active" : "");
    b.textContent = name;
    if (activeFilter === name && color) b.style.background = color;
    b.addEventListener("click", function () {
      activeFilter = name;
      renderChips();
      renderGrid();
    });
    return b;
  }

  /* ---------- entry grid ---------- */
  function visibleEntries() {
    var q = searchText.trim().toLowerCase();
    return ENTRIES
      .filter(function (e) {
        if (activeFilter !== "All" && e.category !== activeFilter) return false;
        if (!q) return true;
        return (
          (e.title || "").toLowerCase().indexOf(q) !== -1 ||
          (e.summary || "").toLowerCase().indexOf(q) !== -1 ||
          (e.category || "").toLowerCase().indexOf(q) !== -1
        );
      })
      .sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
  }

  function prettyDate(s) {
    if (!s) return "";
    var parts = s.split("-");
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function renderGrid() {
    var grid = document.getElementById("grid");
    var list = visibleEntries();
    grid.innerHTML = "";

    if (!list.length) {
      grid.appendChild(emptyState());
      return;
    }

    list.forEach(function (e) {
      var color = colorFor(e.category);
      var a = document.createElement("a");
      a.className = "card";
      a.href = e.file;
      a.target = "_blank";
      a.rel = "noopener";
      a.style.borderTopColor = color;
      a.innerHTML =
        '<div class="card-emoji">' + (e.emoji || "📘") + "</div>" +
        '<div class="card-title"></div>' +
        '<div class="card-summary"></div>' +
        '<div class="card-foot">' +
          '<span class="badge"></span>' +
          '<span class="card-date"></span>' +
        "</div>";
      a.querySelector(".card-title").textContent = e.title || "Untitled";
      a.querySelector(".card-summary").textContent = e.summary || "";
      var badge = a.querySelector(".badge");
      badge.textContent = e.category || "Other";
      badge.style.background = color;
      a.querySelector(".card-date").textContent = prettyDate(e.date);
      grid.appendChild(a);
    });
  }

  function emptyState() {
    var div = document.createElement("div");
    div.className = "empty";
    var hasAny = ENTRIES.length > 0;
    div.innerHTML = hasAny
      ? '<div class="big">🔍</div><h3>No entries match</h3>' +
        "<p>Try a different category or clear the search.</p>"
      : '<div class="big">🌱</div><h3>Your journal is empty</h3>' +
        "<p>Tell Claude <em>“Today I learned about …”</em> and a new entry will appear here.</p>";
    return div;
  }

  /* ---------- category breakdown bar ---------- */
  function renderBreakdown() {
    var bar = document.getElementById("breakdown");
    bar.innerHTML = "";
    if (!ENTRIES.length) { bar.style.display = "none"; return; }
    bar.style.display = "flex";

    categories.forEach(function (c) {
      var count = ENTRIES.filter(function (e) { return e.category === c.name; }).length;
      if (!count) return;
      var seg = document.createElement("span");
      seg.style.background = c.color;
      seg.style.flex = String(count);
      seg.title = c.name + ": " + count;
      bar.appendChild(seg);
    });
  }

  /* ---------- category list (read-only display) ---------- */
  function renderCatManager() {
    var host = document.getElementById("cat-list");
    host.innerHTML = "";

    if (!categories.length) {
      var hint = document.createElement("p");
      hint.style.cssText = "color:var(--ink-soft); font-size:14px; margin:6px 0 0;";
      hint.textContent = "No categories yet — ask Claude to add some.";
      host.appendChild(hint);
      return;
    }

    categories.forEach(function (c) {
      var count = ENTRIES.filter(function (e) { return e.category === c.name; }).length;

      var row = document.createElement("div");
      row.className = "cat-row";

      var dot = document.createElement("span");
      dot.className = "cat-dot";
      dot.style.background = c.color;

      var name = document.createElement("span");
      name.className = "cat-name";
      name.textContent = c.name;

      var count$ = document.createElement("span");
      count$.className = "cat-count";
      count$.textContent = count + (count === 1 ? " entry" : " entries");

      row.appendChild(dot);
      row.appendChild(name);
      row.appendChild(count$);
      host.appendChild(row);
    });
  }

  /* ---------- wiring ---------- */
  function init() {
    // rotating motivational line
    var line = document.getElementById("motivation");
    if (line) line.textContent = MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];

    renderStats();
    renderChips();
    renderGrid();
    renderBreakdown();
    renderCatManager();

    document.getElementById("search").addEventListener("input", function (e) {
      searchText = e.target.value;
      renderGrid();
    });

    // collapsible category panel
    var toggle = document.getElementById("cat-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        document.getElementById("cat-panel").classList.toggle("closed");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
