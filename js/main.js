// Georgiev Barber — estado "abierto / cerrado" según el horario de reservas (Yeasy).
// Las horas se calculan siempre en hora de España, esté donde esté quien visita la web.

(function () {
  // 0 = domingo … 6 = sábado. Cada tramo: [apertura, cierre] en "HH:MM".
  const HORARIO = {
    0: [],
    1: [["10:00", "13:30"], ["17:00", "19:30"]],
    2: [["10:00", "13:30"], ["17:00", "19:30"]],
    3: [["10:00", "13:30"], ["17:00", "20:00"]],
    4: [["10:00", "13:30"], ["17:00", "19:30"]],
    5: [["10:00", "13:30"], ["17:00", "20:00"]],
    6: [["10:00", "14:00"]],
  };
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  const aMinutos = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  function ahoraEnEspana() {
    const partes = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    const get = (t) => partes.find((p) => p.type === t).value;
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    const minutos = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
    return { dia, minutos };
  }

  function estado() {
    const { dia, minutos } = ahoraEnEspana();
    const hoy = HORARIO[dia];

    for (const [abre, cierra] of hoy) {
      if (minutos >= aMinutos(abre) && minutos < aMinutos(cierra)) {
        return { dia, texto: `Abierto ahora, hasta las ${cierra}` };
      }
      if (minutos < aMinutos(abre)) {
        return { dia, texto: `Cerrado ahora. Abre hoy a las ${abre}` };
      }
    }

    // Ya ha cerrado hoy: busca el siguiente día con horario.
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (HORARIO[d].length) {
        const cuando = i === 1 ? "mañana" : `el ${DIAS[d]}`;
        return { dia, texto: `Cerrado. Abre ${cuando} a las ${HORARIO[d][0][0]}` };
      }
    }
    return { dia, texto: "Consulta el horario" };
  }

  try {
    const { dia, texto } = estado();
    const el = document.querySelector("[data-status]");
    if (el) el.textContent = texto;
    const fila = document.querySelector(`[data-hours] tr[data-day="${dia}"]`);
    if (fila) fila.classList.add("is-today");
  } catch (e) {
    // Si el navegador no soporta Intl con zona horaria, se queda el texto por defecto.
  }
})();
