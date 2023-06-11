import { ChangeEventHandler, useRef, useState } from "react";
import DeleteButton from "./buttons/DeleteButton";
import {
  ImagePlus,
  Square,
  Circle,
  Triangle,
  Minus,
  Pencil,
  Type,
} from "lucide-react";
import DarkModeToggle from "./buttons/DarkModeToggle";
import { v4 as uuidv4 } from "uuid";
import { BlockPicker, CirclePicker, SketchPicker } from "react-color";

const FloatingMenuBar = (props: any) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileEl = useRef<HTMLInputElement>(null);

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
  console.log(drawMode);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const shapesButton = [
    { shape: Square, mode: "RECT", size: 24 },
    { shape: Circle, mode: "ELLIPSE", size: 24 },
    { shape: Triangle, mode: "TRIANGLE", size: 24 },
    { shape: Minus, mode: "LINE", size: 26 },
    { shape: Pencil, mode: "PEN", size: 22 },
    { shape: Type, mode: "TYPE", size: 22 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] mb-12 flex items-center justify-center space-x-6">
      <div className="flex items-center rounded-xl bg-background p-1 px-3 text-text drop-shadow-2xl dark:bg-gray-700">
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
        <div
          style={{ backgroundColor: selectedColor }}
          className="rounded-md border-2 border-dark-background p-3 transition-all duration-100 ease-in dark:border-white"
          onClick={toggleColorPicker}
        >
          {showColorPicker && (
            <div className="absolute -bottom-10 -right-44 z-10">
              <BlockPicker
                color={selectedColor}
                onChange={(col) => setSelectedColor(col.hex)}
                triangle="hide"
              />
            </div>
          )}
        </div>
      </div>
      <DarkModeToggle />
    </div>
  );
};

export default FloatingMenuBar;
