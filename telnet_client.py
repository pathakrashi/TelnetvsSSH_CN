
import socket

HOST = "127.0.0.1"
PORT = 5000


def start_client():
    print("=" * 40)
    print("       TELNET CLIENT DEMO")
    print("=" * 40)

    try:
        with socket.create_connection((HOST, PORT), timeout=10) as client:
            # Restore blocking mode after connection
            client.settimeout(None)

            reader = client.makefile("r", encoding="utf-8")

            for _ in range(3):
                prompt = reader.readline()

                if not prompt:
                    print("Server disconnected unexpectedly.")
                    return

                print(prompt, end="", flush=True)

                value = input()
                client.sendall((value + "\n").encode("utf-8"))

            response = reader.readline()

            if response:
                print(response, end="")

            print("Connection closed.")

    except ConnectionRefusedError:
        print("ERROR: The server is not running.")
        print("Start telnet_server.py in Terminal 1 first.")

    except (TimeoutError, OSError) as error:
        print(f"Connection error: {error}")
        print("Check the server address and port.")


if __name__ == "__main__":
    start_client()
