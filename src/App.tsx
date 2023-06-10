import { Stage, Layer, Rect, Transformer, Image } from "react-konva";
import DarkModeToggle from "./components/buttons/DarkModeToggle";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DeleteButton from "./components/buttons/DeleteButton";
import { DrawRectangleProps } from "./types/types";

const DrawRectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: DrawRectangleProps) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e: any) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e: any) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(
            oldBox: any,
            newBox: { width: number; height: number }
          ) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};
const ImageLayer = ({ isSelected, onSelect, onChange }: any) => {
  const imageRef = useRef<any>();
  const trRef = useRef<any>();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        onClick={onSelect}
        ref={imageRef}
        draggable
        onDragEnd={(e: any) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e: any) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(
            oldBox: any,
            newBox: { width: number; height: number }
          ) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
      {/* {isSelected && <button onClick={onDelete}>Delete</button>} */}
    </>
    // <Layer>
    //   {rectangles.map((rect: any, index: number) => (
    //     <Rect key={index} {...rect} />
    //   ))}
    // </Layer>
  );
};

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ImageData {
  src: HTMLImageElement;
  position: Position;
  size: Size;
}

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState<any[]>([]);
  const [selectedId, selectShape] = useState(null);
  const [image, setImage] = useState<ImageData | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef();
  const trRef = useRef<any>();

  const fileEl = useRef<HTMLInputElement>(null);
  const [currentRectangle, setCurrentRectangle] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const position = stage.getPointerPosition();
    const newRectangle = {
      x: position.x,
      y: position.y,
      width: 0,
      height: 0,
      fill: "blue",
      draggable: true,
      id: uuidv4(), // Generate a unique ID for each rectangle
    };
    setCurrentRectangle(newRectangle);
    checkDeselect(e);
  };

  const handleMouseUp = () => {
    if (currentRectangle) {
      // Check if the rectangle is valid (width and height are non-zero)
      if (currentRectangle.width !== 0 && currentRectangle.height !== 0) {
        setRectangles((prevRectangles) => [
          ...prevRectangles,
          currentRectangle,
        ]);
      }
      setCurrentRectangle(null);
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: any) => {
    if (isDrawing && currentRectangle) {
      const stage = e.target.getStage();
      const position = stage.getPointerPosition();

      const width = position.x - currentRectangle.x;
      const height = position.y - currentRectangle.y;

      if (width !== 0 && height !== 0) {
        const updatedRectangle = {
          ...currentRectangle,
          width,
          height,
        };

        setCurrentRectangle(updatedRectangle);
      }
    }
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

  const handleImageDragEnd = (e: any) => {
    setImagePosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleImageTransformEnd = (e: any) => {
    const node: any = imageRef.current;
    const scaleX = node?.scaleX();
    const scaleY = node?.scaleY();

    setImageSize({
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  };

  const toggleDrawingMode = () => {
    setIsDrawing(!isDrawing);
  };

  const handleDelete = () => {
    if (selectedId) {
      const updatedRectangles = rectangles.filter(
        (rect) => rect.id !== selectedId
      );
      setRectangles(updatedRectangles);
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
      <div className="fixed bottom-0 left-0 right-0 z-[999] mb-12 flex items-center justify-center space-x-6">
        <DeleteButton onClick={handleDelete} disabled={!selectedId} />
        <div className="flex items-center rounded-full bg-accent p-4 text-text">
          <button onClick={handleUploadImageClick}>Upload Image</button>
          <input
            type="file"
            className="hidden"
            ref={fileEl}
            onChange={handleFileChange}
          />

          <button
            onClick={toggleDrawingMode}
            className="ml-2 rounded-md border-2 border-accent p-2 text-text"
          >
            {isDrawing ? "Stop Drawing" : "Start Drawing"}
          </button>
        </div>
        <DarkModeToggle />
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {image && (
          <Layer>
            <ImageLayer
              image={image.src}
              x={image.position.x}
              y={image.position.y}
              width={image.size.width}
              height={image.size.height}
              // isSelected={rect.id === selectedId}
              onSelect={() => {
                console.log();
                // selectShape(rect.id);
              }}
              onChange={(newAttrs: any) => {
                const rects = rectangles.slice();
                // const index = rects.findIndex((r) => r.id === rect.id);
                // rects[index] = newAttrs;
                setRectangles(rects);
              }}
              // draggable
            />
            {/* <Image
              ref={imageRef}
              onDragEnd={handleImageDragEnd}
              onTransformEnd={handleImageTransformEnd}
            />
            <Transformer ref={trRef} /> */}
          </Layer>
        )}
        <Layer>
          {rectangles.map((rect: any) => (
            <DrawRectangle
              key={rect.id}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs: any) => {
                const rects = rectangles.slice();
                const index = rects.findIndex((r) => r.id === rect.id);
                rects[index] = newAttrs;
                setRectangles(rects);
              }}
              // onDelete={handleDelete}
            />
          ))}
        </Layer>

        <Layer>
          {currentRectangle && (
            <Rect {...currentRectangle} fill="transparent" stroke="blue" />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
