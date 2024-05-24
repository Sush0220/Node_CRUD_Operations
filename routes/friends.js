const express = require("express");

const router = express.Router();

let friends = {
  "sushilg02@gmail.com": {
    firstName: "Sushil",
    lastName: "Gangavati",
    DOB: "02-02-2000",
  },
  "meetb27@gmail.com": {
    firstName: "Meet",
    DOB: "27-11-2000",
  },
  "amanc27@gmail.com": {
    firstName: "Aman",
    lastName: "Chaturvedi",
    DOB: "27-01-2002",
  },
};

router.get("/", (req, res) => {
  res.send(JSON.stringify(friends, null, 4));
});

router.get("/:email", (req, res) => {
  const email = req.params.email;
  res.send(friends[email]);
});

router.post("/", (req, res) => {
  if (req.body.email) {
    friends[req.body.email] = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      DOB: req.body.DOB,
    };
  }
  res.send("The user" + " " + req.body.firstName + "Has been added!");
});

router.put("/:email", (req, res) => {
  const email = req.params.email;
  let friend = friends[email];
  if (friend) {
    let DOB = req.body.DOB;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;

    if (DOB) {
      friend["DOB"] = DOB;
    }
    if (firstName) {
      friend["firstName"] = firstName;
    }
    if (lastName) {
      friend["lastName"] = lastName;
    }
    friends[email] = friend;
    res.send(`Friend with email ${email} updated`);
  } else {
    res.send("Unable to find friend");
  }
});

router.delete("/:email", (req, res) => {
  const email = req.params.email;
  if (email) {
    delete friends[email];
  }
  res.send(`Friend with email ${email} deleted`);
});

module.exports = router;
