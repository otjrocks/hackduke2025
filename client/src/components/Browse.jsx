import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Browse.css"; // ✅ Make sure Browse.css handles styling

export default function Browse() {
    const [themes, setThemes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const response = await fetch("http://localhost:3001/theme/themes"); // Adjust URL as needed
                if (!response.ok) {
                    throw new Error("Failed to fetch themes");
                }
                const data = await response.json();
                setThemes(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchThemes();
    }, []);

    return (
        <div className="browse-container">
            <h1>Browse Party Themes</h1>
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="theme-list">
                    {themes.map((theme) => (
                        <div key={theme._id} className="theme-card">
                            <h3>{theme.name}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
