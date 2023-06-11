import { useEffect, useMemo, useRef, useState } from "react";
import { ShapeLayerProps } from "../../types/types";
import { Rect, Transformer } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

const ShapeLayer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  selectedColor,
}: ShapeLayerProps) => {
  const [node, setNode] = useState<
    Konva.Rect | Konva.Ellipse | Konva.Text | null
  >();
  const trRef = useRef<Konva.Transformer>(null);

  const shapeType = shapeProps.type;

  console.log(shapeType);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: KonvaEventObject<DragEvent>) => {
    if (!node) return;
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
  };

  useEffect(() => {
    if (!trRef.current || !node || !isSelected) return;
    if (isSelected) {
      trRef.current?.nodes([node]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (node && isSelected) {
      node.setAttrs({
        fill: selectedColor,
      });
    }
  }, [isSelected, selectedColor]);

  return (
    <>
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
