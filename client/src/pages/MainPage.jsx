import React, { useEffect, useState } from "react";
import socket from "../socket";
import {getLatestPositions, getPopularPositions, getStats, getTags,} from "../services/api";

function MainPage() {
    const [latest, setLatest] = useState([]);
    const [popular, setPopular] = useState([]);
    const [stats, setStats] = useState({});
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [resLatest, resPopular, resStats, resTags] = await Promise.all([
                    getLatestPositions(), getPopularPositions(), getStats(), getTags(),]);

                setLatest(resLatest.data);
                setPopular(resPopular.data);
                setStats(resStats.data);
                setTags(resTags.data);
            } catch (err) {
                console.error("MainPage fetch error:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        socket.on("newPosition", (position) => {
            setLatest((prev) => [position, ...prev].slice(0, 10));
        });

        return () => {
            socket.off("newPosition");
        };
    }, []);

    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Main Dashboard</h2>

            <h4>Stats</h4>
            <div className="row">
                <div className="col-md-2">CVs: {stats.totalCVs || 0}</div>
                <div className="col-md-2">Positions: {stats.totalPositions || 0}</div>
                <div className="col-md-2">Candidates: {stats.totalCandidates || 0}</div>
                <div className="col-md-2">Recruiters: {stats.totalRecruiters || 0}</div>
                <div className="col-md-2">Recent CVs (24h): {stats.recentCVs || 0}</div>
            </div>

            <h4 className="mt-4">Latest Positions</h4>
            <ul className="list-group">
                {latest.map((p) => (
                    <li key={p.id} className="list-group-item">
                        {p.title}
                    </li>
                ))}
            </ul>

            <h4 className="mt-4">Popular Positions</h4>
            <ul className="list-group">
                {popular.map((p) => (
                    <li key={p.id} className="list-group-item">
                        {p.title} ({p.cvCount || 0} CVs)
                    </li>
                ))}
            </ul>

            <h4 className="mt-4">Tags</h4>
            <div>
                {tags.map((t) => (
                    <span key={t.tag} className="badge bg-secondary me-2">
            {t.tag} ({t.count || 0})
          </span>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
