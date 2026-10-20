# Georgiev Barber — web

Web de una página para **Georgiev Barber**, barbería en Av. Europa 30, Lorca (Murcia).
HTML, CSS y JS sin dependencias ni paso de compilación.

## Arrancar en local

```bash
npm run dev          # http://localhost:5173
# o, sin Node:
python3 -m http.server 5173
```

## Estructura

```
index.html        Página completa (portada, servicios, trabajos, reels, Georgi, reserva, reseñas, contacto)
css/styles.css    Estilos y paleta (variables en :root)
js/main.js        Estado "abierto/cerrado" en hora de España y día actual en el horario
img/              Fotos de Instagram optimizadas a WebP + og.jpg para compartir
favicon.svg       Monograma GB
```

## De dónde sale cada dato

| Dato | Fuente |
| --- | --- |
| Servicios, precios, duraciones y descripciones | Yeasy (https://yeasy.io/es/commerce/georgiev-barber) |
| Horario | Yeasy (es el que usan para las reservas) |
| Dirección, teléfono, mapa | Ficha de Google Maps |
| Reseñas | Google Maps (15, media 5,0) y Yeasy (53, media 5,0), textos literales |
| Fotos y reels | Instagram @georgievbarber_ |

## Pendiente de revisar con el cliente

- **Horario distinto en Google y en Yeasy.** Google dice L–J 10–14 y 17–21, V 9–14 y 17–21, S 9–14.
  Yeasy dice L–V 10–13:30 y 17–19:30 (X y V hasta 20:00), S 10–14. La web usa el de Yeasy; conviene
  confirmar cuál es el bueno y corregir el otro.
- **Dominio.** Cuando lo haya, añadir `<link rel="canonical">` y poner `og:image` con URL absoluta.
- **WhatsApp.** No está confirmado que el 697 91 56 35 tenga WhatsApp; si lo tiene, se puede añadir un botón.
- **Reseñas.** Son un extracto fijo; actualizarlas de vez en cuando.
- **Reels.** Se incrustan desde Instagram; si se borra un reel, cambiar su código en `index.html`.
