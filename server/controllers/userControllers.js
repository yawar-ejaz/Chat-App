const createUser = async (req, res, next) => {
    // return res.status(201).message("user created");
    const { name, email, password, pic } = req.body;
    console.log("Create a user ~ ");
    console.log(name);
    console.log(email);
    console.log(password);
}

module.exports = { createUser };