import { useState, useCallback } from "react";

// 1. Định nghĩa kiểu dữ liệu ngay trong file nếu project nhỏ
export interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const sendMessage = useCallback(async (text: string) => {
        const messageText = text.trim();
        if (!messageText || loading) return;

        // Hiển thị tin nhắn của User ngay lập tức
        const newUserMsg: Message = { role: "user", content: messageText };
        setMessages((prev) => [...prev, newUserMsg]);

        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Server đang bận");
            }

            // Cập nhật tin nhắn từ AI vào danh sách
            const aiResponse: Message = {
                role: "assistant",
                content: data.answer
            };

            setMessages((prev) => [...prev, aiResponse]);

        } catch (err) {
            // Xử lý lỗi hiển thị trực tiếp lên khung chat cho thân thiện
            const errorMsg: Message = {
                role: "assistant",
                content: `❌ Lỗi: ${err instanceof Error ? err.message : "Mất kết nối server"}`
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    // Hàm xóa sạch hội thoại (vì không có DB nên chỉ cần set lại mảng rỗng)
    const clearChat = () => setMessages([]);

    return { messages, sendMessage, loading, clearChat };
}