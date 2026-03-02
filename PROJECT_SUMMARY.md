# Todo App - Complete Project Documentation

## Executive Summary

**Bydo.io** is a full-stack task management application built as a Bun-based monorepo. It demonstrates modern TypeScript practices with a Vite + React frontend, Express backend, and PostgreSQL/SQLite database managed through Prisma. The application features JWT-based authentication, real-time todo management, admin controls, and a polished UI with theme support and smooth animations.

**Repository Structure:** Monorepo with three workspace packages (`@todo/backend`, `@todo/web`, `@todo/shared`)

**Recent Enhancements:** Keyboard‑centric workflows (command palette, global shortcuts and cheatsheet), undo/delete restoration, a full user profile/settings panel with animation control and reduce‑motion support, calendar navigation and improved accessibility across the UI.

---

## Tech Stack Overview

### Core Runtime & Languages

- **Runtime:** Bun (TypeScript-first JavaScript runtime)
- **Language:** TypeScript 5.9.3
- **Package Manager:** Bun (workspace management)

### Backend

- **Framework:** Express.js 5.2.1
- **Database ORM:** Prisma 7.4.0
- **Database Adapter:** PostgreSQL (via Neon), LibSQL, or SQLite
- **Authentication:** JWT with cookie-based session storage
- **Validation:** Zod 4.3.6
- **Password Hashing:** Bun's native bcrypt module
- **Utilities:** cookie-parser, cors, dotenv

### Frontend

- **UI Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 4.1.18 (with Vite plugin)
- **State Management:** Zustand 5.0.10
- **Routing:** React Router DOM 7.13.0
- **Data Fetching:** TanStack React Query 5.90.20, Axios 1.13.4
- **HTTP Client:** Axios (with withCredentials for cookie-based auth)
- **Animations:** Motion 12.29.2, GSAP 3.14.2
- **UI Components:** Lucide React 0.567.0 (icon library)
- **Drag & Drop:** @dnd-kit/core, @dnd-kit/sortable (for todo reordering)
- **Date Handling:** date-fns 4.1.0
- **Utilities:** clsx, tailwind-merge

### Shared Package

- **Validation Schemas:** Zod schemas for auth and todo inputs
- **Type Definitions:** TypeScript interfaces for User, Todo, and API responses

---

## Design Language

### Color Palette

**Light Mode:**

```
Primary Color:        #f80429 (Vibrant Red)
Secondary Color:      #ef233c (Deep Red)
Background Color:     #edf2f4 (Off-white)
Text Color:           #1a1a1a (Near black)
```

**Dark Mode:**

```
Primary Color:        #ef233c (Deep Red)
Secondary Color:      #d90429 (Dark Red)
Background Color:     #1a1a1a (Near black)
Text Color:           #edf2f4 (Off-white)
```

### Typography

**Font Families:**

- **Primary (Sans-serif):** Inter (weights 100-900) - used for UI and body text
- **Secondary (Serif):** Unna (Regular, Italic, Bold, Bold Italic) - used for headings and decorative elements

**Font Sizing:** Tailwind CSS default scale (text-xs through text-9xl)

### Visual Features

- **Scrollbar:** Hidden across all browsers (webkit, firefox) for clean aesthetics
- **Motion:** GSAP + Motion React for smooth animations with customizable speeds (slow, normal, fast)
- **Accessibility:** Reduce motion settings via `reduce-motion` class that sets animation-duration and transition-duration to 0.001ms
- **Rounded Elements:** Consistent use of rounded-full for badges and pill-shaped buttons
- **Transparency:** Heavy use of backdrop-blur and rgba text colors for glass-morphism effects
- **Border Style:** Minimal borders with text/5 opacity for subtle separation
- **Keyboard Shortcuts:** Global and contextual keyboard commands accessible via `mod+k` command palette and `?` cheatsheet.

### Component Styling Patterns

- **Buttons:** Outlined (tertiary) and filled (primary) variants with transition effects
- **Lists:** Clean, minimal spacing with hover states and smooth transitions
- **Forms:** Full-width inputs with subtle borders and focus states
- **Navigation:** Rounded navigation bar with glass effect (backdrop blur + semi-transparent background)

---

## Backend Architecture

### File Structure Overview

```
packages/backend/
├── src/
│   ├── server.ts                 # Express app initialization & middleware setup
│   ├── controllers/              # Request handlers for each route
│   │   ├── auth.controller.ts   # Register, login, logout, getMe
│   │   ├── todo.controller.ts   # CRUD operations for todos
│   │   └── admin.controller.ts  # Admin-only user & todo management
│   ├── routes/                  # Route definitions with middleware
│   │   ├── auth.routes.ts       # Public auth endpoints
│   │   ├── todo.routes.ts       # Protected todo endpoints
│   │   └── admin.routes.ts      # Admin-only endpoints
│   ├── middlewares/             # Express middleware
│   │   └── auth.middleware.ts   # JWT verification & admin role check
│   ├── libs/                    # Utility libraries
│   │   ├── prisma.ts           # Prisma client instance with Neon adapter
│   │   ├── env.ts              # Environment variable validation with Zod
│   │   ├── cookies.ts          # Cookie management (get, set, clear)
│   │   └── utils.ts            # Hash & compare password utilities
│   └── types/
│       └── express.d.ts         # Express Request type augmentation for `user`
├── prisma/
│   ├── schema.prisma            # Data model definitions
│   └── migrations/              # Database migration history
├── generated/
│   └── prisma/                  # Generated Prisma client code
└── package.json                 # Backend dependencies & scripts
```

