const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    console.log('Getting profile for user:', req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.log('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Profile retrieved successfully:', { 
      id: user._id, 
      email: user.email, 
      skillsCount: user.skills ? user.skills.length : 0 
    });
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, jobTitle, location, aboutMe, linkedinUrl, skills, experience } = req.body;
    
    console.log('Updating profile for user:', req.user.userId);
    console.log('Update data:', { 
      fullName, 
      jobTitle, 
      location, 
      skillsCount: skills ? skills.length : 0,
      experienceCount: experience ? experience.length : 0
    });
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName,
        jobTitle,
        location,
        aboutMe,
        linkedinUrl,
        skills,
        experience,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      console.log('User not found for update:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully:', { 
      id: updatedUser._id, 
      skillsCount: updatedUser.skills ? updatedUser.skills.length : 0 
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 