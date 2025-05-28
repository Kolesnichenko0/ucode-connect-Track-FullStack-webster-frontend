export type CanvasObject =
  {
      id: string;
      type: 'rect';
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      cornerRadius?: number;
      stroke?: string;
      strokeWidth?: number;
      dash?: number[];
      opacity?: number;
  }
  | {
    id: string;
      type: 'circle' | 'star' | 'triangle';
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      dash?: number[];
      opacity?: number;
  }
  | {
      id: string;
      type: 'line' | 'curve-line' | 'arrow';
      x: number;
      y: number;
      width: number;
      height: number;
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
      dash?: number[];
      opacity?: number;
    }
  | {
      id: string;
      type: 'text';
      x: number;
      y: number;
      text: string;
      fontSize: number;
      fill: string;
      opacity?: number;
    }
  | {
      id: string;
      type: 'image';
      x: number;
      y: number;
      src: string;
      opacity?: number;
    };