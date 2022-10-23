# Service WEB

**Deploy a Node.js (Express.js) app with Docker on Ubuntu**

## Set up
On your Ubuntu VM, create a folder for the project, and inside of it, create a node folder and a docker-compose.yml file. Inside the node folder create a Dockerfile file.

```bash
mkdir -p Project/node
touch Project/docker-compose.yml Project/node/Dockerfile
```

Launch Docker on your host machine.

The contents of the files is available on [Github](https://github.com/fyambos/ServiceWebNodeJS.git). The docker-compose.yml uses version 3 as 3.8 is too high for Ubuntu.
> note: in the docker-compose we write ./app instead of simply app so that Ubuntu understands that it is a folder in this directory and not an independent volume

A node is like a VM, you can get and reuse the Dockerfile on new nodes. 
Launch Docker on your host machine In Docker.

In Ubuntu install node with:
```bash
docker-compose up -d
```

The app folder has been created.
Nothing has been executed and no nodes has been run because in the Dockerfile we only put EXPOSE 4500.
You can verify this with the commande docker ps:
```bash
docker ps
#shows and empty table
#CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

## Running a js file with node
We are going to create a js file inside the app folder, and run it with node. As our node container has not been started, we can manually start it with:
```bash
docker-compose run node bash
```

To create the file, we need to have writing rights in /app. Because /app was created by Docker, it is owned by *root*:
```bash
sudo chown username:groupe app
```
>note: you can see file rights with `ls -l`

Now we can a test.js file in the app folder (See [JS examples](https://www.programiz.com/javascript/examples))
To run it, simply do:
```bash
node test.js
```

If you modify the file, you have to exit the container and re-enter it for the changes to be computed.

## Initialize the npm command
npm is Node.js's default package manager, since we are in our node container (`docker-compose run node bash`), we can initialize the npm command:
```bash
npm init -y
```

It will create the package.json file which contains infos such as the version, the license, etc. "The "scripts" is where you will add scripts, tools such as nodemon. "dependencies" will install all dependencies listed when running `npm install`

## Install nodemon
nodemon is a Node.js tool that automatically restarts the node container after a file has been modified. 

```bash
npm install nodemon
```
This generates the package-lock.json file.

Use the chmod command again to have write access to both of these files:
```bash
npm install nodemon 
sudo chown username:group app/package-lock.json
sudo chown username:group app/package.json
```

In the package.json file, add nodemon in "scripts"
```json
  "scripts": {
    "dev": "nodemon",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

"dev" is only the name given. You can start the node container with npm run dev instead of the docker command, and now the test.js file can be run with changes.

```bash
npm run dev
```