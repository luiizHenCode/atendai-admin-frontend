import { createContext } from "react";

type Theme = "dark" | "light" | "system";

interface IThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext({} as IThemeContext);

export { ThemeContext, type IThemeContext, type Theme };
