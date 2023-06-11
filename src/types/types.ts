export interface Rectangle {
  type: "RECT";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  draggable: boolean;
  id: string;
}
export interface Ellipse {
  type: "ELLIPSE";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill: string;
  draggable: boolean;
  id: string;
}

export type Shape = Rectangle | Ellipse;

export interface ShapeLayerProps {
  shapeProps: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Shape) => void;
  // selectedColor?: string;
  // setSelectedColor?: (color: string) => void;
  drawMode?: string;
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
