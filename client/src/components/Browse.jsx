import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Browse.css"; // ✅ Make sure Browse.css handles styling
import Header from "./Header";

export default function Browse() {
    const [themes, setThemes] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    const handleThemeClick = (themeName) => {
        // Redirect to a new route based on the theme name
        navigate(`/products/${themeName}`);
    };

    return (
        <>
        <Header />
        <div className="browse-container">
            <h1>Browse Themes</h1>
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="theme-list">
                    {themes.map((theme) => (
                        <div
                            onClick={() => handleThemeClick(theme.name)}
                            key={theme._id}
                            className="theme-card"
                        >
                            <h3>{theme.name}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
}