### Server Initialization (`server.ts`)

**Middleware Stack:**

```typescript
// CORS Configuration - allows frontend on localhost:5173 or FRONTEND_URL env var
app.use(
  cors({
    origin:
      env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : env.FRONTEND_URL,
    credentials: true, // Enable cookie-based authentication
  }),
);

// Cookie Parser - parses Set-Cookie headers
app.use(cookieParser());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Route Registration:**

- `/api/auth` - Public authentication endpoints
- `/api/todo` - Protected todo endpoints (requires authentication)
- `/api/admin` - Admin-only endpoints (requires admin role)
- `/health` - Server health check endpoint

### Environment Configuration (`env.ts`)

Uses Zod for runtime validation of environment variables:

```typescript
EnvSchema: {
  NODE_ENV: "development" | "production" (default: "development")
  PORT: number (default: 5000)
  DATABASE_URL: string (Neon connection URL or SQLite file path)
  DIRECT_URL: string (Direct database connection for migrations)
  JWT_SECRET: string (Required - used for signing tokens)
  FRONTEND_URL: string (Optional - used in production)
}
```

### Authentication System

**JWT Token Generation & Verification:**

- Tokens signed with `JWT_SECRET` from environment
- Token expiration: 7 days
- Tokens stored in HTTP-only cookies (httpOnly: true, secure in production, sameSite: strict)

**Auth Controller Logic:**

**Register (`POST /api/auth/register`):**

```typescript
Input Validation (Zod):
  - name: string (min 2 chars)
  - email: string (valid email format)
  - password: string (min 8 chars)

Process:
  1. Validate input with registerSchema
  2. Hash password using Bun's bcrypt
  3. Check if email already exists
  4. Create new user in database
  5. Generate JWT token
  6. Set access_token cookie
  7. Return user object (without password)
```

**Login (`POST /api/auth/login`):**

```typescript
Input Validation:
  - email: string (valid email)
  - password: string (min 8 chars)

Process:
  1. Validate input with loginSchema
  2. Find user by email
  3. Compare provided password with stored hash using bcrypt
  4. Generate JWT token
  5. Set access_token cookie
  6. Return user object
```

**Logout (`POST /api/auth/logout`):**

```typescript
Process:
  1. Clear access_token cookie
  2. Return success message
```

**Update Current User (`PUT /api/auth/me`):**

```typescript
Input Validation (basic):
  - name: string (min 2 chars, optional)
  - email: string (valid email, optional)

Process:
  1. Verify JWT and load current user via protection middleware
  2. Validate incoming fields
  3. Update user record in the database
  4. Return updated user object
```

**Get Current User (`GET /api/auth/me`):**

```typescript
Process:
  1. Extract token from cookies
  2. Verify token with JWT_SECRET
  3. Fetch user from database
  4. Return user (id, name, email, role, createdAt)
  5. Handle JWT errors (expired, invalid)
```

### Middleware

**Auth Protection Middleware (`protect`):**

```typescript
Process:
  1. Extract access_token from request cookies
  2. Verify token signature using JWT_SECRET
  3. Fetch user by decoded userId
  4. Attach user object to req.user
  5. Call next() if valid
  6. Return 401 if token missing/invalid/user not found
```

**Admin Role Check (`requireAdmin`):**

```typescript
Process:
  1. Check if req.user.role === "ADMIN"
  2. Return 403 if not admin
  3. Call next() if admin
```

### Todo Controller

**GetAll (`GET /api/todo`):**

```typescript
- Protected route
- Retrieves all todos for authenticated user
- Filters by userId: req.user.id
- Returns array of Todo objects
```

**Create (`POST /api/todo`):**

```typescript
Input Validation:
  - text: string (required, min 1 char)
  - note: string (optional)
  - dueDate: string (optional, ISO format)

Process:
  1. Validate input with createTodoSchema
  2. Create todo in database with userId from current user
  3. Return created todo with 201 status
```

**Update (`PUT /api/todo/:id`):**

```typescript
Input Validation:
  - text: string (optional)
  - note: string | null (optional)
  - done: boolean (optional)
  - dueDate: string | null (optional)

Process:
  1. Validate todoId param exists
  2. Check if todo exists and belongs to user
  3. Update todo fields (only provided fields)
  4. Return updated todo
```

**Delete (`DELETE /api/todo/:id`):**

```typescript
Process:
  1. Validate todoId param
  2. Check if todo exists
  3. Delete todo from database
  4. Return success message
