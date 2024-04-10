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




const subscriptionadd = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  console.log("User role:", role);
  console.log("User ID:", userId);

  try {
    if (role !== "user") {
      return res
        .status(403)
        .json({ status: 403, error: "Forbidden for regular users" });
    }

    const { category_name } = req.body;

    const catName = await categoryService.checkduplicateCategoryname(
      category_name
    );
    if (catName) {
      return res
        .status(404)
        .json({ status: 404, message: "Category name already register" });
    }

    const category = await categoryService.addcategory(category_name);

    res.status(201).json({
      status: 201,
      message: category,
    });
  } catch (error) {
    console.error("Error in add category:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add category",
      stack: error.stack,
    });
  }
};

module.exports = {
  userRegister,
};
