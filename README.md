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

Exit the node container and use the chmod command again to have write access to both of these files:
```bash
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

From now on, once you're in your node container, you can use `npm run dev` to be able to automatically see changes as you modify your js files.

```bash
npm run dev
```
> note: "dev" is only the alias given to script, usually there is a "dev" for developping and a "prod" for production.

## Rest API
We are going to construct a REST API with Node.js
REST APIs support many protocols to connect to, manage and interact with the server, including HTTP (example of HTTP requests: GET, POST, PUT, DELETE, etc.).
JSON and XML are the most used format to read requests and responses.

## Install the Express package
Exit nodemon if in it (Ctrl+C), so that you're simply in the node container. Install Express with:
```bash
npm i express
```
## Install the Morgan package
Morgan allows to see the requests sent. Install it with:
```bash
npm i morgan
```
## Re-Build Docker
Our node container has been started with `docker-compose run node bash`, by security, this doesn't open the ports, so when we create our app, we won't be able to see anything on localhost:4500 as the port 4500 port isn't open.

To open the ports, we must compose up, but composing up runs the node, and then exits it with the code 0. That's because in our Dockerfile we didn't pass instructions.

At the bottom of the Dockerfile, add:
```bash
CMD ["npm", "run", "dev"]
```

Since we've modified the Dockerfile, we need to rebuild it.
```bash
docker-compose up --build
```

We don't need to use the run node bash command anymore, as we can directly compose up our Docker now. It will start nodenom. We can see the results of our js file in Docker, by opening the node container in a terminal.

```bash
docker-compose up -d
```

## Create an App
Follow the [Express tutorial](https://expressjs.com/en/guide/routing.html) (express.Router at the bottom) to create an express app that uses a route. Put the routes inside de app/routes folder.

In the route file, you declare a router variable.

```js
let router = express.Router();
```

You can use the HTTP Methods (GET, POST, PUT, PATCH, DELETE, HEAD, etc.) and test them by installing the VS CODE Extension Thunder Client, or using POSTMAN.

Example, a POST Method to access an element by id:

```js
// GET method, accéder a une classe par un id
router.get('/:id', (request, response) => {
  console.log(request.query, request.params);
  const {id} = request.params;
  let my_elem = some_elements.find(item => item.id === id);
  response.status(200).json(my_elem);
});
```

> note: nodejs references the actual objects when copying, modifying the copy will modify the actual element. here, modifying my_elem modifies the element in some_elements.

## Erreurs
Pour voir les erreurs, ouvrir le container node dans docker (les détails, pas le terminal intégré) on peut voir les erreurs. On peut aussi voir nodemon restart à chaque modifications.

## Mongo Express DB & Mongoose

Installing Mongo:

Add mongo as a service in the [docker-compose.yml](docker-compose.yml), here it is named simply **"mongo"**. Then add the mongo-express service, with `depends_on: mongo` so that mongo starts before trying to start mongo-express, and with `restart: on-failure` as sometimes mongo-express does not start in order (starting db before server, etc.) and fails without restarting.

In the mongo-express environment attributes, `ME_CONFIG_MONGODB_URL` @mongo references the name we have given to the mongo service (here, **"mongo"**).

Composing up will install and launch the mongo container. Rebuilding is not necessary because is didn't exist before. 

```bash
docker-compose up -d
```

Also, sometimes Mongo Express won't start by itself, you can check if it is started with
```bash
sudo docker ps
```

Start it 
```bash
sudo docker-compose up mongo-express -d
```

To use Mongo in NodeJS, the **mongoose** [package](https://mongoosejs.com/) is needed.
In the node container do
```bash
yarn add mongoose
```

Import the mongoose package in the [index.js](index.js) and add the connexion to mongoose. The connexion needs to be before the import of the routes. In the connexion, the database you connect to must be specified, here it is our db b3.

Then compose again.

```bash
docker-compose up -d
```

You can access Mongo web interface at [http://localhost:8081/](http://localhost:8081/)

The b3 database is not created yet, you can create it in the Mongo web interface.

### Database
#### Create the student entity
```javascript
//modeles/student.js
const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    //...
}, {
    //timestamps:
    timestamps: {
        createdAt:,
        updateAt:
    }
});
module.exports = mongoose.model('Student', studentSchema);
```
`timestamps:` permet de créer automatiquement des timestamps lors de créations de tables et updates.
`require: [bool, 'Msg d'erreur'],` permet de definir si le champs de la table est obligatoire

#### Create the route
```javascript
//routes/students.js
const express = require('express');
const studentModel = require('../models/student');
let router = express.Router();
// CRUD Methods
// ...
module.exports = router
```

In [index.js](index.js), *import* and *use* the route.

### Mongoose CRUD

>note: Conditional validations of the user input and try/catch methods need to be implemented.

To POST a new insersion in the database, use `await` before creating the new object. This is to ensure to wait for a response from the db before trying to do a request. To use await, the function must be *async*. 

```javascript
// POST method, enregistrer un student en bdd
router.post('/', async (req,res) => {
  const {firstname, lastname} = req.body;
  let student = await studentModel.create({
    firstname,
    lastname
  });
return res.status(200).json(student);
          
})
```

For the GET method, **then()** is used.

```javascript
// GET method, accéder a la liste des students
router.get('/', (req,res) => {
    studentModel.find({}).then(function (students) {
    res.status(200).json(students);
    });
});
```
Pour rechercher un enregistrement par id on peut utiliser `findByID()`.
`find()` peut aussi être utilisé mais retourne l'enregistrement dans un tableau de taille 1.
On retrouve aussi: `findByIDAndDelete()` et `findByIDandUpdate()`

```javascript
// GET method, accéder a un enregistrement par un id
router.get('/:id', (req,res) => {
  const {id} = req.params;
  studentModel.findById({'_id':id}).then(function (student) {
  res.status(200).json(student);
  });
});

// PUT method, update whole object by id
router.delete('/:id', (req,res) => {
    const {id} = req.params;
    const {firstname, lastname} = req.body;
    studentModel.findByIdAndUpdate({'_id':id}).then(function (student) {
      student.firstname = firstname;
      student.lastname = lastname;
    res.status(200).json(student);
    });
});

// PATCH method, update partial object by id
router.delete('/:id', (req,res) => {
    const {id} = req.params;
    const {lastname} = req.body;
    studentModel.findByIdAndUpdate({'_id':id}).then(function (student) {
      student.lastname = lastname;
    res.status(200).json(student);
    });
});

// DELETE method, delete by id
router.delete('/:id', (req,res) => {
    const {id} = req.params;
    studentModel.findByIdAndDelete({'_id':id}).then(function (student) {
    res.status(200).json("Enregistrement supprimé.");
    });
});
```

>Erreur: PUT et PATCH ne modifient pas en BDD.