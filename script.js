
const API_URL = "http://127.0.0.1:5000/api/send";

// =====================================================
// TELNET DEMO — REAL BACKEND CONNECTION
// =====================================================

const telButton = document.getElementById("tel-btn");

if (telButton) {
    telButton.addEventListener("click", async () => {
        const username = document.getElementById("tel-user").value.trim();
        const password = document.getElementById("tel-pass").value;
        const output = document.getElementById("tel-output");

        if (!username || !password) {
            output.textContent = "Please enter your username and password.";
            return;
        }

        telButton.disabled = true;
        output.textContent = "Connecting to TELNET server...";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    protocol: "telnet",
                    username: username,
                    password: password,
                    message: "Hello from the TELNET demo"
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "TELNET request failed.");
            }

            output.textContent =
                "TELNET CLIENT — REAL CONNECTION\n" +
                "Transport: Unencrypted (Plaintext)\n\n" +
                "Username: " + username + "\n" +
                "Password: " + password + "\n\n" +
                "Observer can potentially read the transmitted data.\n\n" +
                "Server response:\n" +
                (result.server || "No server output.");

        } catch (error) {
            output.textContent =
                "TELNET connection failed:\n" + error.message;
        } finally {
            telButton.disabled = false;
        }
    });
}


// =====================================================
// SSH DEMO — REAL BACKEND CONNECTION
// =====================================================

const sshButton = document.getElementById("ssh-btn");

if (sshButton) {
    sshButton.addEventListener("click", async () => {
        const username = document.getElementById("ssh-user").value.trim();
        const password = document.getElementById("ssh-pass").value;
        const output = document.getElementById("ssh-output");

        if (!username || !password) {
            output.textContent =
                "Please enter your Windows SSH username and password.";
            return;
        }

        sshButton.disabled = true;
        output.textContent = "Connecting to SSH server...";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    protocol: "ssh",
                    username: username,
                    password: password,
                    message: "whoami"
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "SSH request failed.");
            }

            const maskedPassword = "*".repeat(password.length);

            output.textContent =
                "SSH CLIENT — REAL CONNECTION\n" +
                "Transport: SSH encrypted connection\n\n" +
                "Application data is protected in transit by SSH.\n\n" +
                "Authentication: Successful\n" +
                "Username: " + username + "\n" +
                "Password: " + maskedPassword + "\n\n" +
                "Server response:\n" +
                (result.server || "No server output.");

        } catch (error) {
            output.textContent =
                "SSH connection failed:\n" + error.message;
        } finally {
            sshButton.disabled = false;
        }
    });
}


// =====================================================
// PACKET SECURITY LAB — REAL PYTHON BACKEND
// =====================================================

const protocolInput = document.getElementById("packet-protocol");
const usernameInput = document.getElementById("packet-username");
const passwordInput = document.getElementById("packet-password");
const messageInput = document.getElementById("packet-message");
const messageLabel = document.getElementById("packet-message-label");
const sendButton = document.getElementById("send-packet-btn");

const channelLabel = document.getElementById("channel-label");
const packetFlow = document.getElementById("packet-flow");
const observerStatus = document.getElementById("observer-status");
const observerOutput = document.getElementById("observer-output");
const serverStatus = document.getElementById("server-status");
const serverOutput = document.getElementById("server-output");


function updateProtocolDisplay() {
    if (!protocolInput || !messageLabel || !messageInput || !channelLabel) {
        return;
    }

    const protocol = protocolInput.value;

    if (protocol === "ssh") {
        messageLabel.textContent = "Command to run (whoami or hostname)";
        messageInput.value = "whoami";
        messageInput.placeholder = "whoami or hostname";
        channelLabel.textContent = "SSH encrypted transport";
    } else {
        messageLabel.textContent = "Message to send";
        messageInput.value = "Hello from the website";
        messageInput.placeholder = "Enter a message";
        channelLabel.textContent = "Plaintext channel";
    }

    if (packetFlow) {
        packetFlow.classList.toggle("is-telnet", protocol === "telnet");
        packetFlow.classList.toggle("is-ssh", protocol === "ssh");
    }
}


if (protocolInput) {
    protocolInput.addEventListener("change", updateProtocolDisplay);
    updateProtocolDisplay();
}


if (
    sendButton &&
    protocolInput &&
    usernameInput &&
    passwordInput &&
    messageInput &&
    observerStatus &&
    observerOutput &&
    serverStatus &&
    serverOutput
) {
    sendButton.addEventListener("click", async () => {
        const protocol = protocolInput.value;
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const message = messageInput.value.trim();

        if (!username || !password || !message) {
            observerStatus.textContent = "Missing information";
            observerOutput.textContent =
                "Enter a username, password, and message or command.";
            return;
        }

        sendButton.disabled = true;
        sendButton.textContent = "Connecting...";
        observerStatus.textContent = "Connecting to Python backend...";
        observerOutput.textContent = "Waiting for response...";
        serverStatus.textContent = "Waiting for server...";
        serverOutput.textContent = "No response yet.";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    protocol: protocol,
                    username: username,
                    password: password,
                    message: message
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Request failed.");
            }

            observerStatus.textContent =
                protocol === "telnet"
                    ? "Plaintext information"
                    : "SSH encrypted transport";

            observerOutput.textContent =
                result.observer ||
                (
                    protocol === "telnet"
                        ? "TELNET does not encrypt transmitted data."
                        : "SSH encrypts application data in transit."
                );

            serverStatus.textContent =
                "Response from " + (result.server_address || "server");

            // Show plaintext credentials for TELNET.
            // Mask the password for SSH.
            const displayedPassword =
                protocol === "telnet"
                    ? password
                    : "*".repeat(password.length);

            serverOutput.textContent =
                "Username: " + username + "\n" +
                "Password: " + displayedPassword + "\n\n" +
                (result.server || "No server output.");

        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : String(error);

            observerStatus.textContent = "Connection failed";
            observerOutput.textContent =
                "Connection error: " + errorMessage +
                "\n\nMake sure Flask is running:\npython app.py";

            serverStatus.textContent = "No response";
            serverOutput.textContent =
                "Could not contact the Python backend.";

        } finally {
            sendButton.disabled = false;
            sendButton.textContent = "Send Packet";
        }
    });
}
