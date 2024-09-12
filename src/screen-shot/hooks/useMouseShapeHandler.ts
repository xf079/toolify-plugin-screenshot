import Konva from 'konva';
import { useContext, useMemo, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { ShotContext } from '../Context.tsx';

export const useMouseShapeHandler = () => {
  const { state, dispatch } = useContext(ShotContext);
  // 是否开始绘制截图区域
  const isDrawing = useRef(false);
  // 开始绘制的位置
  const start = useRef({ x: 0, y: 0 });

  const [list, setList] = useState<IShapeType[]>([]);
  const [current, setCurrent] = useState<IShapeType>();

  const shapes = useMemo<IShapeType[]>(
    () => (current ? [...list, current] : list),
    [list, current]
  );

  const onShapeMouseDownHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button === 0 && state.shot) {
        // 判断点击位置是否在截图区域内
        const x = e.evt.layerX;
        const y = e.evt.layerY;
        const { x: rectX, y: rectY, width, height } = state.shot;
        if (
          x >= rectX! &&
          x <= rectX! + width! &&
          y >= rectY! &&
          y <= rectY! + height! &&
          state.action
        ) {
          isDrawing.current = true;
          start.current = { x: e.evt.layerX, y: e.evt.layerY };
          setCurrent({ ...state.action, ...start.current });
        }
      }
    }
  );

  const onShapeMouseMoveHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isDrawing.current) {
        const endX = e.evt.layerX;
        const endY = e.evt.layerY;
        if (current) {
          setCurrent({ ...current, endX, endY });
        }
      }
    }
  );

  const onShapeMouseUpHandler = useMemoizedFn(() => {
    if (isDrawing.current && current) {
      isDrawing.current = false;
      setList(list.concat(current));
      setCurrent(undefined);
    }
  });

  return {
    isDrawing,
    shapes,
    onShapeMouseDownHandler,
    onShapeMouseMoveHandler,
    onShapeMouseUpHandler
  };
};
