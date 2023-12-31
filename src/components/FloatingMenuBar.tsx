import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import DeleteButton from "./buttons/DeleteButton";
import {
  ImagePlus,
  Square,
  Circle,
  Triangle,
  Minus,
  Pencil,
  Type,
  Info,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { BlockPicker } from "react-color";

const FloatingMenuBar = (props: any) => {
  const {
    image,
    setImage,
    isDrawing,
    setIsDrawing,
    selectedId,
    handleDelete,
    drawMode,
    setDrawMode,
    selectedColor,
    setSelectedColor,
  } = props;

  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileEl = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shapesButton = [
    { shape: Square, mode: "RECT", size: 24 },
    { shape: Circle, mode: "ELLIPSE", size: 24 },
    { shape: Triangle, mode: "TRIANGLE", size: 24 },
    { shape: Minus, mode: "LINE", size: 26 },
    { shape: Pencil, mode: "PEN", size: 22 },
    { shape: Type, mode: "TEXT", size: 22 },
  ];

  const toggleDrawingMode = (e: string) => {
    if (!isDrawing) {
      setIsDrawing(!isDrawing);
    }
    setDrawMode(e);
  };

  const handleUploadImageClick = () => {
    fileEl.current?.click();
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || e.target.files.length <= 0) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageElement = new window.Image();
      imageElement.src = reader.result as string;
      imageElement.addEventListener("load", () => {
        setImage({
          id: uuidv4(),
          src: imageElement,
          position: {
            x: window.innerWidth / 2 - imageElement.width / 4,
            y: window.innerHeight / 2 - imageElement.height / 4,
          },
          size: {
            width: imageElement.width / 2,
            height: imageElement.height / 2,
          },
        });
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (containerRef.current && !containerRef.current.contains(target)) {
      setShowColorPicker(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="  absolute left-2/4 top-0 z-[999] mt-5 flex -translate-x-2/4 flex-col items-center justify-center space-x-6">
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center rounded-xl bg-background p-1 px-3 text-text drop-shadow-xl dark:bg-gray-700 dark:shadow-xl dark:shadow-accent/30">
          <DeleteButton onClick={handleDelete} disabled={!selectedId} />
          <span className="ml-4 mr-2 h-6 border border-accent"></span>
          <div className="mx-0.5 rounded-xl p-2 transition-all duration-150 ease-in hover:bg-dark-secondary-button hover:dark:bg-secondary-button">
            <ImagePlus
              onClick={handleUploadImageClick}
              color="#4a967a"
              size={24}
            />
          </div>
          {shapesButton.map((el: any) => (
            <div
              key={el.mode}
              className={`mx-0.5 rounded-xl p-2 transition-all duration-100 ease-in hover:bg-dark-secondary-button hover:dark:bg-secondary-button ${
                isDrawing && drawMode === el.mode
                  ? "bg-dark-secondary-button dark:bg-secondary-button"
                  : ""
              }`}
            >
              <el.shape
                onClick={() => toggleDrawingMode(el.mode)}
                color="#4a967a"
                size={el.size}
              />
            </div>
          ))}
          <input
            key={image?.id}
            type="file"
            className="hidden"
            ref={fileEl}
            onChange={handleFileChange}
          />
          <span className="ml-2 mr-4 h-6 border border-accent"></span>
          <div ref={containerRef}>
            <div
              style={{ backgroundColor: selectedColor }}
              className="rounded-md border-2 border-dark-background p-3 transition-all duration-100 ease-in dark:border-white"
              onClick={toggleColorPicker}
            ></div>
            {showColorPicker && (
              <div className="absolute -right-[3.75rem] z-10 mt-4">
                <BlockPicker
                  color={selectedColor}
                  onChange={(col) => setSelectedColor(col.hex)}
                  triangle="top"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isDrawing && (drawMode === "RECT" || drawMode === "ELLIPSE") && (
        <div className="mt-4 flex items-center space-x-2 text-xs text-text/80 dark:text-white/40">
          <Info size={20} />
          <p className="font-mono ">
            Press SHIFT when drawing to make it in{" "}
            {drawMode === "RECT" ? "SQUARE" : "CIRCLE"} shape
          </p>
        </div>
      )}
    </div>
  );
};

export default FloatingMenuBar;
