import { useEffect, useMemo, useRef, useState } from "react";
import { ShapeLayerProps } from "../../types/types";
import { Ellipse, Rect, RegularPolygon, Transformer } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

const ShapeLayer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: ShapeLayerProps) => {
  const [node, setNode] = useState<
    Konva.Rect | Konva.Ellipse | Konva.RegularPolygon | null
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
    console.log(node);
    onChange({
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      // set minimal value
      ...(shapeType === "RECT" && {
        width: width,
        height: height,
      }),
      ...(shapeType === "ELLIPSE" && {
        radiusX: Math.floor(width / 2),
        radiusY: Math.floor(height / 2),
      }),
      ...(shapeType === "TRIANGLE" && {
        // radius:
        //   Math.max(scaleX, scaleY) * Math.max(node.width(), node.height()),
        radius: (node.width() / 2) * scaleX,
        // height: height,
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
          fill={shapeProps.fill}
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
          fill={shapeProps.fill}
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
