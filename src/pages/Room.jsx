import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PlayerList from "../components/PlayerList";
import PlayersSection from "../components/Room/PlayersSection";
import RollDiceSection from "../components/Room/RollDiceSection";
import { gameConnection, useSignalRGame } from "../hooks/useSignalR";

const scaleRate = 5;
export default function Room() {
    const { rid } = useParams();
    const [players, setPlayers] = useState([]);
    const { connected, roomId } = useSignalRGame();
    const [gameStarted, setGameStarted] = useState(false);
    const [showPlayMat, setShowPlayMat] = useState(false);

    const canvasRef = useRef(null);
    const diskRef = useRef(null);
    const bowlRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const disk = diskRef.current; // video đĩa
        const bowl = bowlRef.current; // video bát
        const img = imgRef.current;   // hình ảnh ở giữa

        let running = true;

        // play đồng thời video
        const startVideos = async () => {
            try {
                await disk.play();
                await bowl.play();
            } catch (e) {
                console.warn("Auto-play bị chặn, cần click để bắt đầu video");
            }

            draw();
        };

        const draw = () => {
            if (!running) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. ĐĨA (layer dưới cùng)
            ctx.drawImage(disk, 0, 0, canvas.width, canvas.height);

            // 2. ẢNH ở giữa
            ctx.drawImage(
                img,
                canvas.width * 0.25,
                canvas.height * 0.25,
                canvas.width * 0.5,
                canvas.height * 0.5
            );

            // 3. BÁT (layer trên cùng)
            ctx.drawImage(bowl, 0, 0, canvas.width, canvas.height);

            requestAnimationFrame(draw);
        };

        startVideos();

        return () => {
            running = false;
        };
    }, [canvasRef])

    useEffect(() => {
        if (rid && rid != '' && connected) {
            gameConnection.invoke("JoinRoom", rid, "Player " + Math.ceil(Math.random() * 10000).toString(), Math.ceil(Math.random() * 50).toString());

            gameConnection.on("PlayerListChange", (message) => {
                console.log('list', message);
                setPlayers(message);
            })

            gameConnection.on("GameStarted", (message) => {
                console.log('GameStarted ', message);
                setGameStarted(true);
            })
        }
        return () => {
            gameConnection.off("PlayerListChange");
            gameConnection.off("GameStarted");
        }
    }, [connected, rid]);

    if (!connected) {
        return <div className="p-4">Đang kết nối Phòng chơi...</div>;
    }
    if (!gameStarted) {
        return (
            <div className="w-screen h-screen mx-auto p-4 border rounded flex flex-col items-center relative">
                <button
                    className="bg-red-600 text-white p-2 rounded absolute right-2"
                    onClick={() => gameConnection.invoke("leave_room")}
                >
                    Rời phòng
                </button>
                <h1 className="text-xl text-center font-bold mb-4">Phòng</h1>
                <PlayerList players={players} />
                <button
                    className="bg-red-600 text-white p-2 rounded "
                    onClick={() => gameConnection.invoke("StartGame", rid)}
                    disabled={players.length <= 1}
                >
                    Bắt đầu
                </button>
            </div>
        );
    }
    return (
        <div className="w-screen h-screen max-h-screen relative p-4 border rounded flex flex-col overflow-hidden">
            <h1 className="text-xl text-center font-bold mb-4">Phòng</h1>
            <div className="Gamezone flex">
                <PlayersSection players={players} />
                <RollDiceSection></RollDiceSection>
                <div className="fixed bottom-0 left-0 w-full flex justify-center">
                    <div className="flex justify-center p-3 border rounded-tl rounded-tr" style={{ width: '500px', height: '50px' }}
                        onClick={() => setShowPlayMat(!showPlayMat)}>
                        <img src="/images/components/upper.png" className="h-full" />
                    </div>
                </div>
                <div className="PlayMat absolute duration-600 ease-in-out w-screen flex justify-center left-0" style={{ zIndex: '500', bottom: showPlayMat ? '100px' : '-2000px' }}>
                    <div className="content" style={{ width: 180 * scaleRate + 'px' }}>
                        <img src="/images/components/board.png" alt="" className="h-full" />
                    </div>
                </div>
            </div>

        </div>
    );
}
