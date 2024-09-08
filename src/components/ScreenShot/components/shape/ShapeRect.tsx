import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { Rect, Transformer } from 'react-konva';
import Konva from 'konva';

export interface IShapeRectProps {
  shapeProps: Konva.LineConfig;
}

export const ShapeRect: FC<IShapeRectProps> = ({ shapeProps }) => {
  console.log(shapeProps);
  const shapeRef = useRef<Konva.Rect>(null);
  const shapeTrRef = useRef<Konva.Transformer>(null);

  const [isSelect, setIsSelect] = useState(false);

  const onArronTap = (e:Konva.KonvaEventObject<MouseEvent>) => {
    console.log(e);
    setIsSelect(true);
  };


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
        stroke={'red'}
        strokeWidth={19}
        pointerWidth={20}
        pointerLength={20}
        {...shapeProps}
        onClick={onArronTap}
        onTap={onArronTap}
        draggable
        onMouseMove={(e) => {
          console.log('okk',e);
          document.body.style.cursor = 'move';
        }}
        onMouseLeave={() => {
          document.body.style.cursor = 'default';
        }}
      />
      {isSelect && (
        <Transformer
          ref={shapeTrRef}
          flipEnabled={false}
          resizeEnabled={true}
          rotateEnabled={false}
          anchorSize={6}
          anchorFill='red'
          anchorStroke='red'
          anchorCornerRadius={0}
          ignoreStroke={true}
          borderStroke='red'
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
