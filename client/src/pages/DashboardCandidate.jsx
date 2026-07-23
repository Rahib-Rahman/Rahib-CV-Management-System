import React from "react";
import Profile from "./Profile";
import CVs from "./CVs";
import BadgePanel from "./Badges";

function DashboardCandidate() {
    return (
        <div className="container mt-5">
            <h2>Candidate Dashboard</h2>
            <Profile />
            <CVs />
            <BadgePanel />
        </div>
    );
}

export default DashboardCandidate;
