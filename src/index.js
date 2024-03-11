import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./sidor/Layout.js";
import Hem from "./sidor/Hem";
import Editor from "./Editor";
import Support from "./sidor/Support";
import NoPage from "./sidor/NoPage";
import Kontakt from './sidor/Kontakt.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hem />} />
          <Route path="Editor" element={<Editor />} />
          <Route path="Support" element={<Support />} />
          <Route path="Kontakt" element={<Kontakt />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
