import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef } from "react";
import { Image, Transformer } from "react-konva";

const ImageLayer = ({ isSelected, onSelect, onChange, image }: any) => {
  const imageRef = useRef<Konva.Image>();
  const trRef = useRef<Konva.Transformer>(null);
  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([imageRef.current!]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    // <></>
    <>
      <Image
        onClick={onSelect}
        image={image.src}
        x={image.position.x}
        y={image.position.y}
        width={image.size.width}
        height={image.size.height}
        draggable
        ref={imageRef as React.RefObject<Konva.Image>}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e: KonvaEventObject<DragEvent>) => {
          const node = imageRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

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
  );
};

export default ImageLayer;
