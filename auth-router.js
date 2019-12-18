const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("./database/user-modal.js");

router.get("/", (req, res) => {
    Users.find()
    .then(users=>{
        res.status(200).json(users)
    })
})

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 14); 
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
        console.log(error)
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  // check that the password

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You shall not pass!🔥" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
