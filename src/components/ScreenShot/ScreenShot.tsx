import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Layer, Rect, Stage, Transformer } from 'react-konva';
import Konva from 'konva';
import { Box } from 'konva/lib/shapes/Transformer';

import BgImage from '../../assets/bg.jpg';
import { ScreenShotTools } from '../ScreenShotTools';

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

  const [isChange, setIsChange] = useState(false);
  const [shotRect, setShotRect] = useState<Konva.NodeConfig>();
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

    const toolsX = shotW + shotX > 400 ? shotX + shotW - 400 : shotX;

    return {
      y: toolsY,
      x: toolsX
    };
  }, [shotRect]);

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

  const handleDragEnd = () => {
    isDrawing.current = false;
    setIsChange(true);
  };

  const onDragBoundFunc = (pos: Konva.Vector2d) => {
    let x = pos.x;
    let y = pos.y;
    const shotW = shotRect?.width || 0;
    const shotH = shotRect?.height || 0;
    const maxX = window.innerWidth - shotW;
    const maxY = window.innerHeight - shotH;
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
  };

  const onTransform = () => {
    // const target = shotRef.current;
    // if (target) {
    //   const scaleX = target.scaleX();
    //   const scaleY = target.scaleY();
    //   const newWidth = target.width() * scaleX;
    //   const newHeight = target.height() * scaleY;
    //   const maxW = window.innerWidth;
    //   const maxH = window.innerHeight;
    //
    //   // 检查是否超出舞台边界
    //   if (target.x() + newWidth / 2 > maxW || target.x() - newWidth / 2 < 0 ||
    //       target.y() + newHeight / 2 > maxH || target.y() - newHeight / 2 < 0) {
    //     // 如果超出范围，恢复到上一状态
    //     target.scaleX(scaleX / 2);
    //     target.scaleY(scaleY / 2);
    //   }
    // }
  };

  const onRectTransformEnd = () => {
    // const target = shotTrRef.current;
    // if (target) {
    //   const scaleX = target.scaleX();
    //   const scaleY = target.scaleY();
    //   const newX = target.x();
    //   const newY = target.y();
    //   const newWidth = target.width() * scaleX;
    //   const newHeight = target.height() * scaleY;
    //   target.scaleX(1)
    //   target.scaleY(1)
    //   setShotRect({
    //     ...shotRect,
    //     x: newX,
    //     y: newY,
    //     width: newWidth,
    //     height: newHeight
    //   });
    // }
    // const target = shotRef.current;
    // if (target) {
    //   const scaleX = target.scaleX();
    //   const scaleY = target.scaleY();
    //   const newWidth = target.width() * scaleX;
    //   const newHeight = target.height() * scaleY;
    //   const maxW = window.innerWidth;
    //   const maxH = window.innerHeight;
    //
    //   // 检查是否超出舞台边界
    //   if (target.x() + newWidth / 2 > maxW || target.x() - newWidth / 2 < 0 ||
    //       target.y() + newHeight / 2 > maxH || target.y() - newHeight / 2 < 0) {
    //     // 如果超出范围，恢复到上一状态
    //     target.scaleX(scaleX / 2);
    //     target.scaleY(scaleY / 2);
    //   }
    // }
  };

  const onTrBoundBoxFunc = (_oldBoundBox: Box, newBoundBox: Box) => {
    const newX = Math.max(0, newBoundBox.x < 0 ? 0 : newBoundBox.x);
    const newY = Math.max(0, newBoundBox.y < 0 ? 0 : newBoundBox.y);

    if (Math.abs(newBoundBox.width) + newX > width) {
      console.log('change width');
      newBoundBox.width = width - newX;
    }
    if (Math.abs(newBoundBox.height) + newY > height) {
      console.log('change height');
      newBoundBox.height = height - newY;
    }
    console.log({
      x: newX,
      y: newY
    });
    return {
      ...newBoundBox,
      x: newX,
      y: newY
    };
  };

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
    <div id='screenshot' style={{ position: 'relative', overflow: 'hidden' }}>
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
                draggable
                cornerRadius={20}
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
                globalCompositeOperation='destination-out'
                dragBoundFunc={onDragBoundFunc}
                onTransformEnd={onRectTransformEnd}
              />
              <Transformer
                ref={shotTrRef}
                resizeEnabled={true}
                rotateEnabled={false}
                anchorSize={8}
                anchorFill='#fff'
                anchorStroke={primaryColor}
                anchorCornerRadius={0}
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
      {isChange ? <ScreenShotTools x={toolsRect.x} y={toolsRect.y} /> : null}
    </div>
  );
};

export default ScreenShot;
