import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Root, Home, Chats } from "./pages";
import axios from "axios";
import PublicRoute from "./utils/PublicRoutes";
import PrivateRoute from "./utils/PrivateRoutes";
axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Root />} />
          <Route path="/home" element={<Home />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/chats" element={<Chats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
