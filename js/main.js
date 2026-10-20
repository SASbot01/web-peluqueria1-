// Georgiev Barber — movimiento del sitio (GSAP + ScrollTrigger) y estado del horario.
// Degrada bien sin JS y respeta "prefers-reduced-motion".

(function () {
  "use strict";

  /* ============================================================
     1) Estado "abierto / cerrado" según el horario (hora de España).
        Se ejecuta siempre, haya o no animaciones.
     ============================================================ */
  (function horario() {
    var HORARIO = {
      0: [],
      1: [["10:00", "13:30"], ["17:00", "19:30"]],
      2: [["10:00", "13:30"], ["17:00", "19:30"]],
      3: [["10:00", "13:30"], ["17:00", "20:00"]],
      4: [["10:00", "13:30"], ["17:00", "19:30"]],
      5: [["10:00", "13:30"], ["17:00", "20:00"]],
      6: [["10:00", "14:00"]],
    };
    var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    var min = function (h) { var p = h.split(":"); return (+p[0]) * 60 + (+p[1]); };

    function ahora() {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
      }).formatToParts(new Date());
      var get = function (t) { return parts.find(function (p) { return p.type === t; }).value; };
      var dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
      return { dia: dia, m: (+get("hour") % 24) * 60 + (+get("minute")) };
    }

    function estado() {
      var n = ahora();
      var hoy = HORARIO[n.dia] || [];
      for (var i = 0; i < hoy.length; i++) {
        if (n.m >= min(hoy[i][0]) && n.m < min(hoy[i][1])) return { dia: n.dia, txt: "Abierto ahora · hasta las " + hoy[i][1] };
        if (n.m < min(hoy[i][0])) return { dia: n.dia, txt: "Cerrado ahora · abre hoy a las " + hoy[i][0] };
      }
      for (var k = 1; k <= 7; k++) {
        var d = (n.dia + k) % 7;
        if (HORARIO[d].length) {
          var cuando = k === 1 ? "mañana" : "el " + DIAS[d];
          return { dia: n.dia, txt: "Cerrado · abre " + cuando + " a las " + HORARIO[d][0][0] };
        }
      }
      return { dia: n.dia, txt: "Consulta el horario" };
    }

    try {
      var e = estado();
      var el = document.querySelector("[data-status]");
      if (el) el.textContent = e.txt;
      var fila = document.querySelector('[data-hours] tr[data-day="' + e.dia + '"]');
      if (fila) fila.classList.add("is-today");
    } catch (_) {}
  })();

  /* ============================================================
     2) Movimiento. Sin GSAP o con reduced-motion: todo visible.
     ============================================================ */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof window.gsap === "undefined" || reduce) {
    document.documentElement.classList.remove("js");
    document.documentElement.classList.add("no-js");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // --- Nav: fondo al despegar del top ---
  var nav = document.querySelector(".nav");
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: function (self) { nav.classList.toggle("is-stuck", self.scroll() > 8); },
  });

  // --- Entrada de la portada ---
  var words = gsap.utils.toArray(".hero__title .word");
  gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 })
    .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.9, startAt: { y: 14 } })
    .to(words, { opacity: 1, yPercent: 0, duration: 1.15, stagger: 0.09, ease: "power4.out", startAt: { yPercent: 55 } }, "-=0.55")
    .to(".hero__media", { opacity: 1, duration: 1.3, ease: "power2.out", startAt: { clipPath: "inset(100% 0 0 0)", scale: 1.08 }, clipPath: "inset(0% 0 0 0)", scale: 1 }, "-=1.05")
    .to(".hero__lead", { opacity: 1, y: 0, duration: 0.9, startAt: { y: 16 } }, "-=0.8")
    .to(".hero__actions", { opacity: 1, y: 0, duration: 0.9, startAt: { y: 16 } }, "-=0.7")
    .to(".hero__scroll", { opacity: 1, duration: 0.8 }, "-=0.5");

  // --- Parallax de salida de la portada (solo en pantallas anchas) ---
  if (window.innerWidth > 640) {
    gsap.to(".hero__title", { yPercent: -9, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__media", { yPercent: 16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  // --- Marquee de la banda oscura ---
  var marquee = document.querySelector("[data-marquee]");
  if (marquee) {
    marquee.innerHTML = marquee.innerHTML + marquee.innerHTML;
    gsap.to(marquee, {
      xPercent: -50, ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 0.5 },
    });
  }

  // --- Parallax de la banda cálida a sangre + entrada del texto ---
  var warmMedia = document.querySelector(".warm__media");
  if (warmMedia) {
    gsap.fromTo(warmMedia, { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: ".warm", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.from(".warm__inner > *", {
      y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".warm", start: "top 62%" },
    });
  }

  // --- Revelado de las secciones al hacer scroll ---
  var reveals = gsap.utils.toArray("[data-reveal]");
  gsap.set(reveals, { y: 30 });
  ScrollTrigger.batch(reveals, {
    start: "top 86%",
    onEnter: function (els) {
      gsap.to(els, { opacity: 1, y: 0, duration: 0.95, stagger: 0.09, ease: "power3.out", overwrite: true });
    },
  });

  // Recalcular posiciones cuando cargan fuentes/imágenes
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
