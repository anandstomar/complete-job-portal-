import jobschema from '../models/authSchema.js';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res) {
  const { fullName, email, password, confirmPassword ,role, userType } = req.body;
  const userRole = role || userType || "Candidate";

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await jobschema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    const user = await jobschema.create({
      fullName,
      email,
      password: hashedPassword,
      role: userRole,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "JobPortalUsers", {
      expiresIn: '1d'
    });

    res.status(201).json({
      message: 'Account created successfully',
      user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await jobschema.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "JobPortalUsers", {
      expiresIn: '1d'
    });

    res.status(200).json({ message: 'Login successful', user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role }, token });
    localStorage.setItem("currentUser", JSON.stringify(res.data.user));
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
}
