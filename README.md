# React Native Todo App

Simple full-stack Todo application built with **Expo React Native** (client) and **Node.js + Express + MongoDB** (server).

## Features

- Email/password authentication with Firebase
- Create, edit, delete tasks
- Priorities (Low, Medium, High) and categories
- Deadline picker with calendar UI
- Filters for status (All, Pending, Completed)
- Empty state message when there are no tasks

## Project Structure

- `TODO-CLIENT/` – Expo React Native mobile app
- `TODO-SERVER/` – Node.js/Express REST API server

## How to Run

### Client (mobile app)

```bash
cd TODO-CLIENT/CLIENT
npm install
npx expo start

cd TODO-SERVER/SERVER
npm install
npm run dev


