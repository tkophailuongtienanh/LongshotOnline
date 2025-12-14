import { useRef, useEffect, useState } from "react";
import { ACTIONS } from "../../global/actionsConfig";

export default function MapSection() {
    const canvasRef = useRef(null);
    const bgImg = useRef(null);

    const [hoverZone, setHoverZone] = useState(null);
    const [alias, setAlias] = useState(1);
    const [zones, setZones] = useState([]);


    useEffect(() => {
        bgImg.current = new Image();
        bgImg.current.src = "/images/components/map.png";

        bgImg.current.onload = () => draw();
    }, []);

    useEffect(() => {
        draw(); // khi hover thay đổi thì vẽ lại
    }, [hoverZone]);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // vẽ nền
        ctx.drawImage(bgImg.current, 0, 0, canvas.width, canvas.height);

    };

    return (
        <div className="border p-3 rounded">
            <canvas
                ref={canvasRef}
                className="w-full"
                width={3800}
                height={2700}
            />
        </div>
    );
}