```

### Admin Controller

**All Users (`GET /api/admin/users`):**

```typescript
- Protected & admin-only
- Returns list of all users with stats
- Stats include:
  - total: number of todos
  - completed: number of done todos
  - active: number of pending todos
- Ordered by createdAt (newest first)
```

**User Todos (`GET /api/admin/users/:userId/todos`):**

```typescript
- Protected & admin-only
- Retrieves all todos for specific user
- Returns: id, text, note, done, dueDate, createdAt
```

**Delete User (`DELETE /api/admin/users/:userId`):**

```typescript
- Protected & admin-only
- Prevents admin from deleting their own account
- Cascades delete: removes user's todos first, then user
```

**Delete Todo (`DELETE /api/admin/todos/:todoId`):**

```typescript
- Protected & admin-only
- Allows admin to delete any todo
```

**Update User Role (`PATCH /api/admin/users/:userId/role`):**

```typescript
Input:
  - role: "USER" | "ADMIN"

Restrictions:
  - Prevents admins from changing their own role
  - Validates role value
```

### Password Hashing

Uses Bun's native bcrypt implementation:

```typescript
// Hash password during registration
const hashed = await Bun.password.hash(password, "bcrypt");

// Verify password during login
const verified = await Bun.password.verify(password, hash, "bcrypt");
```

### Cookie Management

**Set Cookie:**

```typescript
HTTP-only: true (not accessible to JavaScript)
Secure: true (only sent over HTTPS in production)
SameSite: "strict" (CSRF protection)
MaxAge: 7 days (matches JWT expiration)
```

**Clear Cookie:**

```typescript
res.clearCookie(name, { httpOnly: true, secure, sameSite });
```

---

## Database Schema

### Prisma Schema

**Provider:** PostgreSQL (with Neon adapter) or SQLite

**Data Models:**

#### User Model

```typescript
model User {
  id        String   @id @default(uuid())    // Unique identifier
  name      String                            // User's display name
  email     String   @unique                  // Unique email address
  password  String                            // Hashed password
  role      Role     @default(USER)           // USER or ADMIN
  createdAt DateTime @default(now())          // Account creation timestamp
  updatedAt DateTime @updatedAt               // Last update timestamp
  todos     Todo[]                            // Relationship - user's todos
}

enum Role {
  USER
  ADMIN
}
```

#### Todo Model

```typescript
model Todo {
  id        String    @id @default(uuid())   // Unique identifier
  text      String                            // Todo task text
  note      String?                           // Optional detailed note
  done      Boolean   @default(false)         // Completion status
  dueDate   DateTime?                         // Optional due date
  user      User?     @relation(fields: [userId], references: [id])
  userId    String?                           // Foreign key to User
  createdAt DateTime  @default(now())         // Creation timestamp
  updatedAt DateTime  @updatedAt              // Last update timestamp
}
```

**Indexes:**

- User.email: UNIQUE (for email lookups during auth)
- Todo.userId: Foreign key index (for user todo queries)

**Migrations:**

- `20260217111750_init` - Initial schema
- `20260218180844_init` - Schema adjustments
- `20260219185250_init` - Additional schema changes

---

## Frontend Architecture

### File Structure Overview

```
packages/web/
├── src/
│   ├── main.tsx                  # React app entry point
│   ├── App.tsx                   # Router setup & route definitions
│   ├── index.css                 # Tailwind imports & custom theme values
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.tsx           # Main navigation bar with auth state
│   │   ├── Layout.tsx           # Responsive layout wrapper
│   │   ├── CommandPalette.tsx   # Command palette for shortcuts
│   │   ├── KeybindingCheatsheet.tsx # On‑demand shortcuts reference
│   │   ├── InfoRow.tsx            # Label/value row used on profile page
│   │   ├── SettingRow.tsx         # Toggle row with icon & description
│   │   ├── UserAvatar.tsx         # Circular user initials/avatar component
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx    # Context for initial auth check
│   │   │   ├── ProtectRoute.tsx    # Route guard for authenticated users
│   │   │   └── RequireAdmin.tsx    # Route guard for admin users
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx   # Theme context & media query listener
│   │   │   ├── SettingProvider.tsx # Settings context initialization
│   │   │   └── ThemeSelect.tsx     # Theme selector component
│   │   ├── todos/
│   │   │   ├── TodoItem.tsx        # Individual todo with editing & drag support
│   │   │   ├── TodoCheckbox.tsx    # Animated checkbox for todo completion
│   │   │   ├── TodoGroup.tsx       # Groups todos by date
│   │   │   ├── FilterPills.tsx     # Filter buttons (all, active, completed)
│   │   │   ├── SkeletonList.tsx    # Loading skeleton
│   │   │   └── UndoToast.tsx       # Undo notification toast
│   │   └── ui/
│   │       ├── Button.tsx         # Reusable button component
│   │       ├── Link.tsx           # Navigation link component
│   │       ├── Logo.tsx           # Brand logo
│   │       ├── Divider.tsx        # Visual separator
│   │       ├── CalendarPicker.tsx # Date picker for due dates
│   │       ├── Dropdown.tsx       # Dropdown menu component
│   │       └── ... (other UI primitives)
│   ├── pages/                    # Full-page components
│   │   ├── home/
│   │   │   └── Home.tsx          # Landing page
│   │   ├── auth/
│   │   │   ├── Login.tsx         # Login form page
│   │   │   └── Register.tsx      # Registration form page
│   │   ├── todos/
│   │   │   └── Todos.tsx         # Main todos management page
│   │   ├── CalenderPage.tsx      # Calendar view of todos
│   │   ├── UserPage.tsx          # User profile/settings page
│   │   ├── admin/
│   │   │   ├── AdminPage.tsx     # Admin dashboard (user list)
│   │   │   └── AdminUserPage.tsx # Admin user detail page
│   │   └── errors/
│   │       ├── NotFound.tsx      # 404 page
│   │       ├── Unauthorized.tsx  # 401 page
│   │       └── Forbidden.tsx     # 403 page
│   ├── store/                    # Zustand state stores
│   │   ├── authStore.ts          # Auth state (user, login, logout, checkAuth)
│   │   ├── todoStore.ts          # Todo state (todos, CRUD operations)
│   │   ├── themeStore.ts         # Theme state (light/dark/auto)
│   │   ├── settingStore.ts       # Settings (reduce motion, animation speed)
│   │   └── commandPaletteStore.ts # Command palette open/close state (triggered by mod+k; used by Navbar & Router)
│   ├── lib/                      # Utility libraries
│   │   ├── axios.ts              # Axios instance with default config
│   │   ├── todos.ts              # Todo grouping & date utilities
│   │   ├── animations.ts         # Motion/GSAP animation definitions
│   │   └── utils.ts              # General utilities (cn for clsx/tailwind-merge)
│   ├── config/
│   │   └── api.ts                # API configuration constants
│   ├── constants/
│   │   └── index.ts              # Navigation links, filter options, etc.
│   ├── types/
│   │   ├── index.d.ts            # Custom type definitions (Theme, Filter, DateGroup)
│   │   └── admin.type.ts         # Admin-specific types
│   └── vite.config.ts            # Vite configuration (not in src/)
├── vite.config.ts                # Main Vite config
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # TypeScript configuration
```

### State Management Architecture

**Zustand Stores:**

#### 1. **Auth Store (`authStore.ts`)**

```typescript
State:
  - user: User | null           // Current user object
  - isLoading: boolean          // Loading state during auth check
  - isAuthenticated: boolean    // Auth status
  - isAdmin: boolean            // Admin flag (cached from user.role)

