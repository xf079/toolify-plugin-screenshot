import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Image, Layer, Rect, Stage, Transformer } from 'react-konva';
import { useMemoizedFn } from 'ahooks';
import Konva from 'konva';
import { Box } from 'konva/lib/shapes/Transformer';
import { ShotToolsContainer } from './ShotToolsContainer';

import BgImage from '../../assets/bg2.webp';
import {
  SHOT_TOOLBAR_HEIGHT,
  SHOT_TOOLBAR_MODAL_HEIGHT,
  SHOT_TOOLBAR_SPLIT,
  SHOT_TOOLBAR_WIDTH
} from './constants';
import { ShotRectContainer } from './ShotRectContainer.tsx';
import { useMouseActon } from './hooks/useMouseActon';
import { useMousePreviewColor } from './hooks/useMousePreviewColor';
import { MousePreviewRect } from './MousePreviewRect';

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
  // 是否正在拖动截图区域
  const [isDragMove, setIsDragMove] = useState(false);

  const overflowRef = useRef<Konva.Rect>(null);

  // 区域圆角
  const [shotRadius, setShotRadius] = useState(10);
  // 是否显示阴影
  const [showShadow, setShowShadow] = useState(false);

  // 当前操作
  const [currentAction, setCurrentAction] = useState<string>();

  const shotRef = useRef<Konva.Rect>(null);
  const shotTrRef = useRef<Konva.Transformer>(null);

  const { pos, color, previewImage, onMouseMoveHandle } = useMousePreviewColor(
    width,
    height
  );
  const {
    isDrawing,
    shotRect,
    figures,
    updateShotRect,
    onActionMouseDownHandler,
    onActionMouseMoveHandler,
    onActionMouseUpHandler
  } = useMouseActon({
    action: currentAction,
    onMouseMoveCallback: (e) => {
      if (!shotRect) {
        const stage = e.target?.getStage();
        if (stage) {
          onMouseMoveHandle(stage);
        }
      }
    }
  });

  const toolsRect = useMemo(() => {
    if (!shotRect) return { x: 0, y: 0 };
    const shotH = shotRect.height || 0;
    const shotW = shotRect.width || 0;
    const shotY = shotRect.y || 0;
    const shotX = shotRect.x || 0;

    const pendY = shotY + shotH;
    const pendX = shotX + shotW;

    const y =
      pendY + SHOT_TOOLBAR_HEIGHT + SHOT_TOOLBAR_SPLIT < height
        ? pendY + SHOT_TOOLBAR_SPLIT
        : pendY - (SHOT_TOOLBAR_HEIGHT + SHOT_TOOLBAR_SPLIT);

    const x =
      pendX > SHOT_TOOLBAR_WIDTH + SHOT_TOOLBAR_SPLIT
        ? pendX - (SHOT_TOOLBAR_WIDTH + SHOT_TOOLBAR_SPLIT / 2)
        : shotX + SHOT_TOOLBAR_SPLIT / 2;

    const position =
      pendY +
        SHOT_TOOLBAR_HEIGHT +
        SHOT_TOOLBAR_SPLIT +
        SHOT_TOOLBAR_MODAL_HEIGHT <
      height
        ? 'bottom'
        : 'top';

    return { x, y, position };
  }, [height, shotRect]);

  /**
   * 截图区域的鼠标拖动移动事件
   * @param e 鼠标事件对象
   */
  const onRectDragMove = useMemoizedFn(() => {
    if (!isDragMove) {
      setIsDragMove(true);
    }
  });

  /**
   * 截图区域的鼠标拖动结束事件
   * @param e 鼠标事件对象
   */
  const onRectDragEnd = useMemoizedFn((e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log(e);
    updateShotRect({
      x: shotRef.current?.x(),
      y: shotRef.current?.y(),
      width: shotRef.current?.width(),
      height: shotRef.current?.height()
    });
    if (isDragMove) {
      setIsDragMove(false);
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
      updateShotRect({
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
      updateShotRect({
        x: target.x(),
        y: target.y(),
        width: Math.max(5, target.width() * scaleX),
        height: Math.max(5, target.height() * scaleY)
      });
    }
    setIsDragMove(false);
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

  useEffect(() => {
    if (shotRect && shotRef.current && shotTrRef.current) {
      shotTrRef.current?.nodes([shotRef.current]);
      shotTrRef.current?.getLayer()?.batchDraw();
    }
  }, [shotRect]);

  useEffect(() => {
    image.current.src = BgImage;
    document.body.style.cursor = 'crosshair';
  }, []);

  return (
    <div id='screenshot'>
      <Stage width={width} height={height}>
        <Layer>
          <Image
            image={image.current}
            width={width}
            height={height}
            listening={false}
          />
        </Layer>
        <Layer
          draggable={false}
          onMouseDown={onActionMouseDownHandler}
          onMouseMove={onActionMouseMoveHandler}
          onMouseUp={onActionMouseUpHandler}
        >
          <Rect
            ref={overflowRef}
            x={0}
            y={0}
            width={width}
            height={height}
            fill='rgba(0,0,0,0.5)'
          />
          {shotRect ? (
            <Fragment>
              <Rect
                ref={shotRef}
                width={shotRect.width}
                height={shotRect.height}
                x={shotRect.x}
                y={shotRect.y}
                fill='rgba(0,0,0,0.91)'
                draggable={!currentAction}
                cornerRadius={shotRadius}
                shadowColor='#000'
                shadowEnabled={showShadow}
                onMouseEnter={() => {
                  if (!currentAction && !figures?.length) {
                    document.body.style.cursor = 'grab';
                  }
                  if (currentAction) {
                    document.body.style.cursor = 'crosshair';
                  }
                }}
                onMouseLeave={() => {
                  if (!currentAction && !figures?.length) {
                    document.body.style.cursor = 'default';
                  }
                  if (!currentAction && shotRect) {
                    document.body.style.cursor = 'default';
                  }
                }}
                onDragMove={onRectDragMove}
                onDragEnd={onRectDragEnd}
                dragBoundFunc={onRectDragBoundFunc}
                globalCompositeOperation='destination-out'
                onTransformStart={() => {
                  setIsDragMove(true);
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
            </Fragment>
          ) : null}
          <Group>
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
          </Group>
          {previewImage && color && pos && !shotRect ? (
            <MousePreviewRect
              pos={pos}
              color={color}
              image={previewImage}
              primaryColor={primaryColor}
            />
          ) : null}
        </Layer>
      </Stage>
      {!isDragMove && shotRect ? (
        <ShotRectContainer
          width={shotRect.width || 0}
          height={shotRect.height || 0}
          x={shotRect?.x || 0}
          y={shotRect?.y || 0}
          radius={shotRadius}
          shadow={showShadow}
          onRectChange={(_w, _h) => {
            updateShotRect({
              ...shotRect,
              width: _w,
              height: _h
            });
          }}
          onRadiusChange={setShotRadius}
          onShadowChange={setShowShadow}
        />
      ) : null}
      {!isDragMove && shotRect ? (
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
