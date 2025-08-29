CREATE DATABASE IF NOT EXISTS pokeapi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE DATABASE IF NOT EXISTS pokeapi_db_shadow CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'app_password';

GRANT ALL PRIVILEGES ON pokeapi_db.* TO 'app_user'@'%';

GRANT ALL PRIVILEGES ON pokeapi_db_shadow.* TO 'app_user'@'%';

FLUSH PRIVILEGES;
