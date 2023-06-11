import { useEffect, useMemo, useRef, useState } from "react";
import { ShapeLayerProps } from "../../types/types";
import { Ellipse, Line, Rect, RegularPolygon, Transformer } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

const ShapeLayer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: ShapeLayerProps) => {
  const [node, setNode] = useState<
    Konva.Rect | Konva.Ellipse | Konva.RegularPolygon | Konva.Line | null
  >();
  const trRef = useRef<Konva.Transformer>(null);
  const shapeType = shapeProps.type;

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);
    const [width, height] = [scaleX * node.width(), scaleY * node.height()];

    // FOR LINE AND PEN TOOL RESIZER
    let scaledPoints;
    if (shapeType === "LINE" || shapeType === "PEN") {
      const points = node.attrs.points;
      scaledPoints = points.map((point: number, index: number) => {
        if (index % 2 === 0) {
          // X coordinate
          return point * scaleX;
        } else {
          // Y coordinate
          return point * scaleY;
        }
      });
    }

    onChange({
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      ...(shapeType === "RECT" && {
        width: width,
        height: height,
      }),
      ...(shapeType === "ELLIPSE" && {
        radiusX: Math.floor(width / 2),
        radiusY: Math.floor(height / 2),
      }),
      ...(shapeType === "TRIANGLE" && {
        radius: (node.width() / 2) * scaleX,
      }),
      ...((shapeType === "LINE" || shapeType === "PEN") && {
        x: node.x(),
        y: node.y(),
        points: scaledPoints, // Update the points of the line
        width: width,
        height: height,
      }),
    });
  };

  useEffect(() => {
    if (!trRef.current || !node || !isSelected) return;
    if (isSelected) {
      trRef.current?.nodes([node]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      {shapeType === "RECT" && (
        <Rect
          onClick={onSelect}
          ref={(node) => {
            setNode(node);
          }}
          {...shapeProps}
          draggable
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
      )}
      {shapeType === "ELLIPSE" && (
        <Ellipse
          onClick={onSelect}
          ref={(ref) => {
            setNode(ref);
          }}
          {...shapeProps}
          draggable
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
      )}
      {shapeType === "TRIANGLE" && (
        <RegularPolygon
          onClick={onSelect}
          ref={(ref) => {
            setNode(ref);
          }}
          {...shapeProps}
          draggable
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
      )}
      {(shapeType === "LINE" || shapeType === "PEN") && (
        <Line
          onClick={onSelect}
          ref={(ref) => {
            setNode(ref);
          }}
          {...shapeProps}
          draggable
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
      )}
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

export default ShapeLayer;
