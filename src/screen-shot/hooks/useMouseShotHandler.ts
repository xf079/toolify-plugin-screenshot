import { useMemoizedFn } from 'ahooks';
import { useContext, useRef } from 'react';
import Konva from 'konva';
import { ShotContext } from '../Context';
import { SHOT_MIN_SIZE } from '../constants.ts';

export const useMouseShotHandler = () => {
  const { state, dispatch } = useContext(ShotContext);
  // 是否开始绘制截图区域
  const isDrawing = useRef(false);
  // 开始绘制的位置
  const start = useRef({ x: 0, y: 0 });

  const onShotMouseDownHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (state.shot) return;
      if (e.evt.button === 0) {
        dispatch({ type: 'SET_MODE', payload: 'shot' });
        isDrawing.current = true;
        start.current = { x: e.evt.layerX, y: e.evt.layerY };
        dispatch({
          type: 'SET_SHOT',
          payload: {
            x: e.evt.layerX,
            y: e.evt.layerY,
            width: 0,
            height: 0
          }
        });
      }
    }
  );

  const onShotMouseMoveHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isDrawing.current) return;
      const endX = e.evt.layerX;
      const endY = e.evt.layerY;
      const width = Math.abs(endX - start.current.x);
      const height = Math.abs(endY - start.current.y);
      dispatch({
        type: 'SET_SHOT',
        payload: {
          x: Math.min(start.current.x, endX),
          y: Math.min(start.current.y, endY),
          width,
          height
        }
      });
    }
  );

  const onShotMouseOutHandler = useMemoizedFn(() => {
    if (isDrawing.current) {
      isDrawing.current = false;
      dispatch({ type: 'SET_MODE', payload: 'shot' });
      // 截图区域太小，取消截图
      if (
        (state.shot!.width || 0) < SHOT_MIN_SIZE ||
        (state.shot!.height || 10) < SHOT_MIN_SIZE
      ) {
        dispatch({ type: 'SET_SHOT', payload: undefined });
      }
    }
  });

  return {
    onShotMouseDownHandler,
    onShotMouseMoveHandler,
    onShotMouseOutHandler
  };
};
