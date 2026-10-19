
import socket

HOST = "127.0.0.1"
PORT = 5000


def start_server():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
            server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server.bind((HOST, PORT))
            server.listen(1)

            print("=" * 40)
            print("       TELNET SERVER DEMO")
            print("=" * 40)
            print(f"Server address: {HOST}:{PORT}")
            print("Waiting for client...\n")

            conn, address = server.accept()

            with conn:
                print(f"Client connected: {address}")
                reader = conn.makefile("r", encoding="utf-8")

                fields = [
                    ("Name", "Enter your name: "),
                    ("Test password", "Enter a TEST password: "),
                    ("Message", "Enter a message: "),
                ]

                for label, prompt in fields:
                    # Newline makes the prompt readable by readline()
                    conn.sendall((prompt + "\n").encode("utf-8"))

                    data = reader.readline()

                    if not data:
                        print("Client disconnected.")
                        return

                    value = data.rstrip("\r\n")
                    print(f"Received {label} in PLAINTEXT: {value}")

                conn.sendall(
                    b"Server received all details successfully!\n"
                )
                print("\nDemo completed successfully.")

    except OSError as error:
        print(f"Server error: {error}")
        print("Check whether another program is using port 5000.")


if __name__ == "__main__":
    start_server()