Actions:
  - checkAuth(): Promise<void>
    • Called on app mount
    • Calls GET /api/auth/me
    • Sets user & authenticated state
    • Catches errors silently (logged out state)

  - login(data: LoginInput): Promise<void>
    • POST /api/auth/login
    • Updates user state, sets isAdmin flag

  - register(data: RegisterInput): Promise<void>
    • POST /api/auth/register
    • Updates user state, sets isAdmin flag

  - logout(): Promise<void>
    • POST /api/auth/logout
    • Clears user state, resets to logged out
```

#### 2. **Todo Store (`todoStore.ts`)**

```typescript
State:
  - todos: Todo[]               // Array of all user todos
  - isLoading: boolean          // Loading state during fetch

Actions:
  - fetchTodos(): Promise<void>
    • GET /api/todo
    • Populates todos array

  - createTodo(data: CreateTodoInput): Promise<void>
    • POST /api/todo
    • Appends new todo to local state

  - updateTodo(id: string, data: UpdateTodoInput): Promise<void>
    • PUT /api/todo/:id
    • Updates specific todo in array

  - deleteTodo(id: string): Promise<void>
    • DELETE /api/todo/:id
    • Removes todo from array

  - toggleTodo(id: string): Promise<void>
    • PUT /api/todo/:id with { done: !todo.done }
    • Toggles completion status
```

#### 3. **Theme Store (`themeStore.ts`)**

```typescript
State:
  - theme: "light" | "dark" | "auto"
  - resolvedTheme: "light" | "dark"  // System preference or explicit theme
  - isDark: boolean                   // Computed dark mode status

Actions:
  - setTheme(theme: Theme): void
    • Saves to localStorage
    • Applies theme with CSS class manipulation
    • Updates resolved theme based on system preference

  - initializeTheme(): void
    • Loads from localStorage on app start
    • Listens to media query changes for "auto" mode
    • Updates state when system preference changes
```

#### 4. **Settings Store (`settingStore.ts`)**

````typescript
State:
  - reduceMotion: boolean              // Accessibility setting
  - animationSpeed: "slow" | "normal" | "fast"

Duration Map:
  - slow: 2 seconds
  - normal: 0.4 seconds
  - fast: 0.18 seconds

Actions:
  - setReduceMotion(value: boolean): void
    • Applies .reduce-motion class to root element
    • Saves to localStorage

  - setAnimationSpeed(speed: AnimationSpeed): void
    • Saves to localStorage
    • Used by Motion/GSAP animations

  - initializeSettings(): void
    • Loads from localStorage on app start

#### 5. **Command Palette Store (`commandPaletteStore.ts`)**
```typescript
State:
  - isOpen: boolean              // whether the command palette modal is visible

