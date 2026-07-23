import React, { useEffect, useState } from "react";
import { getStats, getAchievements } from "../services/api";

function Stats() {
    const [stats, setStats] = useState({});
    const [achievements, setAchievements] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [resStats, resAchievements] = await Promise.all([
                    getStats(),
                    getAchievements(),
                ]);

                setStats(resStats.data);
                setAchievements(resAchievements.data);
            } catch (err) {
                console.error("Stats fetch error:", err);
                setError("Failed to load stats");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="container mt-5">Loading stats...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Global Stats</h2>
            <div className="row">
                <div className="col-md-3">CVs: {stats.totalCVs || 0}</div>
                <div className="col-md-3">Positions: {stats.totalPositions || 0}</div>
                <div className="col-md-3">Candidates: {stats.totalCandidates || 0}</div>
                <div className="col-md-3">Recruiters: {stats.totalRecruiters || 0}</div>
            </div>
            <div className="row mt-3">
                <div className="col-md-3">Recent CVs (24h): {stats.recentCVs || 0}</div>
                <div className="col-md-3">Likes: {stats.totalLikes || 0}</div>
                <div className="col-md-3">Projects: {stats.totalProjects || 0}</div>
            </div>

            <h2 className="mt-5">Your Achievements.</h2>
            <ul className="list-group">
                {achievements.badges?.length > 0 ? (
                    achievements.badges.map((b, idx) => (
                        <li key={idx} className="list-group-item">
                            {b}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No achievements yet.</li>
                )}
            </ul>
            <div className="mt-3">
                <p>Projects: {achievements.projectCount || 0}</p>
                <p>CVs: {achievements.cvCount || 0}</p>
                <p>Likes: {achievements.likeCount || 0}</p>
            </div>
        </div>
    );
}

export default Stats;

