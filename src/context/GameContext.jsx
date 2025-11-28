import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <GameContext.Provider value={{ user, setUser }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
