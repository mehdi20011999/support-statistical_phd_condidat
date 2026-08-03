/* =========================================================
   Mehdi Ammou — comportements du site
   1. langue (fr / en / ar + RTL)
   2. liens WhatsApp avec message pré-rempli
   3. profondeur : parallaxe de la console, inclinaison des cartes
   4. apparition au défilement
   ========================================================= */

/* ---- Numéro WhatsApp : à changer ici uniquement ---- */
var WA_NUMBER = "212675992835";

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. langue ---------- */
  function pick(dict, path) {
    return path.split(".").reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : null;
    }, dict);
  }

  function setLang(lang) {
    var d = window.I18N[lang];
    if (!d) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = pick(d, el.getAttribute("data-i18n"));
      if (v === null) return;
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = v;
      else if (el.tagName === "META") el.setAttribute("content", v);
      else el.textContent = v;
    });

    document.title = d.meta.title;

    // liens WhatsApp : message pré-rempli dans la langue courante
    var href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(d.wa.msg);
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.setAttribute("href", href);
    });

    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
      b.setAttribute("aria-pressed", b.dataset.lang === lang);
    });

    try { localStorage.setItem("ma_lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });

  // langue de départ : choix mémorisé, sinon langue du navigateur, sinon français
  var start = "fr";
  try { start = localStorage.getItem("ma_lang") || start; } catch (e) {}
  if (!localStorageHas()) {
    var nav = (navigator.language || "fr").slice(0, 2);
    if (nav === "ar" || nav === "en") start = nav;
  }
  function localStorageHas() {
    try { return !!localStorage.getItem("ma_lang"); } catch (e) { return false; }
  }
  setLang(start);

  /* ---------- 2. profondeur : la console suit le curseur ---------- */
  var deck = document.getElementById("deck");
  if (deck && !reduced && window.matchMedia("(pointer:fine)").matches) {
    var target = { x: -14, y: 9 }, current = { x: -14, y: 9 }, raf = null;

    window.addEventListener("mousemove", function (e) {
      var cx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 .. 1
      var cy = (e.clientY / window.innerHeight - 0.5) * 2;
      target.x = -14 + cx * 12;   // rotation Y
      target.y = 9 - cy * 9;      // rotation X
      if (!raf) raf = requestAnimationFrame(loop);
    });

    function loop() {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      deck.style.transition = "none";
      deck.style.transform = "rotateX(" + current.y.toFixed(2) + "deg) rotateY(" + current.x.toFixed(2) + "deg)";
      if (Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else { raf = null; }
    }
  }

  /* ---------- 3. cartes : inclinaison + reflet ---------- */
  if (!reduced && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.style.transformStyle = "preserve-3d";
      card.style.transition = "transform .3s cubic-bezier(.2,.8,.3,1)";

      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        card.style.transform =
          "perspective(900px) rotateY(" + ((px - 0.5) * 7).toFixed(2) + "deg) rotateX(" +
          ((0.5 - py) * 7).toFixed(2) + "deg) translateY(-4px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 4. apparition au défilement ---------- */
  var items = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add("is-in"); }, i * 70);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

})();
