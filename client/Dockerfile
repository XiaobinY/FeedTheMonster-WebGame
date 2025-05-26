FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom static assets from the current folder to Nginx folder
COPY . /usr/share/nginx/html/

# Overwrite default Nginx configuration with custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
