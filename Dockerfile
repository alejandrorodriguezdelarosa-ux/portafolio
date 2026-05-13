FROM nginx:alpine

# Copiar TODOS los archivos estáticos del repo al directorio raíz de Nginx
# (index.html, vídeos, imágenes, etc.)
COPY . /usr/share/nginx/html/

# Limpiar archivos que no deben servirse (Dockerfile, .git, etc.)
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/README.md \
          /usr/share/nginx/html/.gitignore

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
