import Konva from 'konva';
import { useMemo, useState } from 'react';
import { rgbToHex } from '../utils.ts';
import { THUMBNAIL_SIZE } from '../constants.ts';

export interface IColorState {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
}

export const useMousePreviewColor = () => {
  const [pos, setPos] = useState<Konva.Vector2d>();
  const [colorState, setColorState] = useState<IColorState>();
  const [imageData, setImageData] = useState<ImageData>();

  const previewImage = useMemo(() => {
    if (imageData) {
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      ctx?.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    }
  }, [imageData]);
  /**
   * 鼠标移动事件处理函数
   * @param stage
   */
  const onMouseMoveHandle = (stage: Konva.Stage) => {
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }
    const x = Number(pos.x.toFixed(0));
    const y = Number(pos.y.toFixed(0));
    setPos({ x, y });

    // 使用 Konva 的方法获取颜色
    const layer = stage.getLayers()[0];
    const [r, g, b, a] = layer.getContext().getImageData(x, y, 1, 1).data;

    const areaImageData = layer
      .getContext()
      .getImageData(
        x - THUMBNAIL_SIZE / 2,
        y - THUMBNAIL_SIZE / 2,
        THUMBNAIL_SIZE,
        THUMBNAIL_SIZE
      );
    setImageData(areaImageData);
    setColorState({
      r,
      g,
      b,
      a: a / 255,
      hex: rgbToHex(r, g, b)
    });
  };

  return {
    pos,
    color: colorState,
    previewImage,
    onMouseMoveHandle
  };
};
