import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Root, Home, Chats } from "./pages";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