Actions:
  - open(): void                 // sets isOpen true
  - close(): void                // sets isOpen false
  - toggle(): void               // toggles the palette

Description:
  • Used by the global `mod+k` shortcut and Navbar button
  • Commands include navigation actions and a searchable list of shortcuts.
````

```

### Authentication Flow

**App Initialization:**
```

1. AuthProvider mounts (in main.tsx)
   └─> Calls useAuthStore.checkAuth()
   └─> GET /api/auth/me
   • If success: user is logged in
   • If fails: user is logged out

2. App component renders
   └─> Checks isAuthenticated before showing protected routes

````

**Protected Routes:**

**ProtectedRoute Component:**
```typescript
- Wraps routes that require authentication
- Checks useAuthStore.isAuthenticated
- Redirects to /login if not authenticated
- Shows children if authenticated
````

**RequireAdmin Component:**

```typescript
- Wraps routes that require admin role
- Checks useAuthStore.isAdmin
- Redirects to /forbidden if not admin
- Shows children if admin
```

**Login Flow:**

```
1. User submits login form
2. Calls authStore.login(email, password)
   └─> POST /api/auth/login
       ├─> Server validates & hashes password
       ├─> Server creates JWT token
       └─> Server sets HTTP-only cookie
3. Cookie is automatically sent with future requests
4. User redirected to /todos or home
```

**Logout Flow:**

```
1. User clicks logout
2. Calls authStore.logout()
   └─> POST /api/auth/logout
       ├─> Server clears cookie
3. authStore state reset to logged out
4. User redirected to /
```

### HTTP Client Configuration (`axios.ts`)

```typescript
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Automatically send cookies with requests
});

// All requests use this instance, so cookies are sent to protected routes
```

### Component Patterns

**TodoItem Component:**

```typescript
Props:
  - todo: Todo & { dueDate?: string | Date | null; note?: string | null }
  - isEditing: boolean
  - editingText: string
  - isHighlighted?: boolean
  - onStartEdit, onUpdate, onCancelEdit, onDelete, onToggle callbacks

Features:
  - Inline editing of todo text
  - Date picker for due dates
  - Note expansion with textarea
  - Drag-drop support via @dnd-kit/sortable
  - Overdue status indicator
  - Due today badge
  - Auto-highlight with scroll on creation
  - Smooth animations using Motion

Internal State:
  - isExpanded: for showing/hiding note section
  - noteValue: local note input state
  - showHighlight: for fade animation on new todos

Drag & Drop Integration:
  - useSortable hook for reordering
  - CSS transform applied for visual feedback
  - isDragging state for opacity change
```

**Navbar Component:**

```typescript
Features:
  - Logo & brand name
  - Navigation links (conditional based on auth)
  - Theme selector
  - Command palette toggle (Cmd+K)
  - Auth links (User, Logout) or (Login, Register)
  - Mobile menu with hamburger icon
  - Glass morphism design with blur effect
  - Staggered animations on mount
  - Responsive design (hidden on mobile, visible on md+)

Mobile Menu:
  - Hamburger menu icon
  - Full-screen overlay menu
  - Links + auth controls
  - Theme selector
```

**AuthProvider Component:**

```typescript
Function:
  - Wraps entire app in main.tsx
  - Calls useAuthStore.checkAuth() on mount
  - Performs initial auth verification
  - Catches errors silently
- No UI rendering, just effect hook execution
```

**Command Palette & Shortcuts:**

```typescript
Features:
  - Global `mod+k` opens a searchable command palette overlay
  - Commands (navigate to pages, toggle settings, etc) defined in `lib/keybindings.ts`
  - Palette visibility controlled by `commandPaletteStore` (open/close/toggle)
  - `KeybindingCheatsheet` component shows all shortcuts grouped by scope;
    toggled with `?` and dismissable with escape
  - Shortcuts include focus input (/), undo delete (mod+z), calendar nav, edit actions
```

**UserPage Component:**

```typescript
Features:
  - Displays user profile info, avatar, membership details, and role badge
  - Editable name/email modal with form validation and API call
  - Preferences section with reduce-motion toggle and animation speed selector
  - Admin users see banner linking to admin panel and extra stats
  - Uses UI primitives `InfoRow`, `SettingRow`, and `UserAvatar` for layout
```

**UndoToast Component:**

```typescript
Features:
  - Brief notification shown after deleting a todo
  - Provides an undo callback that restores the todo via todo store
  - Dismisses automatically after 5 seconds or when user toggles
  - Can be triggered via `mod+z` global shortcut as well
