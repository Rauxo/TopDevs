exports.getProfile = async (req, res) => {
  try {
    const user = await require("../models/user.models").findById(req.user._id).populate("selectedLanguages.language");

    return res.status(200).json({
      message: "User profile",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
