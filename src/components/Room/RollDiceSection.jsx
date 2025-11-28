import { useEffect, useRef, useState } from "react";

export default function RollDiceSection() {
    const canvasRef = useRef(null);
    const diskRef = useRef(null);
    const bowlRef = useRef(null);
    const d8ref = useRef(null);
    const d6ref = useRef(null);

    const runningRef = useRef(true);
    const rafRef = useRef(null);

    const draw = () => {
        if (!runningRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const disk = diskRef.current; // video đĩa
        const bowl = bowlRef.current; // video bát
        const d8 = d8ref.current;   // hình ảnh ở giữa
        const d6 = d6ref.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. ĐĨA (layer dưới cùng)
        ctx.drawImage(disk, 0, 0, canvas.width, canvas.height);

        // 2. ẢNH ở giữa
        if (disk.duration - disk.currentTime <= 0.8) {
            // ctx.drawImage(img1, 100, 100, 150, 150);
            // ctx.drawImage(img2, 300, 100, 150, 150);
            ctx.drawImage(
                d6,
                canvas.width * 0.315,
                canvas.height * 0.5,
                canvas.width * 0.18,
                canvas.height * 0.18
            );
            // 2. ẢNH ở giữa
            ctx.drawImage(
                d8,
                canvas.width * 0.525,
                canvas.height * 0.5,
                canvas.width * 0.2 * 0.87,
                canvas.height * 0.2
            );
        }

        ctx.save(); // lưu trạng thái canvas

        // 3. BÁT (layer trên cùng)
        // const sx = 0;
        // const sy = 0; // bắt đầu từ trên cùng
        // const sWidth = bowl.videoWidth;
        // const sHeight = bowl.videoHeight * 0.6; // lấy nửa trên

        // const dx = 0;
        // const dy = 0;
        // const dWidth = canvas.width;
        // const dHeight = canvas.height / 2; // vẽ nửa trên canvas
        // ctx.drawImage(bowl, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // ctx.drawImage(bowl, 0, 0, canvas.width, canvas.height);
        ctx.moveTo(0, 0);                     // góc trên trái
        if (disk.currentTime <= 0.8 || disk.duration - disk.currentTime <= 0.8) {
            ctx.lineTo(0, canvas.height * 0.25);                     // góc trên trái
            ctx.lineTo(canvas.width, canvas.height * 0.635);          // góc trên phải
        } else {
            // disk.duration
            const t = disk.currentTime;
            const position = ((t - 0.8) * 0.3 / 1.4) + 0.25;
            const position2 = ((t - 0.8) * 0.2 / 1.4) + 0.635;
            ctx.lineTo(0, canvas.height * position);                     // góc trên trái
            ctx.lineTo(canvas.width, canvas.height * position2);          // góc trên phải
        }
        ctx.lineTo(canvas.width, 0);
        ctx.closePath();

        // ctx.beginPath();
        // ctx.moveTo(0, canvas.height * 0.25);                     // góc trên trái
        // ctx.lineTo(canvas.width, canvas.height * 0.635);          // góc trên phải
        // ctx.lineTo(canvas.width, 0); // góc phải nửa dưới
        // // ctx.lineTo(0, canvas.width);         // góc trái dưới
        // ctx.closePath();

        ctx.clip(); // mọi thứ vẽ sau đây chỉ hiển thị trong path

        ctx.drawImage(bowl, 0, 0, canvas.width, canvas.height);

        ctx.restore();

        rafRef.current = requestAnimationFrame(draw);
        // requestAnimationFrame(draw);
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
            {/* Canvas hiển thị kết quả cuối */}
            <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className="border"
                onClick={() => { handleReplay() }}
            />

            {/* Video + ảnh ẩn, chỉ dùng làm input cho canvas */}
            <video ref={diskRef} src="/images/components/khay500x500.mp4" muted playsInline hidden />
            <video ref={bowlRef} src="/images/components/vung500x500.mp4" muted playsInline hidden />
            <img ref={d8ref} src="/images/components/d8-5.png" alt="" hidden />
            <img ref={d6ref} src="/images/components/d6-2.png" alt="" hidden />
        </div>
    );
}
