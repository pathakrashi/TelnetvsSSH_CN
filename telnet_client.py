import socket

HOST = "127.0.0.1"
PORT = 2323


def send_telnet_details(username, password, message):
    values = [username, password, message]

    with socket.create_connection((HOST, PORT), timeout=10) as client:
        client.settimeout(10)
        reader = client.makefile("r", encoding="utf-8")

        for value in values:
            prompt = reader.readline()

            if not prompt:
                raise ConnectionError(
                    "TELNET server disconnected before receiving all fields."
                )

            client.sendall((value + "\n").encode("utf-8"))

        response = reader.readline().strip()

        return {
            "server": f"{HOST}:{PORT}",
            "response": response,
            "observer": (
                f"Plaintext observed:\n"
                f"Username: {username}\n"
                f"Password: {password}\n"
                f"Message: {message}"
            )
        }


def start_client():
    print("=" * 40)
    print("       TELNET CLIENT DEMO")
    print("=" * 40)

    username = input("Enter your name: ")
    password = input("Enter a TEST password: ")
    message = input("Enter a message: ")

    try:
        result = send_telnet_details(username, password, message)
        print("\nServer response:", result["response"])

    except (ConnectionError, OSError, TimeoutError) as error:
        print("TELNET error:", error)
        print("Start telnet_server.py first.")


if __name__ == "__main__":
    start_client()
