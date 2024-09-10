import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { Arrow, Transformer } from 'react-konva';
import Konva from 'konva';

export interface IShapeArrowProps {
  shape: IShapeType
}

export const ShapeArrow: FC<IShapeArrowProps> = ({ shape }) => {
  const arrowRef = useRef<Konva.Arrow>(null);
  const shotTrRef = useRef<Konva.Transformer>(null);

  const [isSelect, setIsSelect] = useState(false);

  const onArronTap = () => {
    setIsSelect(true);
  };

  useEffect(() => {
    if (arrowRef.current && shotTrRef.current) {
      shotTrRef.current?.nodes([arrowRef.current]);
      shotTrRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelect]);
  return (
    <Fragment>
      <Arrow
        ref={arrowRef}
        pointerWidth={shape.options?.size}
        pointerLength={(shape.options?.size || 0) * 2}
        fill={shape.options?.full ? shape.options?.color : 'transparent'}
        opacity={shape.options?.opacity}
        cornerRadius={shape.options?.radius ? 5 : 0}
        points={[shape.x || 0, shape.y || 0, shape.endX || 0, shape.endY || 0]}
        onClick={onArronTap}
        onTap={onArronTap}
        draggable
        onMouseEnter={() => {
          console.log('okk');
          document.body.style.cursor = 'move';
        }}
        onMouseLeave={() => {
          document.body.style.cursor = 'default';
        }}
      />
      {isSelect && (
        <Transformer
          ref={shotTrRef}
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
          enabledAnchors={['top-center', 'bottom-center']}
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
