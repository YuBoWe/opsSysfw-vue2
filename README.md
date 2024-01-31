# oo运维系统后端

vue版本：2

ui：element ui

## Usage

### 物理部署

安装nginx

```sh
apt-get install -y nginx
```



将dist目录的内容放在`/var/www/html`中，删除默认的html



配置文件：

```nginx
server {
        listen 80 default_server;
        server_name localhost;
        location / {
                root /var/www/html;
                index index.html index.htm;
        }
        location ^~ /api/v1 {
                rewrite ^/api/v1(/.*) $1 break;
                proxy_pass http://127.0.0.1:8000;
        }
}
```

检查配置文件，并重启nginx

```sh
nginx -t
nginx -s reload
```



登录即可：

```
默认管理员：
admin
密码：
123456
```



