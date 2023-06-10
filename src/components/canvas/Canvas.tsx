import { ChangeEventHandler, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import RectangleLayer from "./RectangleLayer";
import ImageLayer from "./ImageLayer";
import { ImageData, Rectangle } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import Konva from "konva";

const Canvas = (props: any) => {
  const [currentRectangle, setCurrentRectangle] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const {
    image,
    rectangles,
    setRectangles,
    selectedId,
    selectShape,
    isDrawing,
    setIsDrawing,
  } = props;

  const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const position = e.target.getStage()?.getPointerPosition();
    if (!position) return;
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
        setRectangles((prevRectangles: Rectangle[]) => [
          ...prevRectangles,
          currentRectangle,
        ]);
      }
      setCurrentRectangle(null);
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isDrawing && currentRectangle) {
      const position = e.target.getStage()?.getPointerPosition();
      if (!position) return;
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

  return (
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
            image={image}
            isSelected={image.id === selectedId}
            onSelect={() => {
              selectShape(image.id);
            }}
            onChange={(newAttrs: any) => {
              const img = rectangles.slice();
              const index = img.findIndex((r: ImageData) => r.id === image.id);
              img[index] = newAttrs;
              setRectangles(img);
            }}
          />
        </Layer>
      )}
      <Layer>
        {rectangles.map((rect: any) => (
          <RectangleLayer
            key={rect.id}
            shapeProps={rect}
            isSelected={rect.id === selectedId}
            onSelect={() => {
              selectShape(rect.id);
            }}
            onChange={(newAttrs: any) => {
              const rects = rectangles.slice();
              const index = rects.findIndex((r: Rectangle) => r.id === rect.id);
              rects[index] = newAttrs;
              setRectangles(rects);
            }}
          />
        ))}
      </Layer>

      <Layer>
        {currentRectangle && (
          <Rect {...currentRectangle} fill="transparent" stroke="blue" />
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;
