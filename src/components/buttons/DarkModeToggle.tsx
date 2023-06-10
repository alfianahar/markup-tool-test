import { useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useDarkSide } from "../../hooks/useDarkSide";

const DarkModeToggle = () => {
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  const toggleDarkMode = (checked: boolean) => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  return (
    <div className="fixed right-20 rounded-full border-2 border-dark-background bg-background p-3 transition-all duration-200 dark:border-background dark:bg-dark-background">
      <DarkModeSwitch
        // style={{ marginBottom: "2rem" }}
        checked={darkSide}
        onChange={toggleDarkMode}
        size={30}
      />
    </div>
  );
};

export default DarkModeToggle;
