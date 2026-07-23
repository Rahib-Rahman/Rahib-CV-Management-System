import React, { useEffect, useState } from "react";
import { getBadges, getAchievements } from "../services/api";

function Badges() {
    const [badges, setBadges] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [counts, setCounts] = useState({ projectCount: 0, cvCount: 0, likeCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resBadges = await getBadges();
                setBadges(resBadges.data.badges || []);
                setCounts({
                    projectCount: resBadges.data.projectCount || 0,
                    cvCount: resBadges.data.cvCount || 0,
                    likeCount: resBadges.data.likeCount || 0,
                });

                try {
                    const resAchievements = await getAchievements();
                    setAchievements(resAchievements.data || []);
                } catch (err) {
                    console.warn("Achievements not available:", err);
                }
            } catch (err) {
                console.error("Failed to fetch badges:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="container mt-5">Loading badges...</div>;

    return (
        <div className="container mt-5">
            <h2>Badges & Achievements</h2>
            <h4 className="mt-4">Stats</h4>
            <ul className="list-group">
                <li className="list-group-item">Projects: {counts.projectCount}</li>
                <li className="list-group-item">CVs: {counts.cvCount}</li>
                <li className="list-group-item">Likes: {counts.likeCount}</li>
            </ul>

            <h4 className="mt-4">Badges</h4>
            {badges.length > 0 ? (
                <ul className="list-group">
                    {badges.map((b, idx) => (
                        <li key={idx} className="list-group-item d-flex align-items-center">
                            {b.iconUrl && (
                                <img
                                    src={b.iconUrl}
                                    alt={b.name}
                                    style={{ width: "32px", height: "32px", marginRight: "10px" }}
                                />
                            )}
                            <div>
                                <strong>{b.name}</strong>
                                <div className="text-muted">{b.description}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No badges earned yet</p>
            )}

            <h4 className="mt-4">Achievements</h4>
            {achievements.length > 0 ? (
                <ul className="list-group">
                    {achievements.map((a, idx) => (
                        <li key={idx} className="list-group-item">
                            {a.title || a}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No achievements available</p>
            )}
        </div>
    );
}

export default Badges;
