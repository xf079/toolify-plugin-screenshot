import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Konva from 'konva';
import { Image, Line, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import { useMemoizedFn } from 'ahooks';
import { THUMBNAIL_IMAGE_SIZE } from '../constants';
import { IColorState } from '../hooks/useMousePreviewColor';

export interface ShotMousePreviewRectProps {
  primaryColor: string;
  pos: Konva.Vector2d;
  image: string;
  color: IColorState;
}

export const ShotMousePreviewRect: FC<ShotMousePreviewRectProps> = ({
  pos,
  image: imageProp,
  color,
  primaryColor
}) => {
  const x = useMemo(() => pos.x + 15, [pos.x]);
  const y = useMemo(() => pos.y + 15, [pos.y]);
  const [image] = useImage(imageProp);
  const imageRef = useRef<Konva.Image>(null);
  const [mode, setMode] = useState('RGB');

  const handleKeyDown = useMemoizedFn((e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setMode(mode === 'RGB' ? 'HEX' : 'RGB');
    }
    if (e.key === 'c') {
      const copyText =
        mode === 'RGB' ? `${color.r},${color.g},${color.b}` : `#${color.hex}`;
      // 复制到剪贴板
      console.log(copyText);
    }
  });

  useEffect(() => {
    if (image) {
      imageRef.current?.cache();
      imageRef.current?.pixelSize(12);
    }
  }, [image]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Fragment>
      <Image
        image={image}
        ref={imageRef}
        width={THUMBNAIL_IMAGE_SIZE}
        height={THUMBNAIL_IMAGE_SIZE}
        x={x}
        y={y}
        filters={[Konva.Filters.Pixelate]}
      />
      <Rect
        x={x}
        y={y + THUMBNAIL_IMAGE_SIZE}
        width={THUMBNAIL_IMAGE_SIZE}
        height={88}
        fill='rgba(0,0,0,0.6)'
      />
      <Text
        x={x}
        y={y + THUMBNAIL_IMAGE_SIZE}
        width={THUMBNAIL_IMAGE_SIZE}
        align='center'
        height={16}
        lineHeight={2}
        fill='#fff'
        fontSize={13}
        text={`（${pos.x},${pos.y}）`}
      />
      <Rect
        x={x + 18}
        y={y + THUMBNAIL_IMAGE_SIZE + 24}
        width={15}
        height={15}
        cornerRadius={7.5}
        fill={`#${color.hex}`}
      />
      <Text
        x={x}
        y={y + THUMBNAIL_IMAGE_SIZE + 20}
        width={THUMBNAIL_IMAGE_SIZE}
        align='center'
        height={16}
        lineHeight={2}
        fill='#fff'
        fontSize={13}
        text={
          mode === 'RGB' ? `${color.r},${color.g},${color.b}` : `#${color.hex}`
        }
      />
      <Text
        x={x}
        y={y + THUMBNAIL_IMAGE_SIZE + 40}
        width={THUMBNAIL_IMAGE_SIZE}
        align='center'
        height={16}
        lineHeight={2}
        fill='#fff'
        fontSize={13}
        text='按 C 复制颜色值'
      />
      <Text
        x={x}
        y={y + THUMBNAIL_IMAGE_SIZE + 60}
        width={THUMBNAIL_IMAGE_SIZE}
        align='center'
        height={16}
        lineHeight={2}
        fill='#fff'
        fontSize={13}
        text='按 Shit 切换 RGB/HEX'
      />
      <Line
        points={[
          x,
          y + THUMBNAIL_IMAGE_SIZE / 2,
          x + THUMBNAIL_IMAGE_SIZE,
          y + THUMBNAIL_IMAGE_SIZE / 2
        ]}
        stroke={primaryColor}
        opacity={0.7}
        strokeWidth={2}
      />
      <Line
        points={[
          x + THUMBNAIL_IMAGE_SIZE / 2,
          y,
          x + THUMBNAIL_IMAGE_SIZE / 2,
          y + THUMBNAIL_IMAGE_SIZE
        ]}
        stroke={primaryColor}
        opacity={0.7}
        strokeWidth={2}
      />
    </Fragment>
  );
};
