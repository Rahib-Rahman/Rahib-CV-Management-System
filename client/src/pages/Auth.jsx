import React, { useState, useContext, useEffect } from "react";
import { register, login } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function Auth() {
    const { setUser } = useContext(AuthContext);
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get("error");
        if (error === "blocked") {
            alert("Your account is blocked. Please contact admin.");
        }
    }, [location]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleRegister = async () => {
        try {
            await register(form);
            alert("Registration successful! Please login.");
            setIsRegister(false);
        } catch (err) {
            console.error("Registration failed:", err);
            alert(err.response?.data?.error || "Registration failed");
        }
    };
    const handleLogin = async () => {
        try {
            const res = await login({ email: form.email, password: form.password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            alert("Login successful!");
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
            if (err.response?.status === 403) {
                alert("Your account is blocked. Please contact admin.");
            } else {
                alert(err.response?.data?.error || "Login failed");
            }
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "https://rahib-cv-management-system.onrender.com/api/auth/google";
    };

    const handleFacebookLogin = () => {
        window.location.href = "https://rahib-cv-management-system.onrender.com/api/auth/facebook";
    };

    return (
        <div className="container mt-5">
            <h2>{isRegister ? "Register" : "Login"}</h2>

            {isRegister && (
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control mt-2"
                    value={form.name}
                    onChange={handleChange}
                />
            )}

            <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control mt-2"
                value={form.email}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control mt-2"
                value={form.password}
                onChange={handleChange}
            />

            {isRegister && (
                <select
                    name="role"
                    className="form-select mt-2"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="candidate">Candidate</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="admin">Admin</option>
                </select>
            )}

            <button
                onClick={isRegister ? handleRegister : handleLogin}
                className="btn btn-primary mt-3"
            >
                {isRegister ? "Register" : "Login"}
            </button>

            <button
                onClick={() => setIsRegister(!isRegister)}
                className="btn btn-link mt-2"
            >
                {isRegister ? "Already have an account? Login" : "New user? Register"}
            </button>

            {!isRegister && (
                <div className="mt-4">
                    <h5>Or login with:</h5>
                    <button className="btn btn-danger mt-2" onClick={handleGoogleLogin}>
                        Login with Google
                    </button>
                    <button className="btn btn-primary mt-2" onClick={handleFacebookLogin}>
                        Login with Facebook
                    </button>
                </div>
            )}
        </div>
    );
}

export default Auth;
