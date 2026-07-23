import React from "react";
import Positions from "./Positions";
import Discussions from "./Discussions";

function DashboardRecruiter() {
    return (
        <div className="container mt-5">
            <h2>Recruiter Dashboard</h2>
            <Positions />
            <Discussions positionId={1} />
        </div>
    );
}

export default DashboardRecruiter;
