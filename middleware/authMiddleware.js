import jwt from "jsonwebtoken";
import Volunteer from "../models/volunteer.js";
import Admin from "../models/admin.js";

const JWT_SECRET =  "supersecretkey";

/* ----------------------------------------
   Helper: Extract JWT token from headers
---------------------------------------- */
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1]; // return only the token part
};

/* ----------------------------------------
   Middleware: Generic Token Verification
---------------------------------------- */
export const verifyToken = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token)
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userToken = decoded;
    req.token = token;

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

/* ----------------------------------------
   Middleware: Authenticate Volunteer
---------------------------------------- */
export const authenticateVolunteer = async (req, res, next) => {
  try {
    // Ensure token verified first (can also use verifyToken before this)
    let decoded = req.userToken;

    if (!decoded) {
      const token = getTokenFromHeader(req);
      if (!token)
        return res
          .status(401)
          .json({ message: "Access denied. No token provided." });

      decoded = jwt.verify(token, JWT_SECRET);
      req.userToken = decoded;
    }

    const { id, role } = decoded;

    // Only volunteers allowed
    if (role && role !== "volunteer") {
      return res
        .status(403)
        .json({ message: "Forbidden: volunteer access required." });
    }

    const volunteer = await Volunteer.findById(id).select("-password");
    if (!volunteer)
      return res
        .status(401)
        .json({ message: "Invalid token: volunteer not found." });

    req.volunteer = volunteer;
    req.user = volunteer; // generic alias for user
    next();
  } catch (err) {
    console.error("Volunteer auth error:", err.message);
    res.status(401).json({ message: "Invalid token." });
  }
};

/* ----------------------------------------
   Middleware: Authenticate Admin
---------------------------------------- */
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token)
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });

    console.log("Extracted Token:", token); // ✅ display token for debugging

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userToken = decoded;

    const { id, role } = decoded;

    // Only admins allowed
    if (role && role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: admin access required." });
    }

    const admin = await Admin.findById(id).select("-password");
    if (!admin)
      return res
        .status(403)
        .json({ message: "Forbidden: admin not found." });

    req.admin = admin;
    req.user = admin;
    next();
  } catch (err) {
    console.error("Admin auth error:", err.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
