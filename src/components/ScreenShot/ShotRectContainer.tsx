import { FC } from 'react';
import { Checkbox, Flex, Input, Slider } from 'antd';

export interface ShotRectContainerProps {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  shadow: boolean;
  onRectChange: (width: number, height: number) => void;
  onRadiusChange: (radius: number) => void;
  onShadowChange: (shadowEnabled: boolean) => void;
}
export const ShotRectContainer: FC<ShotRectContainerProps> = ({
  x,
  y,
  width,
  height,
  radius,
  shadow,
  onRectChange,
  onRadiusChange,
  onShadowChange
}) => {
  return (
    <Flex
      className='shot-rect-container'
      align='center'
      justify='start'
      style={{ top: y - 36, left: x }}
    >
      <Flex className='shot-rect' gap={8}>
        <Input
          placeholder='Filled'
          size='small'
          style={{ width: 50 }}
          value={width}
          variant='filled'
          onChange={(e) => {
            onRectChange(Number(e.target.value), height);
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
            onRectChange(width, Number(e.target.value));
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
