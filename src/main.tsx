import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Explorer from "./screens/explorer/index.tsx";
import Models from "./screens/models/index.tsx";
import Test from "./screens/test/index.tsx";
import Datasets from "./screens/datasets/index.tsx";
import Home from "./screens/home/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/models" element={<Models />} />
        <Route path="tests" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);