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
                setStats(resStats.data || {});
                setAchievements(resAchievements.data || {});
                setError("");
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

    return (
        <div className="container mt-5">
            <h2>Global Stats</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row text-center">
                <div className="col-md-3 card p-3 m-2">CVs: {stats.totalCVs || 0}</div>
                <div className="col-md-3 card p-3 m-2">Positions: {stats.totalPositions || 0}</div>
                <div className="col-md-3 card p-3 m-2">Candidates: {stats.totalCandidates || 0}</div>
                <div className="col-md-3 card p-3 m-2">Recruiters: {stats.totalRecruiters || 0}</div>
            </div>

            <div className="row text-center mt-3">
                <div className="col-md-3 card p-3 m-2">Recent CVs (24h): {stats.recentCVs || 0}</div>
                <div className="col-md-3 card p-3 m-2">Likes: {stats.totalLikes || 0}</div>
                <div className="col-md-3 card p-3 m-2">Projects: {stats.totalProjects || 0}</div>
            </div>

            <h2 className="mt-5">Your Achievements</h2>
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
