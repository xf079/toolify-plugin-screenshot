import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  Circle,
  Group,
  Image,
  Layer,
  Rect,
  Stage,
  Text,
  Transformer
} from 'react-konva';
import { useMemoizedFn } from 'ahooks';
import Konva from 'konva';
import {
  SHOT_TOOLBAR_HEIGHT,
  SHOT_TOOLBAR_MODAL_HEIGHT,
  SHOT_TOOLBAR_SPLIT,
  SHOT_TOOLBAR_WIDTH
} from './constants';
import { useMouseActon } from './hooks/useMouseActon';
import { useMousePreviewColor } from './hooks/useMousePreviewColor';
import { ShotMousePreviewRect } from './ShotMousePreviewRect.tsx';
import { ShotSizeContainer } from './ShotSizeContainer.tsx';
import { ShotToolsContainer } from './ShotToolsContainer';

import BgImage from '../../assets/bg2.webp';

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

  const sizeRect = useMemo(() => {
    if (!shotRect) return { x: 0, y: 0 };
    const shotW = shotRect.width || 0;
    const shotY = shotRect.y || 0;
    const shotX = shotRect.x || 0;
    const y = shotY > 34 ? shotY - 34 : shotY + 10;
    const x =
      shotW > 325 ? shotX + 6 : width - shotX > 325 ? shotX + 6 : width - 325;
    return {
      x: x,
      y: y
    };
  }, [width, shotRect]);

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
  const onRectDragEnd = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
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
    }
  );

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
            {shotRect ? (
              <Text
                x={shotRect!.x}
                y={shotRect!.y}
                stroke='red'
                height={120}
                width={50}
                text='123'
                strokeWidth={1}
              ></Text>
            ) : null}

            {(figures || []).map((figure, index) => {
              if (figure.type === 'Rect') {
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
              }
              if (figure.type === 'Circle') {
                return (
                  <Circle
                    key={index}
                    radius={figure.radius}
                    x={figure.x}
                    y={figure.y}
                    stroke={'red'}
                    strokeWidth={2}
                    onDragEnd={onRectDragEnd}
                    dragBoundFunc={onRectDragBoundFunc}
                  />
                );
              }
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
            <ShotMousePreviewRect
              pos={pos}
              color={color}
              image={previewImage}
              primaryColor={primaryColor}
            />
          ) : null}
        </Layer>
      </Stage>
      {!isDragMove && shotRect ? (
        <ShotSizeContainer
          windowWidth={width}
          windowHeight={height}
          width={shotRect.width || 0}
          height={shotRect.height || 0}
          x={sizeRect.x}
          y={sizeRect.y}
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
