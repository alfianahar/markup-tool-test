import { useState } from "react";
import { useDarkSide } from "../../hooks/useDarkSide";
import { DarkModeSwitch } from "react-toggle-dark-mode";

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
    <div className="absolute right-10 z-[999] mt-5 rounded-full border-2 border-dark-background bg-background p-3 drop-shadow-xl transition-all duration-200 dark:border-background dark:bg-dark-background dark:bg-gray-700 dark:shadow-xl dark:shadow-accent/30">
      <DarkModeSwitch
        // style={{ marginBottom: "2rem" }}
        checked={darkSide}
        onChange={toggleDarkMode}
        size={24}
      />
    </div>
  );
};

export default DarkModeToggle;
