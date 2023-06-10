// types/types.ts
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  draggable: boolean;
  id: string;
}

export interface DrawRectangleProps {
  shapeProps: Rectangle;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Rectangle) => void;
}
