const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const app = express();
const routes = require("./routes/friends.js");

let users = [];

const doesExist = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validatedUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validatedUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

app.use(express.json());
app.use(
  session({
    secret: "fingerprint",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/friends", (req, res, next) => {
  if (req.session.authorization) {
    token = req.session.authorization["accessToken"];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "Unauthorized" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      {
        expiresIn: 60 * 60,
      }
    );
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User logged in successfully" });
  } else {
    return res.status(208).json({ message: "User already Exists" });
  }
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(208).json({ message: "User already Exists" });
    }
  }
  return res.status(404).json({ message: "Error Registering User!" });
});

const PORT = 5000;
app.use("/friends", routes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
