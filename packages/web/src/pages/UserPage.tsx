import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import InfoRow from "@/components/ui/InfoRow";
import SettingRow from "@/components/ui/SettingRow";
import UserAvatar from "@/components/ui/UserAvatar";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingStore";
import { formatDate, formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import {
  staggerContainer,
  cardFadeVariants,
  fadeUpVariants,
} from "@/lib/animations";
import {
  User,
  Mail,
  CalendarDays,
  LogOut,
  Pencil,
  Clock,
  Zap,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/axios";

const UserPage = () => {
  const { user, checkAuth, logout, isAdmin } = useAuthStore();
  const { reduceMotion, setReduceMotion } = useSettingsStore();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editEmail, setEditEmail] = useState(user?.email ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleOpenEdit = () => {
    setEditName(user?.name ?? "");
    setEditEmail(user?.email ?? "");
    setEditError("");
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      setEditError("Name and email are required.");
      return;
    }
    setIsSaving(true);
    setEditError("");
    try {
      await api.put("/auth/me", {
        name: editName.trim(),
        email: editEmail.trim(),
      });
      await checkAuth();
      setEditOpen(false);
    } catch (err: unknown) {
      setEditError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const memberSince = user.createdAt
    ? formatDate(new Date(user.createdAt), "do MMMM, yyyy")
    : "—";
  const memberDuration = user.createdAt
    ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: false })
    : null;

  return (
    <Layout>
      <section className="px-4 sm:px-6 mt-36 flex flex-col items-center pb-4">
        <motion.div
          className="md:max-w-4xl lg:max-w-5xl w-full"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-text/35">Account</p>
                {isAdmin && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/70 border border-primary/20">
                    <ShieldCheck className="size-2.5" />
                    Admin
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold">
                <span className="font-serif italic text-primary">
                  {user.name?.split(" ")[0] ?? "Hey"},
                </span>{" "}
                <span className="text-text/80">welcome back.</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="secondary"
                  outline
                  onClick={handleOpenEdit}
                  className="flex items-center gap-2"
                >
                  <Pencil className="size-3.5" />
                  Edit profile
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="primary"
                  outline
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="size-3.5" />
                  Sign out
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {isAdmin && (
            <motion.div
              variants={fadeUpVariants}
              className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                  <ShieldCheck className="size-4.5 text-primary/60" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text/80">
                    You have admin access
                  </p>
                  <p className="text-xs text-text/40 mt-0.5">
                    Manage users, inspect todos, and change roles from the admin
                    panel.
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/8 hover:bg-primary/15 hover:border-primary/40 text-primary/80 hover:text-primary text-sm font-medium transition-colors shrink-0 group"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <Users className="size-3.5" />
                Open admin panel
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
              </motion.button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              variants={cardFadeVariants}
              className="sm:col-span-1 rounded-2xl border border-text/8 bg-text/2 p-6 flex flex-col items-center justify-center gap-4 text-center"
            >
              <div
                className={`relative ${isAdmin ? "p-0.5 rounded-full bg-linear-to-br from-primary/30 to-primary/10 border border-primary/25" : ""}`}
              >
                <UserAvatar name={user.name ?? "?"} size="lg" />
                {isAdmin && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <ShieldCheck className="size-2.5 text-primary/70" />
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold text-text/90 text-base">
                  {user.name ?? "—"}
                </p>
                <p className="text-xs text-text/35 mt-0.5 truncate max-w-40">
                  {user.email}
                </p>
              </div>

              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                  isAdmin
                    ? "bg-primary/10 border-primary/20 text-primary/70"
                    : "bg-text/5 border-text/10 text-text/50"
                }`}
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="size-3" /> Admin
                  </>
                ) : (
                  <>
                    <User className="size-3" /> Member
                  </>
                )}
              </div>

              {memberDuration && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text/5 border border-text/10">
                  <Clock className="size-3 text-text/40" />
                  <span className="text-xs text-text/50 font-medium">
                    {memberDuration} as a member
                  </span>
                </div>
              )}
            </motion.div>

            <div className="sm:col-span-2 flex flex-col gap-4">
              <motion.div
                variants={cardFadeVariants}
                className="rounded-2xl border border-text/8 bg-text/2 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-text/30 font-serif">
                  Profile details
                </p>
                <div className="mt-3">
                  <InfoRow
                    icon={User}
                    label="Full name"
                    value={user.name ?? "—"}
                  />
                  <InfoRow
                    icon={Mail}
                    label="Email address"
                    value={user.email ?? "—"}
                  />
                  <InfoRow
                    icon={CalendarDays}
                    label="Member since"
                    value={memberSince}
                  />
                  <InfoRow
                    icon={ShieldCheck}
                    label="Role"
                    value={isAdmin ? "Administrator" : "Member"}
                  />
                </div>
              </motion.div>

              <motion.div
                variants={cardFadeVariants}
                className="rounded-2xl border border-text/8 bg-text/2 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-text/30 font-serif">
                  Preferences
                </p>
                <div className="mt-3">
                  <SettingRow
                    icon={Zap}
                    label="Reduce motion"
                    description="Disables animations and transitions across the entire app."
                    checked={reduceMotion}
                    onChange={() => setReduceMotion(!reduceMotion)}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text/40 font-medium uppercase tracking-wider">
              Full name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl border border-text/15 bg-transparent outline-none text-sm placeholder:text-text/25 focus:border-text/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text/40 font-medium uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-text/15 bg-transparent outline-none text-sm placeholder:text-text/25 focus:border-text/40 transition-colors"
            />
          </div>
          {editError && <p className="text-xs text-rose-500">{editError}</p>}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              outline
              onClick={() => setEditOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              outline
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserPage;
