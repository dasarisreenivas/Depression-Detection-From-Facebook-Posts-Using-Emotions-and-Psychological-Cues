import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DetectPage from "./pages/DetectPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/home" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />

        <Route path="/detect" element={
          <ProtectedRoute><DetectPage /></ProtectedRoute>
        } />

        <Route path="/result" element={
          <ProtectedRoute><ResultPage /></ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute><HistoryPage /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}