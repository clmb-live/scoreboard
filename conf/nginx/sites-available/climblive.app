server {
	listen 443 ssl;
	server_name climblive.app www.climblive.app;

	# Gzip Settings
	include snippets/gzip.conf;

	client_max_body_size 20M;

	location ~ ^(.*\.[^\/\.]+)$ {
		expires 1d;
		add_header Cache-Control "public";
		access_log off;

		proxy_pass http://127.0.0.1:8080$1;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "Upgrade";
	}

	location = /index.html {
		rewrite ^ /;
	}

	location / {
		rewrite ^ /;
	}

	location = / {
		proxy_pass http://127.0.0.1:8080/index.html;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "Upgrade";
	}

	include /etc/nginx/options-ssl.conf;
	ssl_certificate /etc/letsencrypt/live/climblive.app/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/climblive.app/privkey.pem;
}

server {
	listen 80;
	server_name climblive.app www.climblive.app;
	return 301 https://climblive.app$request_uri;
}
