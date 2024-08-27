import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Layer, Rect, Stage, Text, Transformer } from 'react-konva';

import BgImage from '../../assets/bg.jpg';
import { ScreenShotTools } from '../ScreenShotTools';
import Konva from 'konva';

const ScreenShot = () => {
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

    const isFooter = (window.innerHeight - (shotY + shotH)) > 44;
    const isTop = shotY > 44;
    let toolsY = isFooter ? shotY + shotH : shotY - 44;
    if(isFooter){
      toolsY = shotY + shotH + 8;
    }else if(isTop){
      toolsY = shotY - 44 - 8;
    }

    const toolsX = shotW+shotX > 400 ? (shotX+shotW-400) : shotX;

    return {
      y:toolsY,
      x: toolsX
    }
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

  const onTransform = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const node = shotRef.current;
    if (node) {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      console.log(scaleX, scaleY);
      node.scaleX(1);
      node.scaleY(1);

      let x = node.x();
      let y = node.y();
      const width = Math.max(5, node.width() * scaleX);
      const height = Math.max(5, node.height() * scaleY);
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height;
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
      setShotRect({
        x: node.x(),
        y: node.y(),
        width: width,
        height: height
      });
    }
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
    <div id='screenshot' style={{ position: 'relative',overflow:'hidden' }}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
      >
        <Layer>
          <Image
            image={image.current}
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </Layer>
        <Layer>
          <Rect
            width={window.innerWidth}
            height={window.innerHeight}
            fill='rgba(0,0,0,0.4)'
          />
          {shotRect ? (
            <>
              <Rect
                ref={shotRef}
                width={shotRect.width}
                height={shotRect.height}
                x={shotRect.x}
                y={shotRect.y}
                fill='rgba(0,0,0,0.6)'
                draggable
                cornerRadius={20}
                onMouseEnter={() => {
                  document.body.style.cursor = 'grab';
                }}
                onMouseLeave={() => {
                  document.body.style.cursor = 'default';
                }}
                globalCompositeOperation='destination-out'
                dragBoundFunc={onDragBoundFunc}
                onTransform={onTransform}
              />
              <Transformer
                ref={shotTrRef}
                resizeEnabled={true}
                rotateEnabled={false}
                anchorSize={8}
                anchorFill='#fff'
                anchorStroke='#4096ff'
                anchorCornerRadius={4}
                borderStroke='#4096ff'
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
              {/*<Rect*/}
              {/*  width={shotRect.width ? shotRect.width + 2 : 0}*/}
              {/*  height={shotRect.height ? shotRect.height + 2 : 0}*/}
              {/*  stroke='#4096ff'*/}
              {/*  strokeWidth={1}*/}
              {/*  x={shotRect.x ? shotRect.x - 1 : 0}*/}
              {/*  y={shotRect.y ? shotRect.y - 1 : 0}*/}
              {/*  onMouseOver={() => {*/}
              {/*    document.body.style.cursor = 'grab';*/}
              {/*  }}*/}
              {/*  onMouseOut={() => {*/}
              {/*    document.body.style.cursor = 'default';*/}
              {/*  }}*/}
              {/*/>*/}
            </>
          ) : null}

          <Text text='Try to drag a star' />
        </Layer>
      </Stage>
      {isChange ? (
        <ScreenShotTools x={toolsRect.x} y={toolsRect.y} />
      ) : null}
    </div>
  );
};

export default ScreenShot;
