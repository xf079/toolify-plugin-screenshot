import { FC } from 'react';
import { Checkbox, Flex, Input, Slider } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  container: css`
    position: absolute;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    z-index: 999;
    height: 28px;
    gap: 12px;
    padding: 0 12px;
  `,
  rect: css`
    font-size: 14px;
    font-weight: 300;
    color: #000;
    gap: 8px;
  `,
  field: css`
    font-size: 12px;
    font-weight: 400;
    color: #333;
    width: 50px;
    height: 22px;
    text-align: center;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    outline: none;
    border-radius: 5px;
  `
}));

export interface ShotSizeContainerProps {
  windowWidth: number;
  windowHeight: number;
  width: number;
  height: number;
  x: number;
  y: number;
  radius: number;
  shadow: boolean;
  onRectChange: (width: number, height: number) => void;
  onRadiusChange: (radius: number) => void;
  onShadowChange: (shadowEnabled: boolean) => void;
}
export const ShotSizeContainer: FC<ShotSizeContainerProps> = ({
  windowWidth,
  windowHeight,
  width,
  height,
  x,
  y,
  radius,
  shadow,
  onRectChange,
  onRadiusChange,
  onShadowChange
}) => {
  const { styles } = useStyles();
  return (
    <Flex
      className={styles.container}
      align='center'
      justify='start'
      style={{ top: y, left: x }}
    >
      <Flex className={styles.rect} gap={8}>
        <Input
          placeholder='Filled'
          size='small'
          style={{ width: 50 }}
          value={width}
          variant='filled'
          onChange={(e) => {
            const value = Number(e.target.value);
            if (/^\d+$/.test(e.target.value)) {
              const newWidth =
                x + value < windowWidth ? value : windowWidth - x;
              onRectChange(newWidth, height);
            } else {
              onRectChange(width, height);
            }
          }}
        />
        <span>x</span>
        <Input
          placeholder='Filled'
          size='small'
          style={{ width: 50 }}
          value={height}
          variant='filled'
          onChange={(e) => {
            const value = Number(e.target.value);
            if (/^\d+$/.test(e.target.value)) {
              const newHeight =
                y + value < windowHeight ? value : windowHeight - y;
              onRectChange(width, newHeight);
            } else {
              onRectChange(width, height);
            }
          }}
        />
      </Flex>
      <Slider
        style={{ width: 80 }}
        defaultValue={radius}
        min={0}
        max={100}
        onChange={onRadiusChange}
      />
      <Checkbox
        checked={shadow}
        onChange={(e) => {
          onShadowChange(e.target.checked);
        }}
      >
        阴影
      </Checkbox>
    </Flex>
  );
};
