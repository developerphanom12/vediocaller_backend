const { v4: uuidv4 } = require("uuid");
const userservice = require("../service/userservice");

const userRegister = async (req, res) => {
  try {
    const { google_id, name } = req.body;
    const doesUserExist = await userservice.getGoogleIdCheck(google_id);

    if (doesUserExist) {
      userservice.login(google_id, (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "An unexpected error occurred." });
        }
        return res.status(200).json({
          message: "user login successful",
          status: 200,
          data: result.data,
          token: result.token,
        });
      });
    } else {
      if (!name) {
        return res.status(400).json({
          error: "name is required for registration.",
        });
      }
      const usernameExists = await userservice.username(name);
      if (usernameExists) {
        return res.status(409).json({
          error: "Username already exists.",
        });
      }
     
      const userId = await userservice.registeruser({
        name,
        google_id,
      });

      await userservice.registerlogin(userId, (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "An unexpected error occurred." });
        }
        return res.status(200).json({
          message: "user login successful",
          status: 200,
          data: result,
        });
      });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      status: 500,
      error: "An unexpected error occurred. Please try again later.",
      errorMessage: error.message,
    });
  }
};

module.exports = {
  userRegister,
};
