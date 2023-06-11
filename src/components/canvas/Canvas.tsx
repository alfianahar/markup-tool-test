import { useEffect, useState } from "react";
import { Ellipse, Layer, Line, Rect, RegularPolygon, Stage } from "react-konva";
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
  const [currentTriangle, setCurrentTriangle] = useState<{
    x: number;
    y: number;
    sides: number;
    radius: number;
  } | null>(null);
  const [currentLine, setCurrentLine] = useState<{
    x: number;
    y: number;
    points: number[];
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
    selectedColor,
    setSelectedColor,
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
    if (
      isDrawing &&
      (drawMode === "RECT" ||
        drawMode === "ELLIPSE" ||
        drawMode === "TRIANGLE" ||
        drawMode === "LINE")
    ) {
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
      } else if (drawMode === "TRIANGLE") {
        const newTriangle = {
          ...newShape,
          sides: 3,
          radius: 0,
        };
        setCurrentTriangle(newTriangle);
      } else if (drawMode === "LINE") {
        const newLine = {
          ...newShape,
          points: [],
          stroke: selectedColor,
          strokeWidth: 4,
        };
        setCurrentLine(newLine);
      }
    }
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
    if (currentTriangle) {
      if (currentTriangle.radius !== 0) {
        setItems((prevTriangle: Shape[]) => [...prevTriangle, currentTriangle]);
      }
      setCurrentTriangle(null);
      setIsDrawing(false);
    }
    if (currentLine) {
      if (
        currentLine.points[2] !== currentLine.points[0] &&
        currentLine.points[3] !== currentLine.points[1]
      ) {
        setItems((prevLine: Shape[]) => [...prevLine, currentLine]);
      }
      setCurrentLine(null);
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
      if (drawMode === "TRIANGLE" && currentTriangle) {
        const width = position.x - currentTriangle.x;
        const height = position.y - currentTriangle.y;
        const updatedTriangle = {
          ...currentTriangle,
          radius: Math.max(width, height) * 1.15,
        };
        setCurrentTriangle(updatedTriangle);
      }
      if (drawMode === "LINE" && currentLine) {
        const width = position.x - currentLine.x;
        const height = position.y - currentLine.y;
        const updatedLine = {
          ...currentLine,
          points: [0, 0, width, height],
          width: width,
          height: height,
        };
        setCurrentLine(updatedLine);
      }
    }
  };

  useEffect(() => {
    const index = items.findIndex((r: Shape) => r.id === selectedId);
    if (index !== -1 && items[index].fill !== selectedColor) {
      const updatedItems = [...items];
      updatedItems[index].fill = selectedColor;
      updatedItems[index].stroke = selectedColor;
      setItems(updatedItems);
    }
  }, [selectedId, selectedColor, items]);

  console.log(items);

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
              shape.type === "LINE"
                ? setSelectedColor(shape.stroke)
                : setSelectedColor(shape.fill);
            }}
            onChange={(newAttrs: Shape) => {
              const shapes = items.slice();
              const index = shapes.findIndex((r: Shape) => r.id === shape.id);
              shapes[index] = newAttrs;
              setItems(shapes);
            }}
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
        {currentTriangle && (
          <RegularPolygon
            {...currentTriangle}
            fill="transparent"
            stroke={selectedColor}
          />
        )}
        {currentLine && (
          <Line {...currentLine} fill="transparent" stroke={selectedColor} />
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;
