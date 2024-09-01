import { FC } from 'react';
import { Checkbox, Flex, Input, Slider } from 'antd';

export interface ShotRectContainerProps {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  shadowEnabled: boolean;
  onChange: (val: number) => void;
  onRectChange: (width: number, height: number) => void;
  onShadowChange: (shadowEnabled: boolean) => void;
}
export const ShotRectContainer: FC<ShotRectContainerProps> = ({
  x,
  y,
  width,
  height,
  radius,
  shadowEnabled,
  onChange,
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
        />
        <span>x</span>
        <Input
          placeholder='Filled'
          size='small'
          style={{ width: 50 }}
          value={height}
          variant='filled'
        />
      </Flex>
      <Slider
        style={{ width: 120 }}
        defaultValue={radius}
        min={0}
        max={100}
        onChange={onChange}
      />
      <Checkbox
        checked={shadowEnabled}
        onChange={(e) => {
          onShadowChange(e.target.checked);
        }}
      >
        阴影
      </Checkbox>
    </Flex>
  );
};
