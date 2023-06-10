import { Stage, Layer, Rect, Transformer, Image } from "react-konva";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageData } from "./types/types";
import FloatingMenuBar from "./components/FloatingMenuBar";
import Canvas from "./components/canvas/Canvas";

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState<any[]>([]);
  const [selectedId, selectShape] = useState<any>(null);
  const [image, setImage] = useState<ImageData | null>(null);

  const handleDelete = () => {
    if (selectedId) {
      const updatedRectangles = rectangles.filter(
        (rect) => rect.id !== selectedId
      );
      setRectangles(updatedRectangles);
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
  }, []);

  return (
    <div className="fixed left-0 top-0 m-0 h-screen w-screen overflow-hidden bg-background p-0 transition-all duration-300 ease-in dark:bg-dark-background">
      <FloatingMenuBar
        image={image}
        setImage={setImage}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        selectedId={selectedId}
        handleDelete={handleDelete}
      />
      <Canvas
        image={image}
        rectangles={rectangles}
        setRectangles={setRectangles}
        selectedId={selectedId}
        selectShape={selectShape}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
      />
    </div>
  );
}

export default App;
