import Konva from 'konva';
import { useMemo, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { SHOT_MIN_SIZE } from '../constants.ts';

export interface IActionHandleOptions {
  action?: ISelectToolOptionType;
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
  const [list, setList] = useState<IShapeType[]>([]);
  const [current, setCurrent] = useState<IShapeType>();

  const shapes = useMemo<IShapeType[]>(
    () => (current ? [...list, current] : list),
    [list, current]
  );

  const onActionMouseDownHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.which === 1) {
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
            && options.action
          ) {
            isDrawing.current = true;
            // 点击在截图区域内
            mode.current = 'figure';
            start.current = { x: e.evt.layerX, y: e.evt.layerY };
            setCurrent({ ...options.action, ...start.current });
          }
        }
      } else {
        setCurrent(undefined);
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
          if(current){
            setCurrent({ ...current, endX, endY });
          }
        }
      }
    }
  );

  const onActionMouseUpHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      console.log('out');
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
        if (mode.current === 'figure' && current) {
          setList(list.concat(current));
          setCurrent(undefined);
        }

        mode.current = undefined;
      }
    }
  );

  return {
    isDrawing,
    shotRect,
    shapes,
    updateShotRect,
    onActionMouseDownHandler,
    onActionMouseMoveHandler,
    onActionMouseUpHandler
  };
};
