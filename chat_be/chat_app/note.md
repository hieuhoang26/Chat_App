## Keycloak 
Dùng Service Account (Confidential Client + Client Credentials) → tránh dùng username/password admin.

Cache token trong memory theo TTL, tránh gọi /token mỗi request.

Sử dụng Keycloak Admin REST API thông qua WebClient, nhưng bao bọc token tự động refresh.