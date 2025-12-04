import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PlayerList from "../components/PlayerList";
import PlayersSection from "../components/Room/PlayersSection";
import RollDiceSection from "../components/Room/RollDiceSection";
import { gameConnection, useSignalRGame } from "../hooks/useSignalR";
import PlayerBoardSection from "../components/Room/PlayerBoardSection"

const scaleRate = 5;
export default function Room() {
    const { rid } = useParams();
    const [players, setPlayers] = useState([]);
    const { connected, roomId } = useSignalRGame();
    const [gameStarted, setGameStarted] = useState(false);
    const [showPlayMat, setShowPlayMat] = useState(false);
    const [diceResult, setDiceResult] = useState({ d6: 1, d8: 1 })
    const [playTrigger, setPlayTrigger] = useState(0);

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

            gameConnection.on("DiceResult", (message) => {
                console.log('DiceResult ', message);
                setPlayTrigger(prev => prev + 1);
                setDiceResult(message);
            })
        }
        return () => {
            gameConnection.off("PlayerListChange");
            gameConnection.off("GameStarted");
            gameConnection.off("DiceResult");
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
                <RollDiceSection
                    rerollId={`${playTrigger}`}
                    d6={diceResult.d6}
                    d8={diceResult.d8}
                    onSendSignalR={() => {
                        console.log("Button clicked:");
                        gameConnection.invoke("RerollDice", rid);
                    }}
                />
                <div className="fixed bottom-0 left-0 w-full flex justify-center">
                    <div className="flex justify-center p-3 border rounded-tl rounded-tr" style={{ width: '500px', height: '50px' }}
                        onClick={() => setShowPlayMat(!showPlayMat)}>
                        <img src="/images/components/upper.png" className="h-full" />
                    </div>
                </div>
                <div className="PlayMat absolute duration-600 ease-in-out w-screen flex justify-center left-0" style={{ zIndex: '500', bottom: showPlayMat ? '100px' : '-2000px' }}>
                    <div className="content" style={{ width: 210 * scaleRate + 'px' }}>
                        {/* <img src="/images/components/board.png" alt="" className="h-full" /> */}
                        <PlayerBoardSection
                            width={210 * scaleRate}
                            allowedZones={[1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56]}   // zone được hover
                            blockedZones={[2, 10]}              // zone bị đánh dấu X
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}
