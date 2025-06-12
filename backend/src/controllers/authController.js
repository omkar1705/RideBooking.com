// backend/src/controllers/authController.js
const supabase = require("../config/database");

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, role } = req.body;

    // Log the received data
    console.log("Registration attempt with data:", {
      email,
      full_name,
      phone,
      role,
      // Don't log password for security
    });

    // Validate required fields
    if (!email || !password || !full_name || !phone || !role) {
      console.log("Missing required fields");
      return res.status(400).json({
        error: "All fields are required",
        received: { email, full_name, phone, role },
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
          phone,
        },
      },
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      return res.status(400).json({
        error: authError.message,
      });
    }

    console.log("Auth user created:", authData);

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from("users_profile")
      .insert([
        {
          id: authData.user.id,
          full_name,
          phone: phone || "",
          role,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (profileError) {
      console.error("Profile Creation Error:", profileError);
      return res.status(400).json({
        error: profileError.message,
      });
    }

    console.log("Profile created:", profileData);

    res.status(201).json({
      message: "Registration successful",
      user: authData.user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        error: error.message,
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("users_profile")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    res.json({
      user: {
        ...data.user,
        profile: profile || null,
      },
      session: data.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
};
