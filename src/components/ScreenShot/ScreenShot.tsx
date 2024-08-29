import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Layer, Rect, Stage, Transformer } from 'react-konva';
import { useMemoizedFn } from 'ahooks';
import Konva from 'konva';
import { Box } from 'konva/lib/shapes/Transformer';
import { ShotTools } from './ShotTools';

import BgImage from '../../assets/bg.jpg';

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
  const isDrawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const [isDragMove, setIsDragMove] = useState(false);
  const [shotRect, setShotRect] = useState<Konva.NodeConfig>();
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
    }
  };

  /**
   * 结束绘制截图区域
   */
  const handleDragEnd = () => {
    isDrawing.current = false;
    setIsDragMove(true);
  };

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

      console.log(rectX, rectY);

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

  const onToolAction = (action: string) => {

  }

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
    <div
      id='screenshot'
      style={{
        position: 'relative',
        overflow: 'hidden',
        '--primary-color': primaryColor
      }}
    >
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
          <Rect width={width} height={height} fill='rgba(0,0,0,0.4)' />
          {shotRect ? (
            <>
              <Rect
                ref={shotRef}
                width={shotRect.width}
                height={shotRect.height}
                x={shotRect.x}
                y={shotRect.y}
                fill='rgba(0,0,0,0.8)'
                draggable={!currentAction}
                cornerRadius={[10, 10, 10, 10]}
                shadowBlur={100}
                shadowColor='#000'
                shadowEnabled={true}
                onMouseEnter={() => {
                  document.body.style.cursor = 'grab';
                }}
                onMouseLeave={() => {
                  document.body.style.cursor = 'default';
                }}
                onMouseDown={() => {
                  console.log('mouseDown');
                }}
                onDragMove={onRectDragMove}
                onDragEnd={onRectDragEnd}
                dragBoundFunc={onRectDragBoundFunc}
                globalCompositeOperation='destination-out'
                onTransformStart={() => {
                  setIsDragMove(false);
                }}
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
                boundBoxFunc={onTrBoundBoxFunc}
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
      </Stage>
      {isDragMove ? <ShotTools x={toolsRect.x} y={toolsRect.y} onAction={setCurrentAction} /> : null}
    </div>
  );
};

export default ScreenShot;
