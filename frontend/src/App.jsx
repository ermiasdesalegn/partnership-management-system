// src/App.js
import { BrowserRouter } from "react-router-dom";
import RouteConfig from "./router/RouteConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSetupPassword from './pages/AdminSetupPassword';
import PartnerReports from "./components/partner/partner";
import PartnerDetail from "./components/partner/PartnerDetail";

function App() {
  return (
    <BrowserRouter>
      <RouteConfig />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
