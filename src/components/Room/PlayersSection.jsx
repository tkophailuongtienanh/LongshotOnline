export default function PlayersSection({ players }) {
    return (
        <div className="border p-3 rounded srink" style={{ width: '300px' }}>
            <ul className="list-none">
                {players.map((p) => (
                    <li className="border rounded p-3 flex gap-3 items-center mb-2" key={p.userId}>
                        <img className="rounded-full" src={'/images/ava/' + p.avatar + '.png'} style={{ width: '50px' }}></img>
                        {p.username}
                    </li>
                ))}
            </ul>
        </div>
    );
}
