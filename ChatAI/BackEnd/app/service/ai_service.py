import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise ValueError("❌ Thiếu OPENROUTER_API_KEY trong file .env")

URL = "https://openrouter.ai/api/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost",
    "X-Title": "chat-ai-app"
}


def ask_ai(question: str, retries: int = 3, delay: int = 3):
    payload = {
        "model": "meta-llama/llama-3-8b-instruct",
        "messages": [
            {
                "role": "system",
                "content": (
                    "Bạn là AI thông minh và linh hoạt.\n"
                    "- Luôn trả lời đúng theo yêu cầu của người dùng.\n"
                    "- Trả lời bằng NGÔN NGỮ mà người dùng sử dụng.\n"
                    "- Nếu người dùng dùng tiếng Việt → trả lời tiếng Việt.\n"
                    "- Nếu người dùng dùng tiếng Anh → trả lời tiếng Anh.\n"
                    "- Nếu người dùng yêu cầu ngôn ngữ cụ thể → phải làm theo.\n"
                    "- Không tự ý trộn ngôn ngữ.\n"
                    "- Có thể dùng slang, emoji nếu phù hợp.\n"
                )
            },
            {
                "role": "user",
                "content": question
            }
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }

    for attempt in range(retries):
        try:
            res = requests.post(URL, headers=HEADERS, json=payload, timeout=30)
            res.encoding = "utf-8"

            if res.status_code != 200:
                return {
                    "error": f"HTTP {res.status_code}",
                    "detail": res.text
                }

            data = res.json()

            if "error" in data:
                return {
                    "error": data["error"],
                    "hint": "https://openrouter.ai/"
                }

            choices = data.get("choices", [])
            if choices:
                content = choices[0].get("message", {}).get("content")
                if content:
                    return clean_text(content)

            return "⚠️ Không có nội dung trả về"

        except requests.exceptions.Timeout:
            err = "Timeout (API chậm)"
        except requests.exceptions.RequestException as e:
            err = str(e)

        if attempt < retries - 1:
            print(f"⏳ Retry {attempt + 1}/{retries} sau {delay}s...")
            time.sleep(delay)
        else:
            return {
                "error": err,
                "hint": "Network/API issue"
            }

    return "❌ Retry thất bại"


# ✅ Làm sạch output (tránh ký tự rác)
def clean_text(text: str) -> str:
    return text.strip().replace("\uFFFD", "")