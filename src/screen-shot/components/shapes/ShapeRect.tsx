import Konva from 'konva';
import { Rect, Transformer } from 'react-konva';
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';

export interface IShapeRectProps {
  shape: IShapeType;
}

export const ShapeRect: FC<IShapeRectProps> = ({ shape }) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const shapeTrRef = useRef<Konva.Transformer>(null);
  const [isSelect, setIsSelect] = useState(false);

  const onArronTap = () => {
    setIsSelect(true);
  };

  const state = useMemo(() => {
    const minX = Math.min(shape?.x || 0, shape.endX || 0);
    const minY = Math.min(shape?.y || 0, shape.endY || 0);
    const maxX = Math.max(shape?.x || 0, shape.endX || 0);
    const maxY = Math.max(shape?.y || 0, shape.endY || 0);
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }, [shape]);

  // const isBorderHit = (ctx: Context, shape: Konva.Shape) => {
  //   console.log(ctx,shape);
  // };

  useEffect(() => {
    if (isSelect) {
      if (shapeRef.current && shapeTrRef.current) {
        shapeTrRef.current?.nodes([shapeRef.current]);
        shapeTrRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [isSelect]);
  return (
    <Fragment>
      <Rect
        ref={shapeRef}
        stroke={shape.options?.color}
        strokeWidth={shape.options?.size}
        fill={shape.options?.full ? shape.options?.color : 'transparent'}
        opacity={shape.options?.opacity}
        cornerRadius={shape.options?.radius ? 5 : 0}
        x={state.x}
        y={state.y}
        width={state.width}
        height={state.height}
        onClick={onArronTap}
        onTap={onArronTap}
        draggable
      />
      {isSelect && (
        <Transformer
          ref={shapeTrRef}
          flipEnabled={false}
          resizeEnabled={true}
          rotateEnabled={false}
          anchorSize={8}
          anchorStroke='#fff'
          anchorCornerRadius={4}
          borderEnabled={false}
          ignoreStroke={true}
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
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Fragment>
  );
};
