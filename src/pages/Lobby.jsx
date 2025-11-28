import React, { useEffect, useState } from "react";
import { lobbyConnection, useSignalRLobby } from "../hooks/useSignalR";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
    const { connected, roomId } = useSignalRLobby();
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [username, setUserName] = useState("");
    const [roomList, setRoomList] = useState([])

    useEffect(
        () => {
            if (!connected) return;
            lobbyConnection.on("LobbyReload", (message) => {
                console.log(message);
                setRoomList(message);
            })
            lobbyConnection.on("RoomCreated", (message) => {
                console.log(message);
                navigate('room/' + message)
            })
            return () => {
                lobbyConnection.off("LobbyReload");
                lobbyConnection.off("RoomCreated");
            }
        },
        [connected]
    )
    if (!connected) {
        return <div className="p-4">Đang kết nối Lobby...</div>;
    }
    const createRoom = () => {
        lobbyConnection.invoke("CreateRoom")
    }
    const joinRoom = () => navigate('room/' + roomCode);

    return (
        <div className="w-screen h-screen mx-auto p-4 border rounded flex flex-col">
            <h1 className="text-xl text-center font-bold mb-4">Lobby</h1>
            <div className="content flex justify-center grow">
                <div className="w-1/2 max-w-md flex flex-col h-full grow">
                    <div className="grow bg-gray-400 mb-3">
                        <ul className="list-none">
                            {
                                roomList.map(item => {
                                    return <li key={item.roomId} className="p-3 flex justify-between hover:bg-sky-700" onClick={() => navigate('room/' + item.roomId)}>
                                        <span className="font-bold">{item.roomId}</span>
                                        <span className="">{item.numberPlayers}/8</span>
                                    </li>

                                })
                            }
                        </ul>
                    </div>
                    <button
                        className="w-full bg-blue-600 text-white p-2 rounded mb-3"
                        onClick={createRoom}
                    >
                        Tạo phòng mới
                    </button>
                    <div className="bottom-0 position-fixed">
                        <input
                            className="border p-2 w-1/2 mb-2"
                            placeholder="Nhập mã phòng"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                        />
                        <button
                            className=" w-1/2 bg-green-600 text-white p-2 rounded"
                            onClick={joinRoom}
                        >
                            Vào phòng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
