// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteConfig from "./router/RouteConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
