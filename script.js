
const modules = {
    server: {
        title: "TELNET Server",
        description:
            "Configure the demonstration server. The default host is 127.0.0.1 and the demonstration port is 5000.",
        steps: [
            "Open a terminal in your project folder.",
            "Run: python telnet_server.py",
            "Keep the server terminal running.",
            "Open the TELNET Client module to enter connection details."
        ],
        output: [
            "Module: TELNET Server",
            "Default host: 127.0.0.1",
            "Default demonstration port: 5000",
            "Status: Configure the server in the form."
        ]
    },

    client: {
        title: "TELNET Client",
        description:
            "Enter the server address and demo credentials. This form validates inputs but does not yet send them to the Python server.",
        steps: [
            "Start your Python TELNET server first.",
            "Enter the server host and port.",
            "Enter a demo username, password and message.",
            "For real communication, run your Python TELNET client."
        ],
        output: [
            "Module: TELNET Client",
            "Protocol: TCP demonstration",
            "Default host: 127.0.0.1",
            "Status: Waiting for input."
        ]
    },

    ssh: {
        title: "SSH Client",
        description:
            "Enter the hostname, SSH port and login information. Actual SSH authentication must be handled by your Python SSH client.",
        steps: [
            "Make sure an SSH server is running and reachable.",
            "Install Paramiko if required: python -m pip install paramiko",
            "Enter the SSH server host, port and username.",
            "Run your Python SSH client to establish the real connection."
        ],
        output: [
            "Module: SSH Client",
            "Default host: 127.0.0.1",
            "Default port: 22",
            "Status: A real SSH connection is not started by this webpage."
        ]
    },

    simulation: {
        title: "SSH Security Simulation",
        description:
            "Enter a demo username and password to see a simulated secure-login message. This does not contact an SSH server.",
        steps: [
            "Enter a demonstration username.",
            "Enter a demo password.",
            "Click Run Simulation.",
            "Discuss why SSH encrypts communication."
        ],
        output: [
            "Module: SSH Security Simulation",
            "Password field: Masked",
            "Purpose: Demonstrate secure-login concepts",
            "Mode: Frontend simulation only."
        ]
    }
};

function displayTerminal(lines) {
    const terminal = document.getElementById("terminal-output");
    terminal.replaceChildren();

    lines.forEach(function(line, index) {
        const paragraph = document.createElement("p");
        paragraph.textContent = "> " + line;
        paragraph.className =
            index === 0 ? "terminal-green" : "terminal-muted";

        terminal.appendChild(paragraph);
    });
}

