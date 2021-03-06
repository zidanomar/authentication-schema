const express = require('express');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

const app = express();
const csurfProtection = csurf({
  cookie: true,
});

app.use(cors());
app.use(cookieParser());
app.use(csurfProtection);

const jwtSecret = 'secret123';

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get('/jwt', (req, res) => {
  const token = jsonwebtoken.sign({ user: 'johndoe' }, jwtSecret);

  res.cookie('token', token, { httpOnly: true });
  res.json({ token });
});

app.use(
  jwt({
    secret: jwtSecret,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.token,
  })
);

const foods = [
  { id: 1, description: 'burritos' },
  { id: 2, description: 'quesadillas' },
  { id: 3, description: 'churos' },
];

app.get('/foods', (req, res) => {
  res.json(foods);
});

app.post('/foods', (req, res) => {
  foods.push({
    id: foods.length + 1,
    description: 'Baklava',
  });
  res.json({
    newFood: foods,
    message: 'Food created!',
  });
});

app.listen(5000, () => {
  console.log('App running on localhost:5000');
});
