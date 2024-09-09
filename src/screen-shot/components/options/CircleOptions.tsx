import { Checkbox, ColorPicker, Flex, Slider, Typography } from 'antd';
import { customColorList } from '../../config.ts';
import { useState } from 'react';

export const CircleOptions = () => {
  const [size, setSize] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [color, setColor] = useState('#e12160');

  return (
    <Flex gap={12}>
      <Flex vertical gap={6}>
        <Flex justify='space-between' gap={6} align='center'>
          <Typography.Text style={{ fontSize: 12 }}>大小</Typography.Text>
          <Slider
            min={1}
            max={40}
            defaultValue={1}
            value={size}
            onChange={(value) => setSize(value)}
            style={{ width: 80 }}
          />
        </Flex>
        <Flex justify='space-between' gap={6} align='center'>
          <Typography.Text style={{ fontSize: 12 }}>透明度</Typography.Text>
          <Slider
            min={0}
            max={100}
            defaultValue={1}
            value={opacity * 100}
            onChange={(value) => setOpacity(value / 100)}
            style={{ width: 80 }}
          />
        </Flex>
      </Flex>
      <Flex vertical>
        <Checkbox>空心</Checkbox>
      </Flex>
      <Flex wrap justify='start' align='center' gap={8} style={{ width: 90 }}>
        {customColorList.map((val) => (
          <a
            key={val}
            className='color-item'
            style={{ backgroundColor: val }}
          />
        ))}
        <ColorPicker
          value={color}
          disabledAlpha
          onChange={(value, hex) => {
            console.log(value, hex);
            setColor(hex);
          }}
        >
          <a className='color-item' style={{ backgroundColor: color }}></a>
        </ColorPicker>
      </Flex>
    </Flex>
  );
};
