import { useEffect, useState } from "react";
import { lobbyConnection, gameConnection } from "../signalr/connection.js";

export function useSignalRGame() {
    const [connected, setConnected] = useState(false);
    const [roomId, setRoomId] = useState(null);
    let intervalId;

    useEffect(() => {
        // Bắt đầu kết nối
        if (gameConnection.state === "Disconnected") {
            gameConnection.start()
                .then(() => {
                    console.log("SignalR connected");
                    setConnected(true);
                })
                .catch(err => console.error("SignalR connect error:", err));
        }
        intervalId = setInterval(() => {
            gameConnection.invoke("Heartbeat");
        }, 5000);
        return () => {
            clearInterval(intervalId);
            // cleanup listener khi unmount
            if (gameConnection) {
                gameConnection.stop()
                    .then(() => console.log("Disconnected from gameHub"))
                    .catch(err => console.error(err));
            }
        };
    }, []);

    return { gameConnection, connected, roomId };
}
export function useSignalRLobby() {
    const [connected, setConnected] = useState(false);
    const [roomList, setRoomList] = useState(null);
    let intervalId;

    useEffect(() => {
        // Bắt đầu kết nối
        if (lobbyConnection.state === "Disconnected") {
            lobbyConnection.start()
                .then(() => {
                    console.log("SignalR connected");
                    setConnected(true);
                })
                .catch(err => console.error("SignalR connect error:", err));
        }
        intervalId = setInterval(() => {
            lobbyConnection.invoke("Heartbeat");
        }, 5000);
        return () => {
            clearInterval(intervalId);
            // cleanup listener khi unmount
            if (lobbyConnection) {
                lobbyConnection.stop()
                    .then(() => console.log("Disconnected from LobbyHub"))
                    .catch(err => console.error(err));
            }
        };
    }, []);

    return { lobbyConnection, connected, roomList };
}

export { lobbyConnection };
export { gameConnection };
