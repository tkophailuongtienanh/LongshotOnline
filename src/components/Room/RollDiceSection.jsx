import { useEffect, useRef, useState } from "react";

export default function RollDiceSection({ rerollId, d6, d8, onSendSignalR }) {
    const canvasRef = useRef(null);
    const diskRef = useRef(null);
    const bowlRef = useRef(null);
    const d8ref = useRef(null);
    const d6ref = useRef(null);

    const runningRef = useRef(true);
    const rafRef = useRef(null);
    let currentResultD6 = ""
    let oldResultD6 = ""
    let currentResultD8 = ""
    let oldResultD8 = ""
    const [curResult, setCurResult] = useState({})
    const [oldResult, setOldResult] = useState({})

    // Update image src theo giá trị d6/d8
    useEffect(() => {
        setOldResult(curResult);
        setCurResult({ d6, d8 });
        handleReplay();
    }, [d6, d8, rerollId]);
    const draw = () => {
        if (!runningRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const disk = diskRef.current; // video đĩa
        const bowl = bowlRef.current; // video bát
        const d8cur = d8ref.current;   // hình ảnh ở giữa
        const d6cur = d6ref.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. ĐĨA (layer dưới cùng)
        ctx.drawImage(disk, 0, 0, canvas.width, canvas.height);

        // 2. ẢNH ở giữa
        if (disk.currentTime <= 0.32) {
            // Hiển thị kết quả cũ (trước khi animation chạy)
            if (d6cur) d6cur.src = `/images/components/d6-${oldResult.d6}.png`;
            if (d8cur) d8cur.src = `/images/components/d8-${oldResult.d8}.png`;
        } else {
            // Hiển thị kết quả mới
            if (d6cur) d6cur.src = `/images/components/d6-${curResult.d6}.png`;
            if (d8cur) d8cur.src = `/images/components/d8-${curResult.d8}.png`;
        }
        if (disk.currentTime <= 0.32 || disk.duration - disk.currentTime <= 0.8) {
            // 1.1. ẢNH D6
            ctx.drawImage(
                d6cur,
                canvas.width * 0.315,
                canvas.height * 0.5,
                canvas.width * 0.18,
                canvas.height * 0.18
            );
            // 1.2. ẢNH D8
            ctx.drawImage(
                d8cur,
                canvas.width * 0.525,
                canvas.height * 0.5,
                canvas.width * 0.2 * 0.87,
                canvas.height * 0.2
            );
        }
        ctx.drawImage(bowl, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        rafRef.current = requestAnimationFrame(draw);
    };

    const handleReplay = () => {
        const disk = diskRef.current;
        const bowl = bowlRef.current;

        disk.pause();
        bowl.pause();
        disk.currentTime = 0;
        bowl.currentTime = 0;

        runningRef.current = false;
        cancelAnimationFrame(rafRef.current);
        setTimeout(async () => {
            runningRef.current = true;
            await disk.play();
            await bowl.play();
            draw();
        }, 60);
    };
    const handleSignalR = onSendSignalR
    useEffect(() => {
        const start = async () => {
            await diskRef.current.play();
            await bowlRef.current.play();
            runningRef.current = true;
            draw();
        };
        start();

        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <div className="flex justify-center">
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="border"
                onClick={handleSignalR}
            />
            {/* Video + ảnh ẩn, chỉ dùng làm input cho canvas */}
            <video ref={diskRef} src="/images/components/khay500x500.webm" muted playsInline hidden />
            <video ref={bowlRef} src="/images/components/vung500x500.webm" muted playsInline hidden />
            <img ref={d8ref} src={`/images/components/d8-${d8}.png`} alt="" hidden />
            <img ref={d6ref} src={`/images/components/d6-${d6}.png`} alt="" hidden />
        </div>
    );
}
