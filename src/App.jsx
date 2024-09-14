import MemoryGame from "./pages/gamepage/MemoryGame";
import HomePage from "./pages/homepage/HomePage";
import Auth from "./pages/accesspage/Auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const apiEndpoint = "https://memory-game-shram.vercel.app";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path={`${apiEndpoint}/`} element={<HomePage />} />
          <Route path={`${apiEndpoint}/game/:mode`} element={<MemoryGame />} />
          <Route
            path={`${apiEndpoint}/authentication/:user`}
            element={<Auth />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
