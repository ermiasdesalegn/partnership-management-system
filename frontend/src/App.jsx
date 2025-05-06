// src/App.js
import { BrowserRouter } from "react-router-dom";
import RouteConfig from "./router/RouteConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSetupPassword from './pages/AdminSetupPassword';

function App() {
  return (
    <BrowserRouter>
      <RouteConfig />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
