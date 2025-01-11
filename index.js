const express = require('express');
const joi = require('joi');
const fs = require('fs');
const path = require('path');

const port = 3000;
const app = express();
const pathFile = path.join(__dirname, 'person.json');
const users = JSON.parse(fs.readFileSync(pathFile));
let userId = 3;

const userSchema = joi.object({
    name: joi.string().min(2).required(),
    surname: joi.string().min(4).required(),
    age: joi.number().min(1).max(150),
    city: joi.string().min(3)
});

app.use(express.json());

// get all
app.get('/users', (req, res) => {
    res.send({ users });
});

// get one
app.get('/users/:id', (req, res) => {
    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null, error: "User is not found!", status: 404 });
    }
});

// update
app.put('/users', (req, res) => {
    const valREsult = userSchema.validate(req.body);
    if (valREsult.error) {
        return res
            .status(404)
            .send({ error: valREsult.error.details, status: 404 })
    }

    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) { // передаем ссылку на объект
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.age = req.body.age;
        user.city = req.body.city;
        fs.writeFileSync(pathFile, JSON.stringify(users, null, 2)); // ссылаемся на элемент массива
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null, error: "User is not found!", status: 404 });
    }
});

// create new
app.post('/users/', (req, res) => {
    const valREsult = userSchema.validate(req.body);
    if (valREsult.error) {
        return res
            .status(404)
            .send({ error: valREsult.error.details, status: 404 })
    }

    const user = {
        id: userId++,
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        city: req.body.city
    };
    users.push(user);
    fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));
    res.send({ user });
});

//delete
app.delete('/users/:id', (req, res) => {
    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);
        fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null, error: "User is not found!", status: 404 });
    }
});

app.listen(port);
