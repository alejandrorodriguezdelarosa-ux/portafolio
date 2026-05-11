# Portafolio personal — Alejandro Rodríguez de la Rosa

Sitio web personal con una selección de proyectos de Data Science, Machine Learning e Inteligencia Artificial Generativa.

🌐 **En vivo:** *(URL pendiente de configurar)*

---

## Stack

- HTML5 + CSS3 puro (sin framework)
- Fuentes: Fraunces, Inter Tight, JetBrains Mono (Google Fonts)
- SVG inline para visualizaciones de proyectos
- Servido con Nginx en contenedor Docker

## Despliegue

El sitio se despliega automáticamente con [Dokploy](https://dokploy.com/) cada vez que se hace push a la rama `main`.

```bash
# Para desarrollo local:
docker build -t portafolio .
docker run -p 8080:80 portafolio
# Abrir http://localhost:8080
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

## Autor

**Alejandro Rodríguez de la Rosa**
Marketing · Data Science · IA
📧 alejandrorodriguezdelarosa@gmail.com
🔗 [LinkedIn](https://www.linkedin.com/in/alejandro-rodríguez-de-la-rosa-015956301)
