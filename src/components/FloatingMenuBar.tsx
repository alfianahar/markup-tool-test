import { ChangeEventHandler, useRef } from "react";
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

const FloatingMenuBar = (props: any) => {
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

  const shapesButton = [
    { shape: Square, mode: "RECT" },
    { shape: Circle, mode: "ELLIPSE" },
    { shape: Triangle, mode: "TRIANGLE" },
    { shape: Minus, mode: "LINE" },
    { shape: Pencil, mode: "PEN" },
    { shape: Type, mode: "Type" },
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
              size={24}
            />
          </div>
        ))}
        {/* <div
          className={`mx-0.5 rounded-xl p-2 transition-all duration-150 ease-in hover:bg-dark-secondary-button hover:dark:bg-secondary-button ${
            isDrawing && drawMode === "ELLIPSE"
              ? "bg-dark-secondary-button dark:bg-secondary-button"
              : ""
          }`}
        >
          <Circle
            onClick={() => toggleDrawingMode("ELLIPSE")}
            color="#4a967a"
            size={24}
          />
        </div> */}
        <input
          key={image?.id}
          type="file"
          className="hidden"
          ref={fileEl}
          onChange={handleFileChange}
        />
      </div>
      <DarkModeToggle />
    </div>
  );
};

export default FloatingMenuBar;
