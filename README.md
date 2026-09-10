# Portafolio personal — Alejandro Rodríguez de la Rosa

Sitio web personal con una selección de proyectos de Data Science, Machine Learning e Inteligencia Artificial Generativa.

🌐 **En vivo:** https://alejandrorodriguezdelarosa-ux.github.io/portafolio/

---

## Stack

- HTML5 + CSS3 puro (sin framework)
- Tipografía del sistema (San Francisco en Apple, Inter Tight de respaldo)
- SVG inline para visualizaciones de proyectos
- Servido como sitio estático en GitHub Pages

## Despliegue

GitHub Pages publica la rama `main` en cada push. Sin Docker, sin Dokploy y sin
servidor propio: el host anterior (Hostinger/Coolify) desapareció y el sitio se
recuperó desde este repositorio.

```bash
# Para desarrollo local basta con un servidor estático:
python -m http.server 8870
# Abrir http://localhost:8870/index.html
```

## Estructura

```
.
├── index.html       # Sitio completo (HTML + CSS + JS inline)
├── Dockerfile       # Imagen de Nginx con el sitio
├── nginx.conf       # Configuración del servidor (gzip, cache, seguridad)
└── README.md
```

---

## Estado y decisiones

### Rediseño al estilo Apple (septiembre 2026)

Aplicado como **capa reversible**: los tokens de `:root` se reescribieron y el
resto vive en el último bloque `<style>` del documento, rotulado `CAPA APPLE`.
Quitando ese bloque se vuelve al diseño anterior. Debe ir siempre **al final**:
al principio lo pisaban los bloques posteriores.

Paleta: blanco `#ffffff` / gris `#f5f5f7`, tinta `#1d1d1f`, azul `#0071e3`.

### Reparto del espacio

El hueco no era de padding sino estructural: un panel de proporción fija junto a
una columna de texto largo deja de 188 a 848 px muertos por ficha. Se pasó al
patrón de Apple —media ancha arriba, texto debajo a dos columnas— con el
`column-count` **sobre la lista**, no sobre `.project-info` (allí todo lo demás
llevaba `column-span: all` y la mitad derecha quedaba en blanco).

### Móvil

De 26,1 a 17,3 pantallas de scroll. Imagen a sangre, copy corto visible y el
detalle técnico plegado en un `<details class="ficha-detalle">` que el script
crea con `open = true`, de modo que si el JS falla no se oculta nada. El corte
se decide con `matchMedia`, no con el evento `resize`, que no dispara fiable.

### Trampas encontradas (no repetir)

- **Alturas en porcentaje**: `.visual-eda .chart` mide `65%`; al poner el panel
  en `height: auto` el porcentaje resolvió a 0 y el gráfico desapareció sin
  error. Los paneles con hijos en `%` necesitan altura definida.
- **Orden imagen/texto**: la mitad de las fichas trae el texto antes en el HTML.
  En móvil hay que forzar `order: -1` en `.project-visual` o se leen dos paneles
  seguidos con un hueco entre medias.
- **`position: static` en los paneles** destruye el contexto de posicionamiento
  de sus hijos absolutos (el vídeo de Traiana se fue a 1200×1549). Va `relative`.
- **`background` sobre `.project-visual`** aplana los cinco paneles oscuros y
  deja su texto claro ilegible.
- Las comprobaciones automáticas de contraste dan falsos positivos cuando el
  fondo es un `linear-gradient`: `backgroundColor` sale transparente.
- La batería de verificación no ve un elemento bien dimensionado colocado donde
  no toca. Hay que mirar capturas.

### Mantenimiento de la demo

`.github/workflows/mantener-demo-despierta.yml` abre a diario la demo de
Streamlit con Playwright y pulsa "Yes, get this app back up!" si está dormida.
Un `curl` no vale: la raíz responde 303 al login y devuelve 200 sin tocar la app.
**Inerte ahora mismo** por el bloqueo de facturación de la cuenta de GitHub.

### Verificación

`python -m http.server 8870` y los scripts de medición del scratchpad: recorte
(`scrollHeight > clientHeight`), solapamiento entre cajas, contraste WCAG,
desbordamiento horizontal y recuento de etiquetas. Se comprueba a 390, 768 y
1440 px.

---

## Autor

**Alejandro Rodríguez de la Rosa**
Marketing · Data Science · IA
📧 alejandrorodriguezdelarosa@gmail.com
🔗 [LinkedIn](https://www.linkedin.com/in/alejandro-rodríguez-de-la-rosa-015956301)
