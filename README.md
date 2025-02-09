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
## Description
This project is an API based on NestJS, which uses MongoDB for data storage, Redis for caching, and supports authentication using JWT.
## Main Modules:
* AuthModule – authentication module (JWT, Passport, Refresh tokens)
* UsersModule – user management (CRUD, search, filtering)
* PostsModule – post management (CRUD) 
* RedisModule – data caching and blacklist for tokens
## Configuration Modules:
* DatabaseModule – MongoDB connection
* JwtConfigModule – JWT configuration
## Project Setup:
### 1. Clone the repository:
```bash
git clone https://github.com/your-username/users_post_api_nest.git
cd users_post_api_nest
```
### 2. Set up environment variables:
The project uses the local.env file, which is already configured to work. If you need to change the environment, update the APP_ENVIRONMENT variable in local.env.
### 3. Run with Docker:
```bash
docker compose up --build
```
### 4. Alternative setup without Docker:
```bash
npm install
npm run start:dev
```
## 5. API Endpoints:
### 5.1. Authentication (/auth)
#### User Registration:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "sEcurepassword123"}'
```
#### Login and Get Token:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "sEcurepassword123"}'
```
#### Logout:
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --cookie "refresh_token=your_refresh_token"
```
This will invalidate the tokens and add them to the blacklist in Redis.
### 5.2. Users (/users)
#### Get List of Users (with pagination):
```bash
curl -X GET "http://localhost:3000/users?page=1&limit=10" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
#### Get Profile of the Authorized User:
```bash
curl -X GET http://localhost:3000/users/me -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
#### Search Users by Email:
```bash
curl -X GET "http://localhost:3000/users/search?query=test@example.com" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
#### Filter Users by Parameters:
```bash
curl -X GET "http://localhost:3000/users/filter?role=user&isOnline=true&age=25&gender=male" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
This query will return all users with the role user, online status, age 25, and gender male.
#### Get User by ID:
```bash
curl -X GET "http://localhost:3000/users/{id}" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
#### Update User Data:
```bash
curl -X PATCH http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "age": 30, "gender": "male", "isOnline": true, "role": "admin"}'
```
This request will update the name, age, gender, online status, and role of the user. You can also update the email and password.
#### Delete Your Account: 
```bash
curl -X DELETE http://localhost:3000/users/me -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
### 5.3. Posts (/posts)
#### Get All Posts of a User: 
```bash
curl -X GET http://localhost:3000/posts/{userId}
```
#### Create a New Post: 
```bash
curl -X POST http://localhost:3000/posts/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Це мій новий пост!"}'
```
#### Update Your Post: 
```bash
curl -X PATCH http://localhost:3000/posts/me/{postId} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Оновлений текст поста"}'
```
#### Delete Your Post:
```bash
curl -X DELETE http://localhost:3000/posts/me/{postId} -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 6. License

####  This project is private and does not have a public license.
