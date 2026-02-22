import {
  AuthProvider,
  SettingsProvider,
  ThemeProvider,
  Router,
} from "./components";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <Router />
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
