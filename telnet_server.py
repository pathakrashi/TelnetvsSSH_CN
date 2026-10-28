import socket

HOST = "127.0.0.1"
PORT = 2323


def handle_client(conn, address):
    print(f"\nClient connected: {address}")
    reader = conn.makefile("r", encoding="utf-8")

    fields = [
        ("Username", "Enter your name: "),
        ("Test password", "Enter a TEST password: "),
        ("Message", "Enter a message: ")
    ]

    for label, prompt in fields:
        conn.sendall((prompt + "\n").encode("utf-8"))

        data = reader.readline()
        if not data:
            print("Client disconnected.")
            return

        value = data.rstrip("\r\n")
        print(f"Received {label} in PLAINTEXT: {value}")

    conn.sendall(
        b"TELNET server received all details successfully!\n"
    )
    print("Request completed.")


def start_server():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
            server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server.bind((HOST, PORT))
            server.listen()

            print("=" * 40)
            print("       TELNET SERVER DEMO")
            print("=" * 40)
            print(f"Listening on {HOST}:{PORT}")
            print("Waiting for clients...")

            while True:
                conn, address = server.accept()
                with conn:
                    try:
                        handle_client(conn, address)
                    except (OSError, UnicodeError) as error:
                        print("Client communication error:", error)

    except OSError as error:
        print("Server error:", error)
        print("Check whether port 2323 is already in use.")


if __name__ == "__main__":
    start_server()
