import {
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Image, Layer, Rect, Stage, Transformer } from 'react-konva';
import { useMemoizedFn } from 'ahooks';
import Konva from 'konva';
import {
  SHOT_TOOLBAR_HEIGHT,
  SHOT_TOOLBAR_MODAL_HEIGHT,
  SHOT_TOOLBAR_SPLIT,
  SHOT_TOOLBAR_WIDTH
} from './constants';
import { useMouseShapeHandler } from './hooks/useMouseShapeHandler.ts';
import { useMousePreviewColor } from './hooks/useMousePreviewColor';
import { ShotMousePreviewRect } from './components/ShotMousePreviewRect';
import { ShotSizeContainer } from './components/ShotSizeContainer';
import { ShotToolsContainer } from './components/ShotToolsContainer';
import { Shapes } from './components/shapes';
import { ShotContext } from './Context';
import { useMouseShotHandler } from './hooks/useMouseShotHandler.ts';

export interface ScreenShotProps {
  image: string;
  width: number;
  height: number;
  primaryColor?: string;
  options?: IToolOptionsType;
}

const ScreenShot: FC<ScreenShotProps> = ({
  image,
  width,
  height,
  primaryColor = '#4096ff',
  options
}) => {
  const source = useRef(new window.Image());
  const [ready, setReady] = useState(false);

  const { state } = useContext(ShotContext);

  // 是否正在拖动截图区域
  const [isDragMove, setIsDragMove] = useState(false);

  // 区域圆角
  const [shotRadius, setShotRadius] = useState(10);
  // 是否显示阴影
  const [showShadow, setShowShadow] = useState(false);

  // 当前操作
  const [action, setAction] = useState<ISelectToolOptionType>();

  const shotRef = useRef<Konva.Rect>(null);
  const shotTrRef = useRef<Konva.Transformer>(null);

  const { pos, color, previewImage, onMouseMoveHandle } =
    useMousePreviewColor();

  const {
    onShotMouseDownHandler,
    onShotMouseMoveHandler,
    onShotMouseOutHandler
  } = useMouseShotHandler();
  const {
    shotRect,
    shapes,
    updateShotRect,
    onActionMouseDownHandler,
    onActionMouseMoveHandler,
    onActionMouseUpHandler
  } = useMouseShapeHandler({
    action: action,
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
    if (!state.shot) return { x: 0, y: 0 };
    const shotW = state.shot.width || 0;
    const shotY = state.shot.y || 0;
    const shotX = state.shot.x || 0;
    const y = shotY > 34 ? shotY - 34 : shotY + 10;
    const x =
      shotW > 325 ? shotX + 6 : width - shotX > 325 ? shotX + 6 : width - 325;
    return {
      x: x,
      y: y
    };
  }, [width, state.shot]);

  const toolsRect = useMemo<{
    x: number;
    y: number;
    position: 'top' | 'bottom';
  }>(() => {
    if (!state.shot) return { x: 0, y: 0, position: 'top' };
    const shotH = state.shot.height || 0;
    const shotW = state.shot.width || 0;
    const shotY = state.shot.y || 0;
    const shotX = state.shot.x || 0;

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
  }, [height, state.shot]);

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
  const onRectDragEnd = useMemoizedFn(() => {
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

  useEffect(() => {
    if (shotRect && shotRef.current && shotTrRef.current) {
      shotTrRef.current?.nodes([shotRef.current]);
      shotTrRef.current?.getLayer()?.batchDraw();
    }
  }, [shotRect]);

  useEffect(() => {
    source.current.src = image;
    source.current.onload = () => {
      setReady(true);
    };
  }, []);

  return (
    <div id='screenshot' style={{ position: 'relative' }}>
      <Stage
        width={width}
        height={height}
        onMouseDown={onActionMouseDownHandler}
        onMouseMove={onActionMouseMoveHandler}
        onMouseUp={(e: Konva.KonvaEventObject<MouseEvent>) => {
          if (state.mode === 'shot') {
            onShotMouseOutHandler();
          }
          if(state.mode === 'shape') {
            console.log('22');
          }
        }}
        onContextMenu={() => {}}
      >
        <Layer>
          {ready && (
            <Image
              image={source.current}
              width={width}
              height={height}
              listening={false}
            />
          )}
        </Layer>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            onMouseDown={onShotMouseDownHandler}
            onMouseMove={onShotMouseMoveHandler}
            fill='rgba(0,0,0,0.5)'
          />
          {state.shot ? (
            <Fragment>
              <Rect
                ref={shotRef}
                width={state.shot.width}
                height={state.shot.height}
                x={state.shot.x}
                y={state.shot.y}
                fill='rgba(0,0,0,0.91)'
                draggable={!action}
                cornerRadius={shotRadius}
                shadowColor='#000'
                shadowEnabled={showShadow}
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
          {previewImage && color && pos && !shotRect ? (
            <ShotMousePreviewRect
              pos={pos}
              color={color}
              image={previewImage}
              primaryColor={primaryColor}
            />
          ) : null}
          <Shapes list={shapes} />
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
          position={toolsRect.position}
          options={options}
          onAction={setAction}
        />
      ) : null}
    </div>
  );
};

export default ScreenShot;