function showModule(moduleName) {
    const module = modules[moduleName];

    if (!module) {
        return;
    }

    document.getElementById("module-title").textContent = module.title;
    document.getElementById("module-description").textContent =
        module.description;

    const stepsList = document.getElementById("module-steps");
    stepsList.replaceChildren();

    module.steps.forEach(function(step) {
        const item = document.createElement("li");
        item.textContent = step;
        stepsList.appendChild(item);
    });

    displayTerminal(module.output);
    renderModuleForm(moduleName);

    document.getElementById("demo").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderModuleForm(moduleName) {
    const container = document.getElementById("module-form");

    const forms = {
        server: `
            <div class="module-form-box">
                <h3>TELNET Server Settings</h3>

                <form id="server-form">
                    <label for="server-host">Server Host</label>
                    <input id="server-host" value="127.0.0.1"
                           required>

                    <label for="server-port">Port</label>
                    <input id="server-port" type="number"
                           value="5000" min="1" max="65535" required>

                    <button type="submit">Check Settings</button>
                    <button type="button" class="stop-btn"
                            id="stop-server">Reset Form</button>
                </form>

                <p class="form-status" id="form-status"
                   aria-live="polite"></p>
                <p class="form-note">
                    This form does not start a real server.
                    Run your Python server script separately.
                </p>
            </div>
        `,

        client: `
            <div class="module-form-box">
                <h3>TELNET Client Connection</h3>

                <form id="telnet-form">
                    <label for="telnet-host">Server Host</label>
                    <input id="telnet-host" value="127.0.0.1"
                           required>

                    <label for="telnet-port">Port</label>
                    <input id="telnet-port" type="number"
                           value="5000" min="1" max="65535" required>

                    <label for="telnet-user">Username</label>
                    <input id="telnet-user" autocomplete="off"
                           required>

                    <label for="telnet-password">Demo Password</label>
                    <input id="telnet-password" type="password"
                           autocomplete="off" required>

                    <label for="telnet-message">Message</label>
                    <textarea id="telnet-message" rows="3"
                              required></textarea>

                    <button type="submit">Validate Inputs</button>
                </form>

                <p class="form-status" id="form-status"
                   aria-live="polite"></p>
                <p class="form-note">
                    Use fake credentials only. This form does not
                    transmit information or connect to the server.
                </p>
            </div>
        `,

        ssh: `
            <div class="module-form-box">
                <h3>SSH Client Connection</h3>

                <form id="ssh-form">
                    <label for="ssh-host">SSH Server Host</label>
                    <input id="ssh-host" value="127.0.0.1"
                           required>

                    <label for="ssh-port">SSH Port</label>
                    <input id="ssh-port" type="number"
                           value="22" min="1" max="65535" required>

                    <label for="ssh-user">Username</label>
                    <input id="ssh-user" autocomplete="off"
                           required>

                    <label for="ssh-password">Demo Password</label>
                    <input id="ssh-password" type="password"
                           autocomplete="off" required>

                    <button type="submit">Validate Inputs</button>
                </form>

                <p class="form-status" id="form-status"
                   aria-live="polite"></p>
                <p class="form-note">
                    Actual SSH authentication must be implemented
                    by your Python SSH client.
                </p>
            </div>
        `,

        simulation: `
            <div class="module-form-box">
                <h3>SSH Security Simulation</h3>

                <form id="simulation-form">
                    <label for="sim-user">Demo Username</label>
                    <input id="sim-user" autocomplete="off" required>

                    <label for="sim-password">Demo Password</label>
                    <input id="sim-password" type="password"
                           autocomplete="off" required>

                    <button type="submit">Run Simulation</button>
                </form>

                <p class="form-status" id="form-status"
                   aria-live="polite"></p>
                <p class="form-note">
                    This is a local simulation, not real SSH
                    authentication.
                </p>
            </div>
        `
    };

    container.innerHTML = forms[moduleName] || "";

    const status = document.getElementById("form-status");

    if (moduleName === "server") {
        document.getElementById("server-form").addEventListener(
            "submit", function(event) {
                event.preventDefault();

                const host = document.getElementById("server-host")
                    .value.trim();
                const port = Number(
                    document.getElementById("server-port").value
                );

                if (!host || !Number.isInteger(port) ||
                    port < 1 || port > 65535) {
                    status.textContent = "Enter a valid host and port.";
                    return;
                }

                status.textContent =
                    "Settings valid for " + host + ":" + port +
                    ". Start the Python server separately.";
            }
        );

        document.getElementById("stop-server").addEventListener(
            "click", function() {
                document.getElementById("server-form").reset();
                status.textContent =
                    "Form reset. No real server was started or stopped.";
            }
        );
    }

    const formIds = {
        client: "telnet-form",
        ssh: "ssh-form",
        simulation: "simulation-form"
    };

    const form = formIds[moduleName]
        ? document.getElementById(formIds[moduleName])
        : null;

    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (moduleName === "client") {
                status.textContent =
                    "Inputs validated. Run your Python TELNET client " +
                    "to send data to the running server.";
            } else if (moduleName === "ssh") {
                status.textContent =
                    "Inputs validated. Run your Python SSH client " +
                    "to establish an encrypted connection.";
            } else {
                status.textContent =
                    "Simulation complete. The password was masked " +
                    "during entry. No real SSH authentication occurred.";
            }

            // Do not retain demo passwords after submission.
            form.querySelectorAll('input[type="password"]')
                .forEach(function(input) {
                    input.value = "";
                });
        });
    }
}

function showRunGuide() {
    document.getElementById("module-form").replaceChildren();

    document.getElementById("module-title").textContent =
        "Run the Project";

    document.getElementById("module-description").textContent =
        "Use your existing Python launcher and module scripts " +
        "to run the actual network demonstrations.";

    const steps = [
        "Open your project folder in a terminal.",
        "Check the actual Python filenames in your folder.",
        "Run the relevant server before starting its client.",
        "For SSH, ensure an SSH server is running and accessible."
    ];

    const stepsList = document.getElementById("module-steps");
    stepsList.replaceChildren();

    steps.forEach(function(step) {
        const item = document.createElement("li");
        item.textContent = step;
        stepsList.appendChild(item);
    });

    displayTerminal([
        "Run Guide",
        "The webpage provides module forms and instructions.",
        "Python scripts handle actual network communication.",
        "Use the filenames that exist in your project folder."
    ]);

    document.getElementById("demo").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