```

**Calendar Page & Navigation Shortcuts:**

```typescript
Features:
  - Monthly grid view of todos with due dates highlighted
  - Arrow keys navigate previous/next month; `t` jumps to current month
  - Keyboard shortcuts ignored when focus is in input/textarea
  - Supports date picker for creating/editing todos from calendar
```

### Validation Schemas

**Auth Schemas (from shared):**

```typescript
loginSchema:
  - email: valid email format
  - password: minimum 8 characters

registerSchema:
  - name: minimum 2 characters
  - email: valid email format
  - password: minimum 8 characters
```

**Todo Schemas (from shared):**

```typescript
createTodoSchema:
  - text: required string (min 1 char)
  - note: optional string
  - dueDate: optional ISO date string

updateTodoSchema:
  - text: optional string (min 1 char if provided)
  - note: optional nullable string
  - done: optional boolean
  - dueDate: optional nullable string
```

### Animations

**Motion Library Usage:**

```typescript
Variants defined in lib/animations.ts:
  - navVariants: Navbar entrance animation
  - todoItemVariants: Todo list item animations
  - buttonVariants: Button hover/tap effects
  - mobileMenuVariants: Mobile menu slide-in
  - commandPaletteBackdropVariants: Fade/backdrop animation for command palette and cheatsheet
  - commandPaletteVariants: Main palette/cheatsheet panel entrance
  - commandPaletteGroupVariants, commandPaletteItemVariants: Staggered list animations for command groups and items

GSAP Usage:
  - Scroll animations
  - Timeline-based sequences
  - Custom easing functions
```

**Animation Speed Control:**

```typescript
Respects useSettingsStore.animationSpeed:
  - Duration multiplied by speed factor
  - Automatically reduced if reduceMotion is enabled
  - Accessibility: motion.css class disables all animations
```

---

## Shared Package

### File Structure

```
packages/shared/
├── src/
│   ├── index.ts                      # Main export file
│   ├── schemas/
│   │   ├── auth.schema.ts            # Zod schemas for login/register
│   │   └── todo.schema.ts            # Zod schemas for todo CRUD
│   └── types/
│       └── index.ts                  # TypeScript type definitions
└── package.json
```

### Validation Schemas

**Auth Schemas (`auth.schema.ts`):**

```typescript
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;
```

**Todo Schemas (`todo.schema.ts`):**

```typescript
export const createTodoSchema = z.object({
  text: z.string().min(1, "Todo text is required"),
  note: z.string().optional(),
  dueDate: z.string().optional(),
});
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = z.object({
  text: z.string().min(1, "Todo text is required").optional(),
  note: z.string().optional().nullable(),
  done: z.boolean().optional(),
  dueDate: z.string().optional().nullable(),
});
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
```

### Type Definitions (`types/index.ts`)

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  text: string;
  note: string | null;
  done: boolean;
  dueDate?: string; // ISO date string
  userId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface TodoResponse {
  todo: Todo;
  message: string;
}

export interface TodosResponse {
  todos: Todo[];
}

export type Theme = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";
export type Filter = "all" | "active" | "completed";
export type DateGroup = "Today" | "Yesterday" | "This Week" | "Older";
```

---

## API Specification

### Authentication Endpoints

#### Register User

```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Success Response (201):
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2026-02-22T10:00:00Z",
    "updatedAt": "2026-02-22T10:00:00Z"
  },
  "message": "User created successfully"
}

Error Response (400):
{
  "message": {
    "fieldName": ["error message"]
  }
}

Headers Set:
Set-Cookie: access_token=<jwt>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

#### Login User

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Success Response (200):
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2026-02-22T10:00:00Z",
    "updatedAt": "2026-02-22T10:00:00Z"
  },
  "message": "Logged in successfully"
}

Error Response (400):
{
  "message": "Invalid email or password"
}

Headers Set:
Set-Cookie: access_token=<jwt>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

#### Logout User

```
POST /api/auth/logout

Success Response (200):
{
  "message": "Logged out successfully"
}

Headers Modified:
Set-Cookie: access_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

#### Get Current User

```
GET /api/auth/me
Cookie: access_token=<jwt>

Success Response (200):
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2026-02-22T10:00:00Z"
  }
}

Error Response (401):
{
  "message": "Not authenticated" | "Invalid token" | "Token expired"
}

#### Update Current User

```

PUT /api/auth/me
Content-Type: application/json
Cookie: access_token=<jwt>

Request Body (any of):
{
"name": "New Name",
"email": "new@example.com"
}

Success Response (200):
{
"user": { /_ updated user object _/ }
}

Error Response (400):
{
"message": "Validation failed" | { field: ["error"] }
}

```

```

### Todo Endpoints

#### Get All Todos

```
GET /api/todo
Cookie: access_token=<jwt>

Success Response (200):
{
  "todos": [
    {
      "id": "uuid",
      "text": "Buy groceries",
      "note": "Milk, eggs, bread",
      "done": false,
      "dueDate": "2026-02-23T12:00:00Z",
      "userId": "user-uuid",
      "createdAt": "2026-02-22T10:00:00Z",
      "updatedAt": "2026-02-22T10:00:00Z"
    }
  ]
}

Error Response (500):
{
  "message": "Failed to retrieve todos"
}
```

