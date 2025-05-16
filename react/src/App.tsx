import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, sendTokenToServer } from './firebase';

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY || "";

function App() {
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState<{ title: string; body: string } | null>(null);
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (currentToken) {
          console.log('FCM Token:', currentToken);
          setToken(currentToken);
          await sendTokenToServer(currentToken);
        }
      } catch (err) {
        console.error('Token error:', err);
      }
    };

    fetchToken();

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification ?? {};
      setMsg({ title: title ?? '', body: body ?? '' });
    });

    // 서비스워커에서 온 메시지 수신
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.messageType === 'push-received') {
        const payload = event.data.notification;
        const title = payload.title ||  '';
        const body = payload.body || '';
        setMsg({ title, body });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Firebase Push Notification</h1>
      <p><strong>Token:</strong></p>
      <textarea rows={4} cols={80} readOnly value={token} />
      <hr />
      <p><strong>Message:</strong></p>
      {msg ? (
        <div>
          <h3>{msg.title}</h3>
          <p>{msg.body}</p>
        </div>
      ) : (
        <p>No message received.</p>
      )}
    </div>
  );
}

export default App;