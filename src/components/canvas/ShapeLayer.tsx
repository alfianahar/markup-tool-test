import { useEffect, useMemo, useRef, useState } from "react";
import { ShapeLayerProps } from "../../types/types";
import { Ellipse, Rect, Transformer } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

const ShapeLayer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: // selectedColor,
// setSelectedColor,
ShapeLayerProps) => {
  const [node, setNode] = useState<
    Konva.Rect | Konva.Ellipse | Konva.Text | null
  >();
  const trRef = useRef<Konva.Transformer>(null);
  const shapeType = shapeProps.type;
  // const prevSelectedColor = useRef<string | undefined>(selectedColor);

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

  // useEffect(() => {
  //   if (!isSelected) {
  //     prevSelectedColor.current = selectedColor;
  //   }
  // }, [selectedColor, isSelected]);

  // useEffect(() => {
  //   if (
  //     node &&
  //     isSelected &&
  //     selectedColor &&
  //     prevSelectedColor.current !== selectedColor
  //   ) {
  //     node.setAttrs({
  //       fill: selectedColor,
  //     });
  //   }
  // }, [node, isSelected, selectedColor, setSelectedColor]);
  // console.log(shapeProps);
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
