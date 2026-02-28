// components/auth
import ProtectedRoute from "./auth/ProtectRoute";
import RequireAdmin from "./auth/RequireAdmin";
import AuthProvider from "./auth/AuthProvider";

// components/theme
import SettingsProvider from "./theme/SettingProvider";
import ThemeSelect from "./theme/ThemeSelect";
import ThemeProvider from "./theme/ThemeProvider";

// components/todo
import FilterPills from "./todos/FilterPills";
import SkeletonList from "./todos/SkeletonList";
import TodoCheckbox from "./todos/TodoCheckbox";
import TodoGroup from "./todos/TodoGroup";
import TodoItem from "./todos/TodoItem";
import UndoToast from "./todos/UndoToast";

// components/ui
import Button from "./ui/Button";
import CalendarPicker from "./ui/CalendarPicker";
import Divider from "./ui/Divider";
import Dropdown from "./ui/Dropdown";
import ErrorCard from "./ui/ErrorCard";
import FadeUp from "./ui/FadeUp";
import InfoRow from "./ui/InfoRow";
import Input from "./ui/Input";
import Link from "./ui/Link";
import Logo from "./ui/Logo";
import Modal from "./ui/Modal";
import RoleBadge from "./ui/RoleBadge";
import SectionHeader from "./ui/SectionHeader";
import SettingRow from "./ui/SettingRow";
import Spinner from "./ui/Spinner";
import StatCard from "./ui/StatCard";
import UserAvatar from "./ui/UserAvatar";

// components
import CommandPalette from "./CommandPalette";
import KeybindingCheatsheet from "./KeybindingCheatsheet";
import Layout from "./Layout";
import Navbar from "./Navbar";
import Router from "./Router";

export {
  // components/auth
  ProtectedRoute,
  RequireAdmin,
  AuthProvider,

  // components/theme
  SettingsProvider,
  ThemeSelect,
  ThemeProvider,

  // components/todo
  FilterPills,
  SkeletonList,
  TodoCheckbox,
  TodoGroup,
  TodoItem,
  UndoToast,

  // components/ui
  Button,
  CalendarPicker,
  Divider,
  Dropdown,
  ErrorCard,
  FadeUp,
  InfoRow,
  Input,
  Link,
  Logo,
  Modal,
  RoleBadge,
  SectionHeader,
  SettingRow,
  Spinner,
  StatCard,
  UserAvatar,

  // components/
  CommandPalette,
  KeybindingCheatsheet,
  Layout,
  Navbar,
  Router,
};
