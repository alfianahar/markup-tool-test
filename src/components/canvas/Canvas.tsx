import { useState } from "react";
import { Ellipse, Layer, Rect, Stage } from "react-konva";
import ImageLayer from "./ImageLayer";
import { ImageData, Shape } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import Konva from "konva";
import ShapeLayer from "./ShapeLayer";

const Canvas = (props: any) => {
  const [currentRectangle, setCurrentRectangle] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [currentEllipse, setCurrentEllipse] = useState<{
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
  } | null>(null);

  const {
    image,
    items,
    setItems,
    selectedId,
    selectShape,
    isDrawing,
    setIsDrawing,
    drawMode,
    setDrawMode,
    selectedColor,
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
    if (drawMode === "RECT" || drawMode === "ELLIPSE") {
      const newShape = {
        type: drawMode,
        x: position.x,
        y: position.y,
        fill: selectedColor,
        draggable: true,
        id: uuidv4(),
      };
      if (drawMode === "RECT") {
        const newRectangle = {
          ...newShape,
          width: 0,
          height: 0,
        };
        setCurrentRectangle(newRectangle);
      } else if (drawMode === "ELLIPSE") {
        const newEllipse = {
          ...newShape,
          radiusX: 0,
          radiusY: 0,
        };
        setCurrentEllipse(newEllipse);
      }
    }
    // if (drawMode === "RECT") {
    //   const newRectangle = {
    //     x: position.x,
    //     y: position.y,
    //     width: 0,
    //     height: 0,
    //     fill: selectedColor,
    //     draggable: true,
    //     id: uuidv4(), // Generate a unique ID for each rectangle
    //   };
    //   setCurrentRectangle(newRectangle);
    // }
    // if (drawMode === "ELLIPSE") {
    //   const newEllipse = {
    //     x: position.x,
    //     y: position.y,
    //     radiusX: 0,
    //     radiusY: 0,
    //     fill: selectedColor,
    //     draggable: true,
    //     id: uuidv4(),
    //   };
    //   setCurrentEllipse(newEllipse);
    // }
    checkDeselect(e);
  };

  const handleMouseUp = () => {
    if (currentRectangle) {
      if (currentRectangle.width !== 0 && currentRectangle.height !== 0) {
        setItems((prevRectangles: Shape[]) => [
          ...prevRectangles,
          currentRectangle,
        ]);
      }
      setCurrentRectangle(null);
      setIsDrawing(false);
    }
    if (currentEllipse) {
      if (currentEllipse.radiusX !== 0 && currentEllipse.radiusY !== 0) {
        setItems((prevEllipses: Shape[]) => [...prevEllipses, currentEllipse]);
      }
      setCurrentEllipse(null);
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Check if the SHIFT key is pressed
    const isShiftPressed = e.evt.shiftKey;
    if (isDrawing) {
      const position = e.target.getStage()?.getPointerPosition();
      if (!position) return;
      if (drawMode === "RECT" && currentRectangle) {
        const width = position.x - currentRectangle.x;
        const height = position.y - currentRectangle.y;
        const updatedRectangle = {
          ...currentRectangle,
          width: isShiftPressed ? Math.min(width, height) : width,
          height: isShiftPressed ? Math.min(width, height) : height,
        };
        setCurrentRectangle(updatedRectangle);
      }
      if (drawMode === "ELLIPSE" && currentEllipse) {
        const radiusX = Math.abs(position.x - currentEllipse.x);
        const radiusY = Math.abs(position.y - currentEllipse.y);
        const updatedEllipse = {
          ...currentEllipse,
          radiusX: isShiftPressed ? Math.min(radiusX, radiusY) : radiusX,
          radiusY: isShiftPressed ? Math.min(radiusX, radiusY) : radiusY,
        };
        setCurrentEllipse(updatedEllipse);
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
              const img = items.slice();
              const index = img.findIndex((r: ImageData) => r.id === image.id);
              img[index] = newAttrs;
              setItems(img);
            }}
          />
        </Layer>
      )}
      <Layer>
        {items.map((shape: Shape) => (
          <ShapeLayer
            key={shape.id}
            shapeProps={shape}
            isSelected={shape.id === selectedId}
            onSelect={() => {
              selectShape(shape.id);
            }}
            onChange={(newAttrs: Shape) => {
              const rects = items.slice();
              const index = rects.findIndex((r: Shape) => r.id === shape.id);
              rects[index] = newAttrs;
              setItems(rects);
            }}
            selectedColor={selectedColor}
            drawMode={drawMode}
          />
        ))}
      </Layer>

      <Layer>
        {currentRectangle && (
          <Rect
            {...currentRectangle}
            fill="transparent"
            stroke={selectedColor}
          />
        )}
        {currentEllipse && (
          <Ellipse
            {...currentEllipse}
            fill="transparent"
            stroke={selectedColor}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;
