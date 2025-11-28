import React, { useState } from "react";
import { lobbyConnection } from "../hooks/useSignalR";

export default function Lobby() {
    const [roomCode, setRoomCode] = useState("");
    const [username, setUserName] = useState("");

    const createRoom = () => lobbyConnection.invoke("CreateRoom", roomCode);
    const joinRoom = () => lobbyConnection.invoke("JoinRoom", roomCode, username);

    lobbyConnection.on("RoomCreated", (roomId) => {
        console.log(roomId);
    })

    return (
        <div className="max-w-md mx-auto p-4 border rounded">
            <h1 className="text-xl font-bold mb-4">Lobby</h1>

            <button
                className="w-full bg-blue-600 text-white p-2 rounded mb-3"
                onClick={createRoom}
            >
                Tạo phòng mới
            </button>
            <input
                className="border p-2 w-full mb-2"
                placeholder="Nhập tên người chơi"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                className="border p-2 w-full mb-2"
                placeholder="Nhập mã phòng"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
            />
            <button
                className="w-full bg-green-600 text-white p-2 rounded"
                onClick={joinRoom}
            >
                Vào phòng
            </button>
        </div>
    );
}
