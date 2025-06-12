// backend/src/middleware/auth.js
const supabase = require("../config/database");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "No authentication token provided" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("Auth error:", error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("users_profile")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      return res.status(401).json({ error: "User profile not found" });
    }

    // Add user and profile to request
    req.user = { ...user, profile };
    console.log("Authenticated user:", req.user.id);

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = auth;
