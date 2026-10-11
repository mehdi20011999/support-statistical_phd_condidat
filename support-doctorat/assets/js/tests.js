/* Catalogue : filtres, recherche, rendu */
(function () {
  "use strict";

  var grid = document.getElementById("grid");
  var box = document.getElementById("filters");
  var input = document.getElementById("q");
  var count = document.getElementById("count");
  var empty = document.getElementById("empty");
  var cats = window.CATS, all = window.TESTS;
  var active = "all", term = "";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* --- boutons de filtre --- */
  var keys = Object.keys(cats);
  var html = '<button class="chip-f on" data-c="all">Tout · ' + all.length + "</button>";
  keys.forEach(function (k) {
    var n = all.filter(function (t) { return t.c.indexOf(k) > -1; }).length;
    if (n) html += '<button class="chip-f" data-c="' + k + '">' + cats[k] + " · " + n + "</button>";
  });
  box.innerHTML = html;

  box.addEventListener("click", function (e) {
    var b = e.target.closest(".chip-f");
    if (!b) return;
    active = b.dataset.c;
    box.querySelectorAll(".chip-f").forEach(function (x) { x.classList.toggle("on", x === b); });
    render();
  });

  input.addEventListener("input", function () {
    term = input.value.trim().toLowerCase();
    render();
  });

  /* --- rendu --- */
  function render() {
    var list = all.filter(function (t) {
      if (active !== "all" && t.c.indexOf(active) === -1) return false;
      if (!term) return true;
      var hay = (t.n + " " + t.q + " " + t.p + " " + (t.cond || "") + " " + (t.alt || "")).toLowerCase();
      return hay.indexOf(term) > -1;
    });

    grid.innerHTML = list.map(function (t) {
      var cat = cats[t.c.split(",")[0]] || "";
      var s = '<article class="t">';
      s += '<div class="t-top"><h3>' + esc(t.n) + '</h3><span class="t-cat">' + esc(cat) + "</span></div>";
      s += '<p class="t-q">' + esc(t.q) + "</p>";
      s += '<p class="t-p">' + esc(t.p) + "</p>";
      if (t.cond) s += '<p class="t-x"><b>Condition —</b> ' + esc(t.cond) + "</p>";
      if (t.alt) s += '<p class="t-x alt"><b>Sinon —</b> ' + esc(t.alt) + "</p>";
      return s + "</article>";
    }).join("");

    empty.hidden = list.length > 0;
    count.textContent = list.length + (list.length > 1 ? " analyses affichées" : " analyse affichée")
      + (active === "all" && !term ? " — chemins vérifiés sur SPSS 27 à 30" : "");
  }

  render();

  /* --- apparitions --- */
  var items = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        setTimeout(function () { el.classList.add("is-in"); }, i * 60);
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }
})();
