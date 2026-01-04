import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  
apiKey: "AIzaSyANKILdcmsgUlLXwj8jXx735IpqdaUsvnk",
authDomain: "todo-auth-app-2af8f.firebaseapp.com",
projectId: "todo-auth-app-2af8f",
storageBucket: "todo-auth-app-2af8f.firebasestorage.app",
messagingSenderId: "292208868546",
appId: "1:292208868546:web:0a77dad09a383ee9e60f5b"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(app);

