import os
import json
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from service.ai_service import ask_ai

app = Flask(__name__)

# ✅ Fix UTF-8 toàn app
app.config["JSON_AS_ASCII"] = False

# ✅ CORS (có thể giới hạn domain nếu cần)
CORS(app)


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True)

        if not data:
            return error_response("Invalid JSON", 400)

        question = data.get("message", "").strip()

        if not question:
            return error_response("Missing message", 400)

        # ✅ Call AI
        answer = ask_ai(question)

        # ✅ Log sạch
        print("=" * 40)
        print(f"User: {question}")
        print(f"AI: {answer}")

        # ✅ Nếu AI trả lỗi dạng dict
        if isinstance(answer, dict):
            return Response(
                json.dumps(answer, ensure_ascii=False),
                status=500,
                content_type="application/json; charset=utf-8"
            )

        # ✅ Response chuẩn UTF-8
        return Response(
            json.dumps({
                "question": question,
                "answer": answer
            }, ensure_ascii=False),
            status=200,
            content_type="application/json; charset=utf-8"
        )

    except Exception as e:
        print("❌ Server error:", str(e))
        return error_response(str(e), 500)


# ✅ Hàm trả lỗi chuẩn
def error_response(message, status=400):
    return Response(
        json.dumps({"error": message}, ensure_ascii=False),
        status=status,
        content_type="application/json; charset=utf-8"
    )


if __name__ == "__main__":
    # ⚠️ debug=True chỉ dùng dev
    app.run(host="0.0.0.0", port=5000, debug=True)