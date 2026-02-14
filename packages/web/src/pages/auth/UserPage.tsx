import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Checkbox } from "@/components/ui/Checkbox";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import Divider from "@/components/ui/Divider";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const UserPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("john.doe@example.com");
  const [username, setUsername] = useState("johndoe");

  const countries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "pk", label: "Pakistan" },
  ];

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-wide mb-2">
            User Profile
          </h1>
          <p className="text-neutral-50/60">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Alert */}
        {showAlert && (
          <div className="mb-6">
            <Alert variant="info" onClose={() => setShowAlert(false)}>
              Your profile is 80% complete. Add more information to improve your
              experience!
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-pink-500/20 border-2 border-pink-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-pink-400">JD</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">John Doe</h2>
                    <p className="text-neutral-50/60">@johndoe</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="primary" size="sm">
                        Pro Member
                      </Badge>
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Edit Profile
                </Button>
              </div>

              <Divider />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-pink-400">124</p>
                  <p className="text-sm text-neutral-50/60">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-400">1.2K</p>
                  <p className="text-sm text-neutral-50/60">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-400">342</p>
                  <p className="text-sm text-neutral-50/60">Following</p>
                </div>
              </div>
            </Card>

            {/* Activity Card */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    action: "Completed project",
                    time: "2 hours ago",
                    status: "success",
                  },
                  {
                    action: "Updated profile picture",
                    time: "1 day ago",
                    status: "primary",
                  },
                  {
                    action: "Joined new team",
                    time: "3 days ago",
                    status: "warning",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-neutral-50/50">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        activity.status as
                          | "primary"
                          | "secondary"
                          | "success"
                          | "warning"
                          | "danger"
                      }
                      size="sm"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tasks Card */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">My Tasks</h3>
                <Button variant="primary">Add Task</Button>
              </div>
              <div className="space-y-3">
                <Checkbox
                  label="Complete user profile documentation"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Checkbox
                  label="Review pull requests"
                  checked={false}
                  onChange={() => {}}
                />
                <Checkbox
                  label="Update project dependencies"
                  checked={false}
                  onChange={() => {}}
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Settings Card */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <Toggle
                  label="Dark Mode"
                  checked={darkMode}
                  onChange={setDarkMode}
                />
                <Divider />
                <Toggle
                  label="Email Notifications"
                  checked={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                />
                <Divider />
                <Toggle
                  label="Two-Factor Authentication"
                  checked={false}
                  onChange={() => {}}
                />
              </div>
            </Card>

            {/* Stats Card */}
            <Card hover>
              <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-50/70">Profile Views</span>
                  <span className="font-bold">2.4K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-50/70">Engagement Rate</span>
                  <span className="font-bold">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-50/70">Response Time</span>
                  <span className="font-bold">2.3h</span>
                </div>
              </div>
            </Card>

            {/* Loading Example */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Processing</h3>
              <div className="flex flex-col items-center gap-3 py-4">
                <Spinner size="lg" variant="primary" />
                <p className="text-sm text-neutral-50/60">Syncing data...</p>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Danger Zone</h3>
              <Alert variant="danger">
                <p className="font-semibold mb-1">Delete Account</p>
                <p className="text-xs">This action cannot be undone.</p>
              </Alert>
              <div className="mt-4">
                <Button variant="secondary" fullWidth>
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Profile"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Select
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={countries}
              placeholder="Select your country"
            />

            <Textarea
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={200}
            />

            <Divider text="OR" />

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" variant="secondary" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserPage;
