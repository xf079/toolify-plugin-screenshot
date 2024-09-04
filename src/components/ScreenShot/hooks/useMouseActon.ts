import Konva from 'konva';
import { useMemo, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { SHOT_MIN_SIZE } from '../constants';

export interface IActionHandleOptions {
  action?: string;
  onMouseDownCallback?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMoveCallback?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseUpCallback?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

export const useMouseActon = (options: IActionHandleOptions) => {
  // 是否开始绘制截图区域
  const isDrawing = useRef(false);
  // 开始绘制的位置
  const start = useRef({ x: 0, y: 0 });
  /**
   * 操作类型
   */
  const mode = useRef<'shot' | 'figure' | undefined>();
  // 截图区域
  const [shotRect, updateShotRect] = useState<Konva.NodeConfig>();

  const [shapes, setShapes] = useState<Konva.NodeConfig[]>([]);

  const [currentFigure, setCurrentFigure] = useState<Konva.NodeConfig>();

  const figures = useMemo<Konva.NodeConfig[]>(
    () => (currentFigure ? [...shapes, currentFigure] : []),
    [shapes, currentFigure]
  );

  const onActionMouseDownHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      options?.onMouseDownCallback?.(e);
      if (!shotRect) {
        isDrawing.current = true;
        start.current = { x: e.evt.layerX, y: e.evt.layerY };
        mode.current = 'shot';
        updateShotRect({
          x: e.evt.layerX,
          y: e.evt.layerY,
          width: 0,
          height: 0
        });
      } else if (options.action) {
        // 判断点击位置是否在截图区域内
        const x = e.evt.layerX;
        const y = e.evt.layerY;
        const { x: rectX, y: rectY, width, height } = shotRect;
        if (
          x >= rectX! &&
          x <= rectX! + width! &&
          y >= rectY! &&
          y <= rectY! + height!
        ) {
          isDrawing.current = true;
          // 点击在截图区域内
          mode.current = 'figure';
          start.current = { x: e.evt.layerX, y: e.evt.layerY };
          switch (options.action) {
            case 'Delete':
              setCurrentFigure(undefined);
              break;
            default:
              break;
          }
        }
      }
    }
  );

  const onActionMouseMoveHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      options?.onMouseMoveCallback?.(e);
      if (isDrawing.current) {
        if (mode.current === 'shot') {
          const endX = e.evt.layerX;
          const endY = e.evt.layerY;
          const width = Math.abs(endX - start.current.x);
          const height = Math.abs(endY - start.current.y);
          updateShotRect({
            x: Math.min(start.current.x, endX),
            y: Math.min(start.current.y, endY),
            width,
            height
          });
        } else if (mode.current === 'figure') {
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
      }
    }
  );

  const onActionMouseUpHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      options?.onMouseUpCallback?.(e);
      if (isDrawing.current) {
        isDrawing.current = false;
        // 截图区域太小，取消截图
        if (mode.current === 'shot') {
          if (
            (shotRect!.width || 0) < SHOT_MIN_SIZE ||
            (shotRect!.height || 10) < SHOT_MIN_SIZE
          ) {
            updateShotRect(undefined);
          }
        }
        if (mode.current === 'figure' && currentFigure) {
          setShapes(shapes.concat(currentFigure));
          setCurrentFigure(undefined);
        }

        mode.current = undefined;
      }
    }
  );

  return {
    isDrawing,
    shotRect,
    updateShotRect,
    onActionMouseDownHandler,
    onActionMouseMoveHandler,
    onActionMouseUpHandler,
    figures
  };
};
