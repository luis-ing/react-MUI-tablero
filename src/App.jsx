import { useState, createContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme';
import { Box } from '@mui/material';
import Main from './Router/Main.Router';

const AuthContext = createContext(null);

const App = () => {
  const [themeMode, setThemeMode] = useState(true);
  const [Auth, setAuth] = useState(localStorage.getItem("Auth") ? JSON.parse(localStorage.getItem("Auth")) : null);

  const changeThemeMode = () => {
    setThemeMode(!themeMode);
  }
  // console.log("themeMode ", themeMode);
  const data = { Auth, setAuth, themeMode, setThemeMode, changeThemeMode };
  return (
    <AuthContext.Provider value={data}>
      <ThemeProvider theme={themeMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box>
          <Main />
        </Box>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
export { AuthContext };
export default App;
