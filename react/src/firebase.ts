import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCkOTn-SRxV5j6yN5FwGVp7RgPxHg96wdc",
    authDomain: "peter-noti.firebaseapp.com",
    projectId: "peter-noti",
    storageBucket: "peter-noti.firebasestorage.app",
    messagingSenderId: "535823655228",
    appId: "1:535823655228:web:a554980a3f1ce29600fe39",
    measurementId: "G-K2MPMERYL8"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


const TOKEN_REGISTER_URL: string = import.meta.env.VITE_TOKEN_REGISTER_URL || "";

export const sendTokenToServer = async (token: string) => {
  try {
    await fetch(TOKEN_REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    console.log('Token sent to FastAPI');
  } catch (err) {
    console.error('Error sending token:', err);
  }
};


export { messaging };