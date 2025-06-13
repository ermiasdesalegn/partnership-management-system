// src/App.js
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RouteConfig from "./route/RouteConfig";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  console.log('Google Client ID from env:', googleClientId);
  
  // For development, you need to set up your own Google OAuth client ID
  if (!googleClientId) {
    console.warn('VITE_GOOGLE_CLIENT_ID not found in environment variables. Google OAuth will not work.');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || "PLACEHOLDER_CLIENT_ID"}>
      <BrowserRouter>
        <AuthProvider>
          <RouteConfig />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;