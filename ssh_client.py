import paramiko

HOST = "127.0.0.1"
PORT = 22


def run_ssh_command(username, password, command):
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

        stdin, stdout, stderr = client.exec_command(
            command,
            timeout=15
        )

        output = stdout.read().decode("utf-8", errors="replace")
        error = stderr.read().decode("utf-8", errors="replace")
        exit_code = stdout.channel.recv_exit_status()

        return {
            "server": f"{HOST}:{PORT}",
            "output": output,
            "error": error,
            "exit_code": exit_code
        }

    finally:
        client.close()


def start_ssh_client():
    print("=" * 45)
    print("          SSH CLIENT DEMO")
    print("=" * 45)

    username = input("Enter Windows username: ")
    import getpass
    password = getpass.getpass("Enter Windows password: ")
    command = input("Enter command (whoami or hostname): ").strip()

    if command not in ("whoami", "hostname"):
        print("For this demo, use whoami or hostname.")
        return

    try:
        result = run_ssh_command(username, password, command)
        print("\nSSH connection successful.")
        print("Server:", result["server"])
        print("Command output:", result["output"])
        if result["error"]:
            print("Command error:", result["error"])
        print("Exit code:", result["exit_code"])

    except paramiko.AuthenticationException:
        print("ERROR: Authentication failed.")
    except (paramiko.SSHException, OSError, TimeoutError) as error:
        print("SSH error:", error)


if __name__ == "__main__":
    start_ssh_client()
