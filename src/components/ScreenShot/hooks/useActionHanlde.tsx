import Konva from 'konva';
import { useMemo, useRef, useState } from 'react';

export interface IActionHandleOptions {
  action?: string;
  shotRect?: Konva.NodeConfig;
}

export const useActionHandle = (options: IActionHandleOptions) => {
  const [currentFigure, setCurrentFigure] = useState<Konva.NodeConfig>();
  // 是否开始绘制截图区域
  const isDrawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const figures = useMemo(() => {
    const list: Konva.NodeConfig[] = [];
    if (currentFigure) {
      list.push(currentFigure);
    }
    return list;
  }, [currentFigure]);

  const onActionMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (options.action) {
      isDrawing.current = true;
      const x = e.evt.layerX;
      const y = e.evt.layerY;
      start.current = { x, y };
      switch (options.action) {
        case 'Rect':
          setCurrentFigure({ x, y, width: 0, height: 0 });
          break;
        default:
          break;
      }
    }
  };

  const onActionMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log(isDrawing.current);
    if (isDrawing.current && options.action) {
      const endX = e.evt.layerX;
      const endY = e.evt.layerY;
      const width = Math.abs(endX - start.current.x);
      const height = Math.abs(endY - start.current.y);
      switch (options.action) {
        case 'Rect':
          setCurrentFigure({
            x: Math.min(start.current.x, endX),
            y: Math.min(start.current.y, endY),
            width,
            height
          });
          break;
      }
    }
  };

  const onActionMouseUp = () => {
    console.log('mouseup');
    isDrawing.current = false;
  };

  return {
    onActionMouseDown,
    onActionMouseMove,
    onActionMouseUp,
    figures
  };
};
