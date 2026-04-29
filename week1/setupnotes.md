# Week 1 – Setup Notes

These notes document my development environment for ROS 2 Jazzy on Ubuntu, including OS details, installation steps, workspace setup, and shell configuration. This will be my reference point for future ROS 2 work.

---

## 1. Environment Overview

- **Host OS:** Windows 11
- **Guest OS:** Ubuntu 24.04 LTS (running in a virtual machine)  
- **VM Platform:** VMware
- **RAM allocated to VM:** 4GB
- **Disk allocated to VM:** 60 GB

I am running ROS 2 Jazzy inside this Ubuntu 24.04 VM to match the recommended environment for current ROS 2 distributions.

---

## 2. Ubuntu 24.04 Confirmation

I verified the Ubuntu version with:

```bash
lsb_release -a
```

Output (shortened):

```text
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 24.04.4 LTS
Release:	24.04
Codename:	noble
```

This confirms that the system is running Ubuntu 24.04 LTS.

---

## 3. ROS 2 Jazzy Installation

I followed the official ROS 2 installation steps for **ROS 2 Jazzy Jalisco** on Ubuntu 24.04.

### 3.1. Set up locale

```bash
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

### 3.2. Add ROS 2 apt repository

```bash
sudo apt install software-properties-common
sudo add-apt-repository universe

sudo apt update && sudo apt install curl
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key \
  -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] \
https://raw.githubusercontent.com/ros/rosdistro/master/ros2-linux/ noble main" | \
sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

### 3.3. Install ROS 2 Jazzy (desktop)

```bash
sudo apt update
sudo apt install ros-jazzy-desktop
```

### 3.4. Verify ROS 2 version

```bash
echo $ROS_DISTRO
```

Example output:

```text
jazzy
```

---

## 4. colcon and Workspace Setup

I installed `colcon` and created a standard ROS 2 workspace:

### 4.1. Install colcon

```bash
sudo apt install python3-colcon-common-extensions
```

### 4.2. Create workspace

```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws
colcon build
```

After the initial build, I sourced the workspace:

```bash
source /opt/ros/jazzy/setup.bash
source ~/ros2_ws/install/setup.bash
```

---

## 5. Shell Configuration and Aliases

To avoid manually sourcing environment setup on every terminal, I added the following lines to my `~/.bashrc`:

```bash
# ROS 2 Jazzy
source /opt/ros/jazzy/setup.bash

# ROS 2 workspace
source ~/ros2_ws/install/setup.bash

# Convenience aliases
alias sj='source /opt/ros/jazzy/setup.bash'
alias cw='cd ~/ros2_ws && source install/setup.bash'
alias cb='cd ~/ros2_ws && colcon build --symlink-install'
```

After editing `.bashrc`, I reloaded it with:

```bash
source ~/.bashrc
```

---

## 6. Virtual Machine Notes

- Ubuntu 24.04 is running inside a **virtual machine**, not on bare metal.  
- I ensured:
  - 3D acceleration / hardware virtualization is enabled in the VM settings (if available).
  - Enough RAM and disk space for ROS 2 builds and simulations.
- This setup is sufficient for learning ROS 2 and running basic examples. For heavier simulations later, I may consider increasing VM resources or moving to native dual boot.

---

## 7. Installation Issues and Status

I did **not** encounter any significant issues during:

- Ubuntu 24.04 installation  
- ROS 2 Jazzy installation  
- colcon installation  
- Workspace creation and first build  

All commands ran successfully on the first attempt. If I face issues in future weeks, I will log them here with the exact error messages and solutions.

---

## 8. Quick Sanity Checks Run

To confirm that ROS 2 is working correctly, I ran:

```bash
# New terminal 1
source /opt/ros/jazzy/setup.bash
ros2 run demo_nodes_cpp talker
```

```bash
# New terminal 2
source /opt/ros/jazzy/setup.bash
ros2 run demo_nodes_cpp listener
```

The listener received messages from the talker, confirming that ROS 2 Jazzy is correctly installed and functioning in my environment.

---