# NodeAPP
Deploy a Node.js (Express.js) App on Ubuntu

## Requirements
**[Git](https://gitforwindows.org/)**

**[WSL-2](https://learn.microsoft.com/fr-fr/windows/wsl/install)**

> ```bash
> wsl -l -o #pour voir les distributions
> wsl --install -d Ubuntu-20.04
> Si erreur update windows ou activer virtualisation BIOS ou faire installation manuelle

**[Docker](https://www.docker.com/products/docker-desktop/)** 

**[VSCode](https://code.visualstudio.com/)**
> Install also the three [WSL Extensions](https://code.visualstudio.com/) for VSCode

> Install [Powershell](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell) and [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) extensions for VSCODE
 
 ## Installation
 **On Windows:**
 
 Open Docker
 
 Open the Ubuntu-20.04 VM
 
**On Ubuntu:**

Clone [NodeApp](https://github.com/fyambos/NodeAPP)
 ```bash
 git clone https://github.com/fyambos/NodeAPP
 ```
 
 Set your Git Credentials if you haven't already:
```bash
git config --global user.name "your_username"
git config --global user.email "your_email@example.com"
```

Build the docker containers:
```bash
docker-compose up -d
```
> Note: Docker needs to be started for this to work. And the Ubuntu user must have the rights to access the Docker daemon socket: `sudo usermod -aG docker <your-username>`, the effects won't be taken into account until the Ubuntu VM is restarted.

## Install Nodemon
Without Nodemon installed, the node container exits on build.

###Initialize the npm command
npm is Node.js's default package manager, run the node container with `docker-compose run node bash`, and initialize the npm command:

```bash
npm init -y
```

It will create the package.json file which contains infos such as the version, the license, etc. "The "scripts" is where you will add scripts, tools such as nodemon. "dependencies" will install all dependencies listed when running npm install

###Install nodemon
nodemon is a Node.js tool that automatically restarts the node container after a file has been modified.

```bash
npm install nodemon
```

Exit the node container and use the chmod command to have write access to both of these files:

sudo chown username:group app/package-lock.json
sudo chown username:group app/package.json

Import the [thunder-collection_NodeApp.json](https://github.com/fyambos/NodeAPP/blob/main/data%20export/thunder-collection_NodeApp.json) in Thunderbird Client to test the api.

