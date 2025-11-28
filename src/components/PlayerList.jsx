export default function PlayerList({ players }) {
    return (
        <div className="border p-3 rounded srink" style={{ width: '300px' }}>
            <h3 className="font-semibold mb-2">Danh sách người chơi</h3>
            <ul className="list-none">
                {players.map((p) => (
                    <li className="border rounded p-3 flex gap-3 items-center mb-2" key={p.userId}>
                        <img src={'/images/ava/' + p.avatar + '.png'} style={{ width: '50px' }}></img>
                        {p.username}
                    </li>
                ))}
            </ul>
        </div>
    );
}
