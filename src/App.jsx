import React from "react";
import { GameProvider } from "./context/GameContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";

function App() {
  return (
    <GameProvider>
      {/* <div className="p-4">
        {!roomId && <Lobby />}
        {roomId && <Room />}
      </div> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/Room/:rid" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
