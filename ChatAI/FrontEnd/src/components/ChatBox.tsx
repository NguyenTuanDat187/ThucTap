import { useState, useEffect, useRef, type CSSProperties } from "react";
import useChat from "../hooks/useChat";
import Message from "./Message";

export default function ChatBox() {
    const { messages, sendMessage, loading, clearChat } = useChat();
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false); // Trạng thái nhấp chuột vào ô nhập

    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 1. Tự động cuộn xuống khi có tin nhắn mới hoặc đang loading
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, loading]);

    // 2. Tự động giãn chiều cao ô nhập (tối đa 200px)
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setInput("");
        await sendMessage(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={styles.statusDot} />
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, }}>CHAT BOT </h3>
                </div>
                <button onClick={clearChat} style={styles.resetBtn}>Xóa hội thoại</button>
            </div>

            {/* Danh sách tin nhắn */}
            <div ref={scrollRef} style={styles.chatBox}>
                {messages.length === 0 && (
                    <div style={styles.emptyContainer}>
                        <span style={{ fontSize: "3rem" }}>✨</span>
                        <p style={styles.emptyText}>Tôi có thể giúp gì cho bạn hôm nay?</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        width: "100%"
                    }}>
                        <Message role={msg.role} content={msg.content} />
                    </div>
                ))}

                {loading && (
                    <div style={styles.loadingWrapper}>
                        <span style={styles.loadingText}>AI đang suy nghĩ...</span>
                    </div>
                )}
            </div>

            {/* Vùng nhập liệu */}
            <div style={styles.inputArea}>
                <div
                    style={{
                        ...styles.inputWrapper,
                        backgroundColor: isFocused ? "#fff" : "#f4f4f4",
                        borderColor: isFocused ? "#1677ff" : "#e5e5e5",
                        boxShadow: isFocused ? "0 0 0 3px rgba(22, 119, 255, 0.1)" : "none",
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        style={styles.input}
                        rows={1}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        style={{
                            ...styles.sendBtn,
                            backgroundColor: input.trim() ? "#1677ff" : "#d9d9d9",
                            cursor: input.trim() ? "pointer" : "not-allowed"
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
                <p style={styles.footerNote}>Nhấn Enter để gửi, Shift + Enter để xuống dòng</p>
            </div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        maxWidth: "850px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: "95vh",
        background: "#fff",
        fontFamily: "'Inter', sans-serif",
        border: "1px solid #eee",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
    },
    header: {
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
        background: "#fff",
    },
    statusDot: {
        width: "10px",
        height: "10px",
        backgroundColor: "#52c41a",
        borderRadius: "50%",
    },
    resetBtn: {
        background: "none",
        border: "1px solid #ddd",
        padding: "6px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        cursor: "pointer",
        color: "#666",
        transition: "all 0.2s",
    },
    chatBox: {
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        backgroundColor: "#fff",
    },
    emptyContainer: {
        margin: "auto",
        textAlign: "center",
        opacity: 0.4,
    },
    emptyText: {
        marginTop: "12px",
        fontSize: "1rem",
    },
    loadingWrapper: {
        padding: "10px 16px",
        background: "#f9f9f9",
        borderRadius: "12px",
        width: "fit-content",
        border: "1px solid #f0f0f0",
    },
    loadingText: {
        fontSize: "13px",
        color: "#8c8c8c",
        fontStyle: "italic",
    },
    inputArea: {
        padding: "16px 24px 24px",
        borderTop: "1px solid #f0f0f0",
        background: "#fff",
    },
    inputWrapper: {
        display: "flex",
        alignItems: "flex-end",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "14px",
        border: "1px solid #e5e5e5",
        transition: "all 0.25s ease",
    },
    input: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "16px",
        lineHeight: "1.5",
        padding: "2px 0",
        resize: "none",
        maxHeight: "200px",
        fontFamily: "inherit",
        color: "#000000", // Chữ đen đậm rõ nét
        caretColor: "#1677ff", // Màu con trỏ nhấp nháy
    },
    sendBtn: {
        border: "none",
        width: "34px",
        height: "34px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        flexShrink: 0,
    },
    footerNote: {
        fontSize: "11px",
        color: "#bfbfbf",
        textAlign: "center",
        marginTop: "10px",
    }
};