#### Create Todo

```
POST /api/todo
Content-Type: application/json
Cookie: access_token=<jwt>

Request Body:
{
  "text": "Buy groceries",
  "note": "Milk, eggs, bread",
  "dueDate": "2026-02-23T12:00:00Z"
}

Success Response (201):
{
  "todo": { /* todo object */ },
  "message": "Todo created successfully"
}

Error Response (400):
{
  "message": {
    "text": ["Todo text is required"]
  }
}
```

#### Update Todo

```
PUT /api/todo/:id
Content-Type: application/json
Cookie: access_token=<jwt>

Request Body (all fields optional):
{
  "text": "Updated text",
  "note": "Updated note",
  "done": true,
  "dueDate": "2026-02-25T12:00:00Z"
}

Success Response (200):
{
  "todo": { /* updated todo */ },
  "message": "Todo updated successfully"
}
```

#### Delete Todo

```
DELETE /api/todo/:id
Cookie: access_token=<jwt>

Success Response (200):
{
  "message": "Todo deleted successfully"
}
```

### Admin Endpoints

#### Get All Users

```
GET /api/admin/users
Cookie: access_token=<jwt>  // Admin required

Success Response (200):
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2026-02-22T10:00:00Z",
      "stats": {
        "total": 15,
        "completed": 10,
        "active": 5
      }
    }
  ]
}

Error Response (403):
{
  "message": "Forbidden. Admin access only."
}
```

#### Get User's Todos

```
GET /api/admin/users/:userId/todos
Cookie: access_token=<jwt>  // Admin required

Success Response (200):
{
  "todos": [ /* todos for user */ ]
}
```

#### Delete User

```
DELETE /api/admin/users/:userId
Cookie: access_token=<jwt>  // Admin required

Success Response (200):
{
  "message": "User deleted successfully"
}

Note: Cascades delete to all user's todos
```

#### Delete Todo (Admin)

```
DELETE /api/admin/todos/:todoId
Cookie: access_token=<jwt>  // Admin required

Success Response (200):
{
  "message": "Todo deleted successfully"
}
```

#### Update User Role

```
PATCH /api/admin/users/:userId/role
Content-Type: application/json
Cookie: access_token=<jwt>  // Admin required

Request Body:
{
  "role": "ADMIN" | "USER"
}

Success Response (200):
{
  "user": { /* updated user */ }
}
```

---

## Process Flows

### User Registration Flow

```
Frontend (React) -> Backend (Express)
   |                    |
1. User fills form      |
   |                    |
2. onSubmit calls      |
   registerSchema.parse()|
   |                    |
3. Valid? POST to      |
   /api/auth/register  |
   |                 -> 4. receiveRegisterRequest
   |                    |
   |                    5. Parse & validate with registerSchema
   |                    |
   |                    6. Hash password using bcrypt
   |                    |
   |                    7. Check email uniqueness
   |                    |
   |                    8. Create user in database
   |                    |
   |                    9. Generate JWT token
   |                    |
   |                    10. Set HTTP-only cookie
   |                    |
   |                <- 11. Return user object
   |
12. Set authStore.user & isAuthenticated
   |
13. Redirect to /todos
```

### Profile Update Flow

```
Frontend (React) -> Backend (Express)
   |                    |
1. User clicks edit profile      |
   |                     |
2. Modal form appears          |
   |                     |
3. onSubmit validate (non-empty) |
   |                     |
4. PUT /api/auth/me           |
   |                  -> 5. receiveUpdateRequest
   |                     |
   |                     6. Verify JWT, lookup user
   |                     7. Update name/email in DB
   |                  <- 8. Return updated user object
   |
9. authStore.checkAuth() refreshes state
  |
10. Modal closes, UI reflects changes
```

### Undo Delete Flow

```
1. User deletes a todo (click or keyboard shortcut)
2. TodoStore removes item optimistically
3. UndoToast component appears with 5s timer
4. If user clicks undo or presses mod+z:
     - Cancel timer
     - TodoStore re-inserts previous item or toggles done
5. If timer expires, no action (delete persisted)
```

### Todo Creation & Display Flow

```
Frontend:                          Backend:
   |                                 |
1. User types & submits            |
   |                                |
2. Validate with createTodoSchema |
   |                                |
3. POST to /api/todo             |
   |                          -> 4. receive request
   |                             5. Verify JWT token
   |                             6. Extract userId from token
   |                             7. Validate input with schema
   |                             8. Create in database
   |                          <- 9. Return created todo
   |
10. Append to todoStore.todos (optimistic update)
   |
11. Re-render TodoItem components with GSAP animation
   |
12. Display in TodoGroup by date (Today/Yesterday/This Week/Older)
```

### State Synchronization via Zustand

```
Action Initiated:
  updateTodo(id, data)
   ↓
Optimistic Update:
  todos.map(t => t.id === id ? updated : t)
   ↓
API Request:
  PUT /api/todo/:id
   ↓
If Success:
  Update state with server response
   ↓
If Error:
  Store could revert to previous state or show error toast
```

