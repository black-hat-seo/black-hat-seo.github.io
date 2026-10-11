/* Apply saved color theme before first paint to avoid a flash. */
(function () {
  try {
    var t = localStorage.getItem("wsh-theme");
    if (!t) {
      t = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
