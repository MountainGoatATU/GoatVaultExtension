import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import InitPage from "./pages/InitPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import type { AuthInitResponse } from "./models/authInitResponse";

function App() {
  const [initResponse, setInitResponse] = useState<AuthInitResponse | null>(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <InitPage
              setInitResponse={setInitResponse}
            />
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              initResponse={initResponse}
            />
          }
        />

        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
