import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useEffect, type ReactNode } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ThemeContext, type Theme } from "./theme-context";

interface IThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

function ThemeProvider({
  children,
  defaultTheme = "dark", // Tema escuro por padrão
  storageKey = STORAGE_KEYS.THEME,
}: IThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>(storageKey, defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const contextValue = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider };
