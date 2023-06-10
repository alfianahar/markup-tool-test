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

export interface RectangleLayerProps {
  shapeProps: Rectangle;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Rectangle) => void;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ImageData {
  id: string;
  src: HTMLImageElement;
  position: Position;
  size: Size;
}
