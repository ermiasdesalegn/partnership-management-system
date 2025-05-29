// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteConfig from "./router/RouteConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSetupPassword from './pages/AdminSetupPassword';
import PartnerReports from "./components/partner/partner";
import PartnerDetail from "./components/partner/PartnerDetail";
import SignedPartners from "./components/partner/SignedPartners";
import UnsignedPartners from "./components/partner/UnsignedPartners";
import LawRelatedRequests from './components/view-request/LawRelatedRequests';
import RequestDetails from "./components/view-request/RequestDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RouteConfig />} />
        <Route path="/admin/request/:id" element={<RequestDetails />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
