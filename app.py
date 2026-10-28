
from flask import Flask, request, jsonify
from flask_cors import CORS
import paramiko

from telnet_client import send_telnet_details
from ssh_client import run_ssh_command

app = Flask(__name__)

# Allow your website on port 5100 and port 5500 to access Flask.
CORS(app, origins=[
    "http://127.0.0.1:5100",
    "http://localhost:5100",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
])

# Allow only these demonstration commands through SSH.
ALLOWED_COMMANDS = {"whoami", "hostname"}


@app.route("/")
def home():
    return "TELNET vs SSH backend is running!"


@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({
        "success": True,
        "message": "Website connected to Python successfully!"
    })


@app.route("/api/send", methods=["POST"])
def send_packet():
    data = request.get_json(silent=True) or {}

    protocol = str(data.get("protocol", "")).lower().strip()
    username = data.get("username", "")
    password = data.get("password", "")
    message = data.get("message", "")

    # Validate protocol.
    if protocol not in ("telnet", "ssh"):
        return jsonify({
            "success": False,
            "error": "Choose TELNET or SSH."
        }), 400

    # Validate input types.
    if not all(
        isinstance(value, str)
        for value in (username, password, message)
    ):
        return jsonify({
            "success": False,
            "error": "All fields must be text."
        }), 400

    # Check for missing values.
    if not username.strip() or not password or not message.strip():
        return jsonify({
            "success": False,
            "error": "Enter a username, password, and message or command."
        }), 400

    # Reject newlines in submitted fields.
    if any(
        "\n" in value or "\r" in value
        for value in (username, password, message)
    ):
        return jsonify({
            "success": False,
            "error": "New lines are not allowed in these fields."
        }), 400

    # Limit input sizes.
    if (
        len(username) > 100
        or len(password) > 200
        or len(message) > 200
    ):
        return jsonify({
            "success": False,
            "error": "Input is too long."
        }), 400

    try:
        # ---------------- TELNET ----------------
        if protocol == "telnet":
            result = send_telnet_details(
                username,
                password,
                message
            )

            return jsonify({
                "success": True,
                "protocol": "TELNET",
                "observer": result["observer"],
                "server": result["response"],
                "server_address": result["server"]
            })

        # ---------------- SSH ----------------
        command = message.strip()

        if command not in ALLOWED_COMMANDS:
            return jsonify({
                "success": False,
                "error": "For SSH, enter whoami or hostname as the command."
            }), 400

        result = run_ssh_command(
            username,
            password,
            command
        )

        return jsonify({
            "success": True,
            "protocol": "SSH",
            "observer": (
                "SSH encrypted transport is active.\n"
                "The application message is not shown here as plaintext.\n"
                "This is an explanatory display, not a packet capture."
            ),
            "server": (
                f"Command: {command}\n"
                f"Output:\n{result['output']}\n"
                f"Exit code: {result['exit_code']}"
            ),
            "server_address": result["server"]
        })

    except paramiko.AuthenticationException:
        return jsonify({
            "success": False,
            "error": "SSH authentication failed. Check the SSH username and password."
        }), 401

    except paramiko.SSHException as error:
        return jsonify({
            "success": False,
            "error": f"SSH error: {error}"
        }), 502

    except (ConnectionError, OSError, TimeoutError) as error:
        return jsonify({
            "success": False,
            "error": (
                f"Connection failed: {error}. "
                "Check that the selected server is running."
            )
        }), 502

    except Exception:
        app.logger.exception("Unexpected error in /api/send")
        return jsonify({
            "success": False,
            "error": "An unexpected server error occurred. Check the Flask terminal."
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
