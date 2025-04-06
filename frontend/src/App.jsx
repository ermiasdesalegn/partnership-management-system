// src/App.js
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./Admin/context/AuthContext";
import RouteConfig from "./router/RouteConfig";

function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        <RouteConfig />
      {/* </AuthProvider> */}
    // </BrowserRouter>
  );
}

export default App;