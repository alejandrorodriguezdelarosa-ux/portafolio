FROM nginx:alpine

# Copiar el sitio estático al directorio que Nginx sirve por defecto
COPY index.html /usr/share/nginx/html/index.html

# Configuración personalizada para servir bien el sitio (cache, gzip, etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
