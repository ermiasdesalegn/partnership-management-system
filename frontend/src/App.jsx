// src/App.js
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./Admin/context/AuthContext";
import RouteConfig from "./router/RouteConfig";

function App() {
  return (
    <BrowserRouter>
   
      

        <RouteConfig />
   
   
     </BrowserRouter>
    
  );
}

export default App;