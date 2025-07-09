
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Camera, Edit, Shield } from "lucide-react";

interface AdminProfileProps {
  onBack: () => void;
}

const AdminProfile = ({ onBack }: AdminProfileProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    bio: "",
    profilePicture: "",
    permissions: [] as string[]
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      
      // Load saved admin profile data
      const savedProfile = localStorage.getItem(`adminProfile_${userData.email}`);
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      } else {
        setProfileData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: "",
          department: "Administration",
          bio: "",
          profilePicture: "",
          permissions: ["user_management", "job_management", "test_management", "analytics"]
        });
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (currentUser) {
      localStorage.setItem(`adminProfile_${currentUser.email}`, JSON.stringify(profileData));
      
      // Update current user data
      const updatedUser = { ...currentUser, fullName: profileData.fullName };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      toast({
        title: "Profile Updated!",
        description: "Your admin profile has been saved successfully."
      });
      setIsEditing(false);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you'd verify the current password with the backend
    toast({
      title: "Password Changed!",
      description: "Your password has been updated successfully."
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsChangingPassword(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const adminStats = {
    usersManaged: JSON.parse(localStorage.getItem("users") || "[]").length,
    jobsPosted: JSON.parse(localStorage.getItem("jobApplications") || "[]").length,
    testsCreated: JSON.parse(localStorage.getItem("adminTests") || "[]").length,
    interviewsScheduled: JSON.parse(localStorage.getItem("scheduledInterviews") || "[]").length
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-2"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Admin Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h2>
                <p className="text-gray-600">{profileData.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">System Administrator</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{adminStats.usersManaged}</p>
                <p className="text-sm text-gray-600">Users Managed</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{adminStats.jobsPosted}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{adminStats.testsCreated}</p>
                <p className="text-sm text-gray-600">Tests Created</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">{adminStats.interviewsScheduled}</p>
                <p className="text-sm text-gray-600">Interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled={true}
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your department"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Security Settings</CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
              >
                Change Password
              </Button>
            </div>
          </CardHeader>
          {isChangingPassword && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handlePasswordChange}>Update Password</Button>
                <Button variant="outline" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profileData.permissions.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm capitalize">{permission.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
