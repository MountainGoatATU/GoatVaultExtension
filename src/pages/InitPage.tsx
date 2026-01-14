import { useState } from "react";
import { verifyEmail } from "../services/userService";
import type { AuthInitResponse } from "../models/authInitResponse";
import { useNavigate } from "react-router-dom";

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
    input: {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    checkboxContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
    },
    checkboxLabel: {
        userSelect: "none",
    },
    button: {
        marginTop: "4px",
        padding: "10px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#111",
        color: "#fff",
    },
    createAccount: {
        marginTop: "10px",
        textAlign: "center",
        fontSize: "13px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    linkButton: {
        background: "none",
        border: "none",
        color: "#1e78d3",
        cursor: "pointer",
        padding: 0,
        fontSize: "13px",
    },
};

type InitPageProps = {
    setInitResponse: (data: AuthInitResponse) => void;
};


export default function InitPage({ setInitResponse }: InitPageProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleNext = async () => {
        if (!email) return;

        try {
            const response: AuthInitResponse | null = await verifyEmail(email);

            if (response) {
                // Navigate to login page and pass state
                setInitResponse(response);
                navigate("/login", { state: { response, rememberMe } });
            } else {
                alert("Email not found or invalid.");
            }
        } catch (err: any) {
            console.error("Error verifying email:", err);
            alert(`Something went wrong: ${err?.message || err}`);
        }
    };


    const handleCreateAccount = () => {
        navigate("/register");
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>GoatVault</h1>

            <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />

            <label style={styles.checkboxContainer}>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span style={styles.checkboxLabel}>Remember me</span>
            </label>

            <button
                onClick={handleNext}
                style={{
                    ...styles.button,
                    opacity: email ? 1 : 0.6,
                    cursor: email ? "pointer" : "not-allowed",
                }}
                disabled={!email}
            >
                Next
            </button>

            <div style={styles.createAccount}>
                <span>Don’t have an account?</span>
                <button
                    onClick={handleCreateAccount}
                    style={styles.linkButton}
                >
                    Create an Account
                </button>
            </div>
        </div>
    );
}
