import { Link } from "react-router-dom";
import "./Browse.css"; // ✅ Make sure Browse.css handles styling

const themes = [
    "Duke Basketball",
    "Halloween",
    "Oktoberfest",
    "Professional Events",
    "Waynestock",
    "Disco",
    "Date Formals",
    "Duo Costumes",
    "Christmas",
    "Cowboy",
    "Tropical",
    "Valentines",
    "Rave",
    "Candyland",
    "Mardi Gras",
    "Risky Business",
    "Apres Ski",
    "Spring Break",
    "Formals", 
    "Football tailgate"
];

export default function Browse() {
    return (
        <div className="browse-container">
            <h1>Browse Party Themes</h1>
            <div className="theme-list">
                {themes.map((theme) => (
                    <div key={theme} className="theme-card">
                        <h3>{theme}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}