---

## Notable Code Implementations

### Password Hashing (Server)

```typescript
// Bun's native bcrypt (production-optimized)
import { password as bcrypt } from "bun";

export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, "bcrypt");
  return hashed;
};

export const comparePassword = async (password: string, hash: string) => {
  const verified = await bcrypt.verify(password, hash, "bcrypt");
  return verified;
};
```

### Theme Persistence & System Preference

```typescript
// Listen to system preference changes
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const handler = (e: MediaQueryListEvent) => {
  const currentTheme = get().theme;
  if (currentTheme === "auto") {
    const newResolvedTheme: ResolvedTheme = e.matches ? "dark" : "light";
    applyTheme(newResolvedTheme);
    set({ resolvedTheme: newResolvedTheme, isDark: e.matches });
  }
};
mediaQuery.addEventListener("change", handler);
```

### Date Grouping Utility

```typescript
export const getDateGroup = (dateStr: string | Date): DateGroup => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return "This Week";
  return "Older";
};
```

### Drag & Drop Integration

```typescript
const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
  useSortable({ id: todo.id });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.4 : 1,
  zIndex: isDragging ? 10 : undefined,
};
```

---

## Development Setup

### Install Dependencies

```bash
# Root level (installs all workspaces)
bun install

# Or specific workspace
bun --cwd packages/backend install
bun --cwd packages/web install
```

### Environment Variables

**Backend (.env):**

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/todo
DIRECT_URL=postgresql://user:password@localhost:5432/todo
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**

```
(Uses hardcoded localhost:5000 in axios config)
```

### Run Development Servers

```bash
# Terminal 1 - Backend
bun --cwd packages/backend dev

# Terminal 2 - Frontend
bun --cwd packages/web dev

# Or both (if your shell supports)
bun --cwd packages/backend dev & bun --cwd packages/web dev
```

### Database Management

```bash
# Generate Prisma client
bun --cwd packages/backend prisma:generate

# Run migrations
bun --cwd packages/backend prisma:migrate

# Open Prisma Studio (visual DB browser)
bun --cwd packages/backend prisma:studio
```

### Build for Production

```bash
# Backend (already TypeScript)
# No build step needed

# Frontend
bun --cwd packages/web build

# Output: dist/ directory ready for deployment
```

---

## Key Design Decisions

1. **Monorepo Structure:** Allows shared types and schemas between frontend and backend without duplication.

2. **Zustand for State:** Lightweight, performance-oriented alternative to Redux; minimal boilerplate.

3. **Zod for Validation:** Runtime schema validation ensures backend validates requests and frontend provides real-time feedback.

4. **JWT in HTTP-Only Cookies:** Balances security (no XSS access to tokens) with convenience (no manual header management).

5. **Prisma with PostgreSQL/SQLite:** Type-safe ORM with automatic migrations; flexibility for SQLite in dev, PostgreSQL in production.

6. **Tailwind CSS with Vite Plugin:** Faster builds, no PostCSS configuration needed; better DX.

7. **Motion + GSAP:** Motion for React component animations, GSAP for complex sequences and fine-grained control.

8. **Date Grouping:** Todos automatically grouped by "Today", "Yesterday", "This Week", "Older" for better UX.

9. **Drag & Drop with dnd-kit:** Composable, headless drag-and-drop library; better accessibility than alternatives.

10. **No Redux/Context API:** Zustand replaces context for smaller object trees; simpler to reason about.

---

## Security Features

- **JWT Tokens:** Signed with secret, 7-day expiration
- **HTTP-Only Cookies:** Not accessible to JavaScript (XSS protection)
- **CORS:** Restricted to frontend URL(s), sameSite=strict
- **Password Hashing:** Bcrypt via Bun (production optimized)
- **Role-Based Access Control:** ADMIN middleware for restricted actions
- **User Isolation:** Users can only access/modify their own todos

---

## Performance Optimizations

- **Code Splitting:** Vite automatically chunks components for lazy loading
- **Tree Shaking:** Unused exports removed in production builds
- **Tailwind JIT:** Only generates CSS for classes actually used
- **Zustand Selectors:** Only re-render on selected state changes
- **Optimistic Updates:** UI updates before server confirmation
- **Drag & Drop:** Using dnd-kit which is optimized for large lists

---

## Future Enhancement Possibilities

1. **Real-Time Sync:** WebSocket integration for collaborative editing
2. **Todo Categories/Tags:** Additional grouping and filtering
3. **Reminders/Notifications:** Email or push notifications for due dates
4. **Recurring Todos:** Support for repeating tasks
5. **Todo Subtasks:** Nested task hierarchy
6. **Bulk Operations:** Select multiple todos for batch operations
7. **Export/Import:** CSV or JSON import/export
8. **Offline Mode:** Service Workers for offline todos
9. **Mobile App:** React Native version
10. **Social Features:** Share todos with other users
