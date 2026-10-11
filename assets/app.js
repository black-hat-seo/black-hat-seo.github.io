/* =========================================================
   烟雨黑帽 - theme interactions
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- theme ---------- */
  var THEME_KEY = "wsh-theme";
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    var btn = document.getElementById("themeBtn");
    if (btn) btn.innerHTML = t === "dark" ? "&#9728;" : "&#9789;";
  }
  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(stored || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  }

  /* ---------- mobile sidebar ---------- */
  var sidebar = document.getElementById("sidebar");
  var menuBtn = document.getElementById("menuBtn");
  var scrim = document.getElementById("scrim");
  function closeMenu() {
    if (sidebar) sidebar.classList.remove("open");
    if (scrim) scrim.classList.remove("show");
  }
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      if (scrim) scrim.classList.toggle("show");
    });
  }
  if (scrim) scrim.addEventListener("click", closeMenu);

  /* ---------- keep active item in view ---------- */
  var active = document.querySelector(".nav-item.active");
  if (active && active.scrollIntoView) {
    active.scrollIntoView({ block: "center" });
  }

  /* ---------- nav search filter ---------- */
  var input = document.getElementById("navSearch");
  var tree = document.querySelector(".nav-scroll .nav-tree");
  if (input && tree) {
    var filter = function (li, q) {
      var a = li.querySelector(":scope > a");
      var self = !!a && a.textContent.toLowerCase().indexOf(q) !== -1;
      var childHit = false;
      li.querySelectorAll(":scope > .nav-children > .nav-item").forEach(function (c) {
        if (filter(c, q)) childHit = true;
      });
      var show = !q || self || childHit;
      li.classList.toggle("hidden", !show);
      return show;
    };
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      tree.querySelectorAll(":scope > .nav-item").forEach(function (li) {
        filter(li, q);
      });
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; input.dispatchEvent(new Event("input")); }
    });
  }

  /* ---------- copy code buttons ---------- */
  document.querySelectorAll(".article-body pre").forEach(function (pre) {
    var code = pre.querySelector("code");
    if (!code) return;
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "复制";
    btn.addEventListener("click", function () {
      var text = code.innerText;
      var done = function () {
        btn.textContent = "已复制 ✓";
        btn.classList.add("done");
        setTimeout(function () { btn.textContent = "复制"; btn.classList.remove("done"); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else {
        fallback(text, done);
      }
    });
    pre.appendChild(btn);
  });

  function fallback(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- keyboard: "/" focuses search ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input && input) {
      e.preventDefault();
      input.focus();
    }
  });
})();
