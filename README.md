<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Users Post API (NestJS)
## Опис
Цей проект є API на основі NestJS, яке використовує MongoDB для зберігання даних користувачів, Redis для кешування, а також підтримує аутентифікацію за допомогою JWT.
## Основні модулі:
* AuthModule – модуль для автентифікації (JWT, Passport, Refresh токени)
* UsersModule – управління користувачами (CRUD, пошук, фільтрація)
* PostsModule – управління постами (CRUD) 
* RedisModule – кешування даних та чорний список токенів
## Конфігураційні модулі:
* DatabaseModule – підключення до MongoDB
* JwtConfigModule – налаштування JWT
## Запуск проекту
### 1. Клонування репозиторію
```bash
git clone https://github.com/your-username/users_post_api_nest.git
cd users_post_api_nest
```
### 2. Налаштування середовища
Проєкт використовує файл local.env, який вже налаштований для роботи. Якщо потрібно змінити середовище, онови змінну APP_ENVIRONMENT у local.env.
### 3. Запуск через Docker
```bash
docker compose up --build
```
### 4. Альтернативний запуск без Docker
```bash
npm install
npm run start:dev
```
## 5. API Ендпоінти
### 5.1. Аутентифікація (/auth)
#### Реєстрація користувача
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "sEcurepassword123"}'
```
#### Авторизація та отримання токена
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "sEcurepassword123"}'
```
#### Вихід з системи
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --cookie "refresh_token=your_refresh_token"
```
Це видалить токени та додасть їх у чорний список у Redis.
### 5.2. Користувачі (/users)
#### Отримати список користувачів (з пагінацією)
```bash
curl -X GET "http://localhost:3000/users?page=1&limit=10" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
#### Отримати профіль авторизованого користувача
```bash
curl -X GET http://localhost:3000/users/me -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
#### Пошук користувачів за email
```bash
curl -X GET "http://localhost:3000/users/search?query=test@example.com" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
#### Фільтрація користувачів за параметрами
```bash
curl -X GET "http://localhost:3000/users/filter?role=user&isOnline=true&age=25&gender=male" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
Цей запит поверне всіх користувачів, які мають роль user, знаходяться онлайн, мають вік 25 і стать male.
#### Отримати користувача за ID
```bash
curl -X GET "http://localhost:3000/users/{id}" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
#### Оновити дані користувача
```bash
curl -X PATCH http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "age": 30, "gender": "male", "isOnline": true, "role": "admin"}'
```
Цей запит оновить ім'я, вік, стать, статус онлайну та роль користувача. Також можна  оновлювати емейл та  пароль.
#### Видалити свій акаунт 
```bash
curl -X DELETE http://localhost:3000/users/me -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
### 5.3. Пости (/posts)
#### Отримати всі пости користувача 
```bash
curl -X GET http://localhost:3000/posts/{userId}
```
#### Створити новий пост 
```bash
curl -X POST http://localhost:3000/posts/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Це мій новий пост!"}'
```
#### Оновити свій пост  
```bash
curl -X PATCH http://localhost:3000/posts/me/{postId} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Оновлений текст поста"}'
```
#### Видалити свій пост
```bash
curl -X DELETE http://localhost:3000/posts/me/{postId} -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 6. Ліцензія

####  Цей проект є приватним і не має публічної ліцензії.
