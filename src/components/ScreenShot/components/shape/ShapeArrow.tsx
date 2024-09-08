import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { Arrow, Transformer } from 'react-konva';
import Konva from 'konva';

export interface IShapeArrowProps {
  shapeProps: Konva.ArrowConfig;
}

export const ShapeArrow: FC<IShapeArrowProps> = ({ shapeProps }) => {
  console.log(shapeProps);
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
        stroke={'red'}
        strokeWidth={2}
        pointerWidth={20}
        pointerLength={20}
        fill='red'
        {...shapeProps}
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
