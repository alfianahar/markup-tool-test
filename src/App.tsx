import { useEffect, useState } from "react";
import { ImageData } from "./types/types";
import FloatingMenuBar from "./components/FloatingMenuBar";
import Canvas from "./components/canvas/Canvas";
import DarkModeToggle from "./components/buttons/DarkModeToggle";

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, selectShape] = useState<any>(null);
  const [image, setImage] = useState<ImageData | null>(null);
  const [selectedColor, setSelectedColor] = useState("#4a8c96");

  const handleDelete = () => {
    if (selectedId) {
      const updatedItems = items.filter((item) => item.id !== selectedId);
      setItems(updatedItems);
      if (image?.id === selectedId) {
        setImage(null);
      }
      selectShape(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedId) {
        handleDelete();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId]);

  return (
    <div className="fixed left-0 top-0 m-0 h-screen w-screen overflow-hidden bg-background p-0 transition-all duration-300 ease-in dark:bg-dark-background">
      <FloatingMenuBar
        image={image}
        setImage={setImage}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        selectedId={selectedId}
        handleDelete={handleDelete}
        drawMode={drawMode}
        setDrawMode={setDrawMode}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      <DarkModeToggle />

      <Canvas
        image={image}
        items={items}
        setItems={setItems}
        selectedId={selectedId}
        selectShape={selectShape}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        drawMode={drawMode}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
    </div>
  );
}

export default App;
