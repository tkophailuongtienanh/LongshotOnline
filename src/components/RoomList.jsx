export default function RoomList({ rooms }) {
    return (
        <div className="border p-3 rounded">
            <h3 className="font-semibold mb-2">Danh sách Phòng chơi</h3>
            <ul className="list-disc pl-5">
                {rooms.map((p) => (
                    <li key={p.id}>{p.name}</li>
                ))}
            </ul>
        </div>
    );
}
