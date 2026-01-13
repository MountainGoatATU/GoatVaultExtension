import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthInitResponse } from "../models/authInitResponse";
import { generateAuthVerifier, login } from "../services/userService";
import type { AuthVerifyResponse } from "../models/authVerifyResponse";

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: 300,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        fontFamily: "system-ui, sans-serif",
    },
    title: {
        textAlign: "center",
        marginBottom: "8px",
    },
    email: {
        textAlign: "center",
        fontSize: "14px",
        marginBottom: "16px",
        color: "#333",
    },
    label: {
        fontSize: "13px",
        marginBottom: "4px",
    },
    input: {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    button: {
        marginTop: "8px",
        padding: "10px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#111",
        color: "#fff",
        cursor: "pointer",
    },
    linkText: {
        marginTop: "10px",
        textAlign: "center",
        fontSize: "13px",
        color: "#1e78d3",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
};

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as
        | { initResponse: AuthInitResponse; rememberMe: boolean }
        | undefined;

    const initResponse = state?.initResponse;
    //const rememberMe = state?.rememberMe ?? false;

    const [password, setPassword] = useState("");

    if (!initResponse) {
        return (
            <div style={styles.container}>
                <span>Something went wrong.</span>
                <button
                    style={styles.button}
                    onClick={() => navigate("/")}
                >
                    Go back
                </button>
            </div>
        );
    }

    const handleLogin = async () => {
        if (!password) return;

        try {
            const authVerifier = await generateAuthVerifier(
                password,
                initResponse.authSalt
            );

            const response: AuthVerifyResponse = await login(initResponse._id, authVerifier);

            if (response) {
                console.log("Login successful:", response);
            } else {
                alert("Email not found or invalid.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
            return;
        }
    };

    const handleSwitchAccount = () => {
        navigate("/");
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>GoatVault</h1>

            {/* User Email */}
            <div style={styles.email}>{initResponse._id}</div>

            {/* Master Password */}
            <label style={styles.label}>Master Password</label>
            <input
                type="password"
                placeholder="Enter your master password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />

            <button
                style={{
                    ...styles.button,
                    opacity: password ? 1 : 0.6,
                    cursor: password ? "pointer" : "not-allowed",
                }}
                onClick={handleLogin}
                disabled={!password}
            >
                Log in
            </button>

            <button
                onClick={handleSwitchAccount}
                style={styles.linkText}
            >
                Login with a different account
            </button>
        </div>
    );
}