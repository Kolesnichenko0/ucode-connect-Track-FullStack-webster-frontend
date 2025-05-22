export type CanvasObject =
  | {
      id: string;
      type: 'rect';
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
    }
  | {
      id: string;
      type: 'text';
      x: number;
      y: number;
      text: string;
      fontSize: number;
      fill: string;
    }
  | {
      id: string;
      type: 'image';
      x: number;
      y: number;
      src: string;
    };