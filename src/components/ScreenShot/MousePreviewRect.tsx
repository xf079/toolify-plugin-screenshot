import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Line, Text } from 'react-konva';
import { THUMBNAIL_IMAGE_SIZE } from './constants.ts';
import Konva from 'konva';
import { IColorState } from './hooks/useMousePreviewColor';
import useImage from 'use-image';

export interface MousePreviewRectProps {
  primaryColor: string;
  pos: Konva.Vector2d;
  image: string;
  color: IColorState;
}

export const MousePreviewRect: FC<MousePreviewRectProps> = ({
  pos,
  image: imageProp,
  color,
  primaryColor
}) => {
  const x = useMemo(()=>pos.x + 15, [pos.x]);
  const y = useMemo(()=>pos.y + 15, [pos.y]);
  const [image] = useImage(imageProp);
  const imageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    if (image) {
      imageRef.current?.cache();
      imageRef.current?.pixelSize(12)
    }
  }, [image]);

  return (
    <Fragment>
      <Image
        image={image}
        ref={imageRef}
        width={THUMBNAIL_IMAGE_SIZE}
        height={THUMBNAIL_IMAGE_SIZE}
        x={x}
        y={y}
        stroke={primaryColor}
        strokeWidth={2}
        filters={[Konva.Filters.Pixelate]}
      />
      <Text
        x={x+8}
        y={y + THUMBNAIL_IMAGE_SIZE - 20}
        height={16}
        lineHeight={2}
        fill='#fff'
        fontSize={10}
        stroke='#000'
        strokeWidth={0.06}
        text={`${pos.x},${pos.y}`}
      />
      <Text
        x={x + THUMBNAIL_IMAGE_SIZE - 50}
        y={y + THUMBNAIL_IMAGE_SIZE - 10}
        height={16}
        lineHeight={2}
        fill='#fff'
        fontSize={8}
        text={`${color.r},${color.g},${color.b}`}
      />
      <Text
        x={x + THUMBNAIL_IMAGE_SIZE - 50}
        y={y + THUMBNAIL_IMAGE_SIZE - 30}
        height={16}
        lineHeight={2}
        fontStyle='bold'
        fill='#fff'
        fontSize={8}
        text={color.color}
      />
      <Line
        points={[
          pos.x + 10,
          pos.y + 10 + THUMBNAIL_IMAGE_SIZE / 2,
          pos.x + 10 + THUMBNAIL_IMAGE_SIZE,
          pos.y + 10 + THUMBNAIL_IMAGE_SIZE / 2
        ]}
        stroke={primaryColor}
        opacity={0.3}
        strokeWidth={6}
      />
      <Line
        points={[
          pos.x + 10 + THUMBNAIL_IMAGE_SIZE / 2,
          pos.y + 10,
          pos.x + 10 + THUMBNAIL_IMAGE_SIZE / 2,
          pos.y + 10 + THUMBNAIL_IMAGE_SIZE
        ]}
        stroke={primaryColor}
        opacity={0.3}
        strokeWidth={6}
      />
    </Fragment>
  );
};
