import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Layer, Rect, Stage, Transformer } from 'react-konva';
import { useMemoizedFn } from 'ahooks';
import Konva from 'konva';
import { Box } from 'konva/lib/shapes/Transformer';
import { ShotToolsContainer } from './ShotToolsContainer';

import BgImage from '../../assets/bg2.webp';
import { SHOT_MIN_SIZE } from './constants';
import { ShotRectContainer } from './ShotRectContainer.tsx';
import { useMouseActon } from './hooks/useMouseActon';
import { useMousePreviewColor } from './hooks/useMousePreviewColor';
import { MousePreviewRect } from './MousePreviewRect.tsx';

export interface ScreenShotProps {
  width: number;
  height: number;
  primaryColor?: string;
}

const ScreenShot: FC<ScreenShotProps> = ({
  width,
  height,
  primaryColor = '#4096ff'
}) => {
  const image = useRef(new window.Image());
  const mouseImageData = useRef(new window.Image());
  // 是否开始绘制截图区域
  const isDrawing = useRef(false);
  // 开始绘制截图区域的起点
  const start = useRef({ x: 0, y: 0 });
  // 是否正在拖动截图区域
  const [isDragMove, setIsDragMove] = useState(false);
  // 截图区域
  const [shotRect, setShotRect] = useState<Konva.NodeConfig>();
  // 区域圆角
  const [shotRadius, setShotRadius] = useState(10);
  // 是否显示阴影
  const [showShadow, setShowShadow] = useState(false);

  // 当前操作
  const [currentAction, setCurrentAction] = useState<string>();

  const shotRef = useRef<Konva.Rect>(null);
  const shotTrRef = useRef<Konva.Transformer>(null);

  const toolsRect = useMemo(() => {
    if (!shotRect) return { x: 0, y: 0 };
    const shotH = shotRect.height || 0;
    const shotW = shotRect.width || 0;
    const shotY = shotRect.y || 0;
    const shotX = shotRect.x || 0;

    const isFooter = height - (shotY + shotH) > 44;
    const isTop = shotY > 44;
    let toolsY = isFooter ? shotY + shotH : shotY - 44;
    if (isFooter) {
      toolsY = shotY + shotH + 8;
    } else if (isTop) {
      toolsY = shotY - 44 - 8;
    }

    const toolsX = shotW + shotX > 458 ? shotX + shotW - 458 : shotX;

    return {
      y: toolsY,
      x: toolsX
    };
  }, [height, shotRect]);

  const { figures, onActionMouseDown, onActionMouseMove, onActionMouseUp } =
    useMouseActon({
      action: currentAction,
      shotRect
    });

  const { pos, colorState, previewImage, onMouseMoveHandle } =
    useMousePreviewColor(width, height);

  /**
   * 开始绘制截图区域
   * @param e
   */
  const handleDragStart = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (shotRect) return;
    isDrawing.current = true;
    start.current = { x: e.evt.layerX, y: e.evt.layerY };
    setShotRect({
      x: e.evt.layerX,
      y: e.evt.layerY,
      width: 0,
      height: 0
    });
  };

  /**
   * 绘制截图区域
   * @param e
   */
  const handleDragMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isDrawing.current) {
      const endX = e.evt.layerX;
      const endY = e.evt.layerY;
      const width = Math.abs(endX - start.current.x);
      const height = Math.abs(endY - start.current.y);
      setShotRect({
        x: Math.min(start.current.x, endX),
        y: Math.min(start.current.y, endY),
        width,
        height
      });
    } else {
      if (!shotRect) {
        const stage = e.target.getStage();
        if (!stage) return;
        onMouseMoveHandle(stage);
      }
    }
  };

  /**
   * 结束绘制截图区域
   */
  const handleDragEnd = useMemoizedFn(() => {
    if (!shotRect) return;
    isDrawing.current = false;
    if (
      (shotRect.width || 0) < SHOT_MIN_SIZE ||
      (shotRect.height || 10) < SHOT_MIN_SIZE
    ) {
      setShotRect(undefined);
    } else {
      /**
       * 截图区域绘制完成
       * 将截图区域设置为可拖动
       */
      setIsDragMove(true);
    }
  });

  /**
   * 截图区域的鼠标拖动移动事件
   * @param e 鼠标事件对象
   */
  const onRectDragMove = useMemoizedFn(() => {
    if (isDragMove) {
      setIsDragMove(false);
    }
  });

  /**
   * 截图区域的鼠标拖动结束事件
   * @param e 鼠标事件对象
   */
  const onRectDragEnd = useMemoizedFn(() => {
    if (!isDragMove) {
      setIsDragMove(true);
    }
  });

  /**
   * 截图区域的拖动边界限制
   */
  const onRectDragBoundFunc = useMemoizedFn((pos: Konva.Vector2d) => {
    let x = pos.x;
    let y = pos.y;
    const shotW = shotRect?.width || 0;
    const shotH = shotRect?.height || 0;
    const maxX = width - shotW;
    const maxY = height - shotH;
    if (x < 0) {
      x = 0;
    } else if (x > maxX) {
      x = maxX;
    }
    if (y < 0) {
      y = 0;
    } else if (y > maxY) {
      y = maxY;
    }

    setShotRect((prev) => ({ ...prev, x, y }));
    return { x, y };
  });

  /**
   *
   */
  const onRectTransformer = () => {
    const target = shotRef.current;
    if (target) {
      const scaleX = Math.abs(target.scaleX());
      const scaleY = Math.abs(target.scaleY());
      target.scaleX(1);
      target.scaleY(1);
      setShotRect({
        x: target.x(),
        y: target.y(),
        width: Math.max(5, target.width() * scaleX),
        height: Math.max(5, target.height() * scaleY)
      });
    }
  };

  const onRectTransformEnd = () => {
    const target = shotRef.current;
    if (target) {
      const scaleX = Math.abs(target.scaleX());
      const scaleY = Math.abs(target.scaleY());
      target.scaleX(1);
      target.scaleY(1);
      setShotRect({
        x: target.x(),
        y: target.y(),
        width: Math.max(5, target.width() * scaleX),
        height: Math.max(5, target.height() * scaleY)
      });
    }
    setIsDragMove(true);
  };

  const onTrBoundBoxFunc = useMemoizedFn(
    (_oldBoundBox: Box, newBoundBox: Box) => {
      const newX = Number(newBoundBox.x.toFixed(0));
      const newY = Number(newBoundBox.y.toFixed(0));
      const maxX = Math.max(0, newBoundBox.x < 0 ? 0 : newX);
      const maxY = Math.max(0, newBoundBox.y < 0 ? 0 : newY);
      const rectX = shotRect?.x || 0;
      const rectY = shotRect?.y || 0;

      const newW = Number(newBoundBox.width.toFixed(0));
      const newH = Number(newBoundBox.height.toFixed(0));

      if (maxX < rectX) {
        newBoundBox.width = newW >= rectX ? rectX : newW;
      } else {
        newBoundBox.width = newW >= width - rectX ? width - rectX : newW;
      }
      if (maxY < rectY) {
        newBoundBox.height = newH >= rectY ? rectY : newH;
      } else {
        newBoundBox.height = newH >= height - rectY ? height - rectY : newH;
      }

      return {
        ...newBoundBox,
        x: maxX,
        y: maxY
      };
    }
  );

  const onToolAction = (action: string) => {};

  useEffect(() => {
    if (shotRect && shotRef.current && shotTrRef.current) {
      shotTrRef.current?.nodes([shotRef.current]);
      shotTrRef.current?.getLayer()?.batchDraw();
    }
  }, [shotRect]);

  useEffect(() => {
    image.current.src = BgImage;
  }, []);

  return (
    <div id='screenshot'>
      <Stage
        width={width}
        height={height}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
      >
        <Layer>
          <Image image={image.current} width={width} height={height} />
        </Layer>
        <Layer>
          <Rect
            width={width}
            height={height}
            fill='rgba(0,0,0,0.5)'
            onMouseLeave={() => {
              if (!shotRect) {
                document.body.style.cursor = 'crosshair';
              }
            }}
          />
          {shotRect ? (
            <>
              <Rect
                ref={shotRef}
                width={shotRect.width}
                height={shotRect.height}
                x={shotRect.x}
                y={shotRect.y}
                fill='rgba(0,0,0)'
                draggable={!currentAction}
                cornerRadius={shotRadius}
                shadowColor='#000'
                shadowEnabled={showShadow}
                onMouseEnter={() => {
                  if (!currentAction) {
                    document.body.style.cursor = 'grab';
                  }
                }}
                onMouseLeave={() => {
                  if (!currentAction) {
                    document.body.style.cursor = 'default';
                  }
                }}
                onMouseDown={onActionMouseDown}
                onMouseMove={onActionMouseMove}
                onMouseUp={onActionMouseUp}
                onDragMove={onRectDragMove}
                onDragEnd={onRectDragEnd}
                dragBoundFunc={onRectDragBoundFunc}
                globalCompositeOperation='destination-out'
                onTransformStart={() => {
                  setIsDragMove(false);
                }}
                onTransform={onRectTransformer}
                onTransformEnd={onRectTransformEnd}
              />
              <Transformer
                ref={shotTrRef}
                resizeEnabled={true}
                rotateEnabled={false}
                anchorSize={6}
                anchorFill={primaryColor}
                anchorStroke={primaryColor}
                anchorCornerRadius={0}
                ignoreStroke={true}
                borderStroke={primaryColor}
                borderStrokeWidth={1}
                centeredScaling={false}
                keepRatio={false}
                enabledAnchors={[
                  'top-left',
                  'top-right',
                  'bottom-left',
                  'bottom-right',
                  'middle-left',
                  'middle-right',
                  'top-center',
                  'bottom-center'
                ]}
              />
            </>
          ) : null}
        </Layer>
        <Layer>
          {previewImage && colorState && pos && !shotRect ? (
            <MousePreviewRect
              pos={pos}
              color={colorState}
              image={previewImage}
              primaryColor={primaryColor}
            />
          ) : null}
        </Layer>
        <Layer>
          {(figures || []).map((figure, index) => {
            return (
              <Rect
                key={index}
                width={figure.width}
                height={figure.height}
                x={figure.x}
                y={figure.y}
                stroke={'red'}
                strokeWidth={2}
                onDragEnd={onRectDragEnd}
                dragBoundFunc={onRectDragBoundFunc}
              />
            );
          })}
        </Layer>
      </Stage>
      {shotRect && isDragMove ? (
        <ShotRectContainer
          width={shotRect.width || 0}
          height={shotRect.height || 0}
          x={shotRect?.x || 0}
          y={shotRect?.y || 0}
          radius={shotRadius}
          onChange={setShotRadius}
          shadowEnabled={showShadow}
          onShadowChange={setShowShadow}
        />
      ) : null}
      {isDragMove ? (
        <ShotToolsContainer
          x={toolsRect.x}
          y={toolsRect.y}
          onAction={setCurrentAction}
        />
      ) : null}
    </div>
  );
};

export default ScreenShot;
