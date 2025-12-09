import { useRef, useEffect, useState } from "react";
import { ACTIONS } from "../../global/actionsConfig";

const BGW = 2100;
const BGH = 1300;
export default function PlayerBoardSection({ width = 0, height = 0, allowedZones = [], blockedZones = [] }) {

    const canvasRef = useRef(null);
    const overlayImg1 = useRef(null);
    const overlayImg2 = useRef(null);
    const blockImg = useRef(null);
    const bgImg = useRef(null);

    const [hoverZone, setHoverZone] = useState(null);
    const [alias, setAlias] = useState(1);
    const [zones, setZones] = useState([]);

    // useEffect(() => {
    //     if (width > 0) {
    //         setAlias(parseFloat(width) / BGW);
    //         setZones(ACTIONS.map(a => {
    //             return {
    //                 id: a.id,
    //                 x: a.x * alias,
    //                 y: a.y * alias,
    //                 w: a.w * alias,
    //                 h: a.h * alias
    //             }
    //         }))
    //     } else if (height > 0) {
    //         setAlias(parseFloat(height) / BGH);
    //     }
    //     console.log(alias);
    //     draw();
    // }, [width, height])

    useEffect(() => {
        overlayImg1.current = new Image();
        overlayImg1.current.src = "/images/components/hover1.png";

        overlayImg2.current = new Image();
        overlayImg2.current.src = "/images/components/hover2.png";

        blockImg.current = new Image();
        blockImg.current.src = "/images/components/cross.png";

        bgImg.current = new Image();
        bgImg.current.src = "/images/components/board.png";

        if (width > 0) {
            setAlias(parseFloat(width) / BGW);
            setZones(ACTIONS.map(a => {
                return {
                    id: a.id,
                    x: a.x * parseFloat(width) / BGW,
                    y: a.y * parseFloat(width) / BGW,
                    w: a.w * parseFloat(width) / BGW,
                    h: a.h * parseFloat(width) / BGW
                }
            }))
        } else if (height > 0) {
            setAlias(parseFloat(height) / BGH);
        }

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

        // vẽ các zone block trước
        blockedZones.forEach((id) => {
            const zone = zones.find((z) => z.id === id);
            if (!zone) return;
            ctx.drawImage(
                blockImg.current,
                zone.x,
                zone.y, 
                zone.w,
                zone.h
            );
        });

        // nếu đang hover zone → vẽ overlay
        if (hoverZone) {
            if (hoverZone.id > 16) {
                ctx.drawImage(
                    overlayImg1.current,
                    hoverZone.x,
                    hoverZone.y,
                    hoverZone.w,
                    hoverZone.h
                );
            } else {
                ctx.drawImage(
                    overlayImg2.current,
                    hoverZone.x,
                    hoverZone.y,
                    hoverZone.w,
                    hoverZone.h
                );
            }
        }
    };

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // console.log("mouse: " + x + " , " + y)

        // reset
        let found = {};
        for (const zone of zones) {
            if (
                x >= zone.x &&
                x <= zone.x + zone.w &&
                y >= zone.y &&
                y <= zone.y + zone.h
            ) {
                // console.log("fonud: ", zone)
                found = zone;
            }
        }

        setHoverZone({});
        if (!allowedZones.includes(found.id)) {
            // console.log("Not allow zone ", found.id); // không được hover
        }
        else if (blockedZones.includes(found.id)) {
            // console.log("blocked: ", found.id); // bị blocked
        } else {
            setHoverZone(found);
        }
    };

    const handleMouseLeave = () => setHoverZone(null);

    return (
        <canvas
            ref={canvasRef}
            width={alias * BGW}
            height={alias * BGH}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ border: "1px solid #999", cursor: "pointer" }}
        />
    );
}
