// src/controllers/userManagementController.js
import User from '../models/authSchema.js';
import Application from '../models/jobApplicationSchema.js';

/**
 * GET /api/users/activity
 * Recent User Activity:
 *   - id, fullName, lastLogin, role, profilePct, applicationsCount
 */
export const getUserActivity = async (req, res, next) => {
  try {
    // fetch users sorted by lastLogin
    const users = await User.find()
      .sort({ lastLogin: -1 })
      .select('fullName email lastLogin role profilePct status joinDate createdAt')
      .lean({ virtuals: true });

    // count applications per email
    const emails = users.map(u => u.email);
    const counts = await Application.aggregate([
      { $match: { applicantEmail: { $in: emails } } },
      { $group: { _id: '$applicantEmail', count: { $sum: 1 } } }
    ]);

    const countMap = counts.reduce((m, c) => {
      m[c._id] = c.count;
      return m;
    }, {});

    const payload = users.map(u => ({
      id:            u._id,
      fullName:      u.fullName,
      email:         u.email,
      lastLogin:     u.lastLogin,
      role:          u.role,
      status:        u.status,
      joinDate:      u.joinDate || u.createdAt,
      profilePct:    u.profilePct,
      applications:  countMap[u.email] || 0
    }));

    res.json(payload);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/roles
 * Count of users per role
 */
export const getRoleCounts = async (req, res, next) => {
  try {
    const agg = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    // Map backend roles to display names and always include all roles
    const roleMap = { candidate: 'Job Seeker', interviewer: 'Interviewer', admin: 'Admin' };
    const result = { 'Job Seeker': 0, 'Interviewer': 0, 'Admin': 0 };
    agg.forEach(r => {
      const key = roleMap[r._id];
      if (key) result[key] = r.count;
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/export
 * Return JSON array of all users
 */
export const exportUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('fullName email role status phone location createdAt lastLogin profilePct joinDate')
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    const payload = users.map(u => ({
      id:         u._id,
      name:       u.fullName,
      email:      u.email,
      role:       u.role,
      status:     u.status,
      phone:      u.phone,
      location:   u.location,
      joinDate:   u.joinDate || u.createdAt,
      lastLogin:  u.lastLogin,
      profilePct: u.profilePct
    }));

    res.json(payload);
  } catch (err) {
    next(err);
  }
};
