exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

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
