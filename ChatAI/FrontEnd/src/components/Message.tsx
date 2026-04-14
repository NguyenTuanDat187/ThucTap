
export default function Message({
    role,
    content,
}: {
    role: string;
    content: string;
}) {
    const isUser = role === "user";

    return (
        <div
            style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                gap: "10px",
                alignItems: "flex-end",
                marginBottom: "8px",
                width: "100%",
            }}
        >
            {/* Avatar AI */}
            {!isUser && (
                <div style={{ ...styles.avatar, background: "#e6f4ff" }}>
                    🤖
                </div>
            )}

            {/* Bong bóng chat */}
            <div
                style={{
                    ...styles.bubble,
                    ...(isUser ? styles.user : styles.ai),
                }}
            >
                {content}
            </div>

            {/* Avatar Người dùng */}
            {isUser && (
                <div style={{ ...styles.avatar, background: "#f0f0f0" }}>
                    😎
                </div>
            )}
        </div>
    );
}

const styles = {
    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        flexShrink: 0,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    bubble: {
        maxWidth: "70%",
        padding: "12px 16px",
        fontSize: "15px",
        lineHeight: "1.6",
        whiteSpace: "pre-wrap" as const,
        wordBreak: "break-word" as const,
        position: "relative" as const,
        transition: "all 0.2s ease",
    },
    user: {
        background: "linear-gradient(135deg, #1677ff 0%, #0050b3 100%)",
        color: "#fff",
        borderRadius: "18px 18px 4px 18px",
        boxShadow: "0 4px 12px rgba(22, 119, 255, 0.15)",
    },
    ai: {
        background: "#ffffff",
        color: "#1f1f1f",
        border: "1px solid #f0f0f0",
        borderRadius: "18px 18px 18px 4px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
    },
};