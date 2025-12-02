# Travel Health Data Commons website

This is [React](https://react.dev/) + [Vite](https://vite.dev/) website about the Travel Health Data Commons (THDC), including a registration form for people interested in the initiative.

## Run development server

First, install dependencies:

```
npm install
```

Then, launch the server to run locally:

```
npm run dev
```

## Firebase settings

This site uses [Firebase](https://firebase.google.com/) to store the user registration information. To setup the Firebase
 account, follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (or use an existing one).
3. Register a "Web App" (</> icon) and copy the firebaseConfig object provided.
3. Create a .env file in the root folder of this project and enter the values:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
VITE_FIREBASE_APP_ID=1:123456...
```

Important: Do not add the .env file to revision control. 

### Anonymous Authentication

Since the site is designed to log into Firebase anonymously, but Anonymous Authentication is not enabled by default. To turn Anonymous Authentication on:

1. Go to the Firebase Console and open the project.
2. In the left sidebar, click Build, then click Authentication.
3. Click the Get started button (if you haven't already).
4. Select the Sign-in method tab.
5. Click on Anonymous in the list of providers.
6. Toggle the Enable switch to "On" and click Save.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.