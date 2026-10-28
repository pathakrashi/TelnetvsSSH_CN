import getpass
import time


def run_ssh_simulation():
    print("=" * 45)
    print("       SSH SECURITY DEMONSTRATION")
    print("            SIMULATION MODE")
    print("=" * 45)

    username = input("Enter demo username: ")
    password = getpass.getpass("Enter demo password: ")

    print("\n" + "=" * 45)
    print("       SSH SIMULATION RESULTS")
    print("=" * 45)

    print("Username:", username)
    print("Password:", "*" * len(password))
    print("Mode: Simulation Only")

    print("\nSimulating SSH security steps...")

    steps = [
        "Preparing demo credentials",
        "Simulating encrypted communication",
        "Simulating secure response"
    ]

    for step in steps:
        print("[SIMULATION]", step)
        time.sleep(0.5)

    print("\nSimulation completed successfully.")
    print("Note: No real SSH connection was established.")


if __name__ == "__main__":
    run_ssh_simulation()
