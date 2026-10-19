
import paramiko
import msvcrt

HOST = "127.0.0.1"
PORT = 22


def get_password():
    print("Enter Windows password: ", end="", flush=True)
    password = ""

    while True:
        char = msvcrt.getwch()

        if char == "\r":
            print()
            break

        elif char == "\b":
            if password:
                password = password[:-1]

        elif char in ("\x00", "\xe0"):
            msvcrt.getwch()

        else:
            password += char

    return password


def start_ssh_client():
    print("=" * 45)
    print("          SSH CLIENT DEMO")
    print("=" * 45)

    username = input("Enter Windows username: ")
    password = get_password()

    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.RejectPolicy())

    try:
        client.connect(
            hostname=HOST,
            port=PORT,
            username=username,
            password=password,
            timeout=10,
            look_for_keys=False,
            allow_agent=False
        )

        print("\nSSH Connection Established!")
        print("Security Status: SSH encrypted channel")
        print("Username:", username)
        print("Password:", "*" * len(password))
        print(f"Server: {HOST}:{PORT}")

        command = input(
            "\nEnter command (example: whoami): "
        )

        stdin, stdout, stderr = client.exec_command(
            command,
            timeout=15
        )

        output = stdout.read().decode(
            "utf-8", errors="replace"
        )

        error = stderr.read().decode(
            "utf-8", errors="replace"
        )

        exit_code = stdout.channel.recv_exit_status()

        if output:
            print("\nServer Response:")
            print(output)

        if error:
            print("\nCommand Error:")
            print(error)

        print(f"Command Exit Code: {exit_code}")

    except paramiko.AuthenticationException:
        print("ERROR: Authentication failed.")

    except paramiko.SSHException as error:
        print(f"SSH Error: {error}")

    except (OSError, TimeoutError) as error:
        print(f"Connection Error: {error}")

    finally:
        client.close()
        print("\nSSH connection closed.")


if __name__ == "__main__":
    start_ssh_client()
