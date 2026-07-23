import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "./context/ThemeContext";
import { AuthContext } from "./context/AuthContext";

// Pages
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Positions from "./pages/Positions";
import CVs from "./pages/CVs";
import CVDetail from "./pages/CVDetail";
import AdminPanel from "./pages/AdminPanel";
import MainPage from "./pages/MainPage";
import Discussions from "./pages/Discussions";
import Reminders from "./pages/Reminders";
import AuditLogs from "./pages/AuditLogs";
import Projects from "./pages/Projects";
import Attributes from "./pages/Attributes";
import AttributeLibrary from "./pages/AttributeLibrary";
import Upload from "./pages/Upload";
import Likes from "./pages/Likes";
import Badges from "./pages/Badges";
import Stats from "./pages/Stats";

// Dashboards
import DashboardCandidate from "./pages/DashboardCandidate";
import DashboardRecruiter from "./pages/DashboardRecruiter";
import DashboardAdmin from "./pages/DashboardAdmin";

// Components
import Search from "./components/Search";
import ImageUploader from "./components/ImageUploader";
import ExportCVs from "./components/ExportCVs";

// i18n config
import "./i18n/i18n";

function Navbar() {
    const { user, setUser } = useContext(AuthContext);
    const { i18n, t } = useTranslation();
    const { theme, setTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        alert("You have been logged out.");
        navigate("/auth");
    };

    return (
        <nav
            className={`navbar navbar-expand-lg ${
                theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"
            }`}
        >
            <div className="container">
                <Link className="navbar-brand" to="/">
                    {t("dashboard")}
                </Link>
                <ul className="navbar-nav me-auto">
                    {user?.role === "candidate" && (
                        <>
                            <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/cvs">CVs</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/reminders">Reminders</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/projects">Projects</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/attributes">Attributes</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/attribute-library">Attribute Library</Link></li>
                        </>
                    )}
                    {user?.role === "recruiter" && (
                        <>
                            <li className="nav-item"><Link className="nav-link" to="/positions">Positions</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/discussions">Discussions</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/likes">Likes</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/attribute-library">Attribute Library</Link></li>
                        </>
                    )}
                    {user?.role === "admin" && (
                        <>
                            <li className="nav-item"><Link className="nav-link" to="/admin">Admin Panel</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/audit">Audit Logs</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/upload">Uploads</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/badges">Badges</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/export">Export CVs</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/stats">Stats</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/attribute-library">Attribute Library</Link></li>
                        </>
                    )}
                    {!user && (
                        <li className="nav-item"><Link className="nav-link" to="/auth">Login / Register</Link></li>
                    )}
                </ul>
                <div>
                    <button onClick={() => changeLanguage("en")} className="btn btn-outline-secondary me-2">EN</button>
                    <button onClick={() => changeLanguage("es")} className="btn btn-outline-secondary me-2">ES</button>
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="btn btn-outline-info"
                    >
                        {theme === "light" ? "Dark" : "Light"}
                    </button>
                    {user && (
                        <button onClick={handleLogout} className="btn btn-outline-danger ms-2">Logout</button>
                    )}
                </div>
            </div>
        </nav>
    );
}

function App() {
    const { user } = useContext(AuthContext);

    return (
        <Router>
            <Navbar />
            <Search />
            <Routes>
                <Route
                    path="/"
                    element={
                        user?.role === "candidate" ? (
                            <DashboardCandidate />
                        ) : user?.role === "recruiter" ? (
                            <DashboardRecruiter />
                        ) : user?.role === "admin" ? (
                            <DashboardAdmin />
                        ) : (
                            <MainPage />
                        )
                    }
                />

                <Route path="/auth" element={<Auth />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/cvs" element={<CVs />} />
                <Route path="/cv/:id" element={<CVDetail cvId={1} />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/attributes" element={<Attributes />} />
                <Route path="/attribute-library" element={<AttributeLibrary />} />

                <Route path="/positions" element={<Positions />} />
                <Route path="/discussions" element={<Discussions positionId={1} />} />
                <Route path="/likes" element={<Likes cvId={1} />} />

                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/audit" element={<AuditLogs />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/badges" element={<Badges />} />
                <Route path="/export" element={<ExportCVs positionId={1} />} />
                <Route path="/stats" element={<Stats />} />

                <Route path="/image-uploader" element={<ImageUploader />} />
            </Routes>
        </Router>
    );
}

export default App;
