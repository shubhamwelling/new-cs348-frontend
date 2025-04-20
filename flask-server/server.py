from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "<h1> This is the Flask Backend API"


@app.route("/api/response")
def fetch_response():
    response = {
        "message": "Flask backend says hello!",
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)