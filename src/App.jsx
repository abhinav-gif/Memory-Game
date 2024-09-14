import MemoryGame from "./pages/gamepage/MemoryGame";
import HomePage from "./pages/homepage/HomePage";
import Auth from "./pages/accesspage/Auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:mode" element={<MemoryGame />} />
          <Route path="/authentication/:user" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
