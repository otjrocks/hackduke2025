import { Link } from "react-router-dom";

const themes = [
    { name: "Halloween", image: "halloween.jpg" },
    { name: "90s Party", image: "90s.jpg" },
    { name: "Beach Party", image: "beach.jpg" },
    { name: "Formal Night", image: "formal.jpg" }
];

export default function Browse() {
    return (
        <div>
            <h1>Browse Party Themes</h1>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {themes.map((theme) => (
                    <Link key={theme.name} to={`/theme/${theme.name}`} style={{ textDecoration: "none", color: "black" }}>
                        <div style={{ border: "1px solid black", padding: "10px", textAlign: "center" }}>
                            <img src={theme.image} alt={theme.name} style={{ width: "200px", height: "200px", objectFit: "cover" }} />
                            <h3>{theme.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
