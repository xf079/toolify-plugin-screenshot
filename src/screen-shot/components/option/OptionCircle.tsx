import { FC, memo } from 'react';
import { Checkbox, ColorPicker, Flex, Slider, Typography } from 'antd';
import { useControllableValue } from 'ahooks';
import { circleDefaultOptions, ToolColorList } from '../../config';

export interface ICircleOptions {
  options?: IShapeOption;
  defaultOptions?: IShapeOption;
  onUpdateOptions: (options: IShapeOption) => void;
}

export const OptionCircle: FC<ICircleOptions> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: circleDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  return (
    <Flex gap={12}>
      <Flex vertical gap={6}>
        <Flex justify='space-between' gap={6} align='center'>
          <Typography.Text style={{ fontSize: 12 }}>大小</Typography.Text>
          <Slider
            min={1}
            max={40}
            defaultValue={1}
            value={state.size}
            onChange={(value) => {
              updateState({ ...state, size: value });
            }}
            style={{ width: 80 }}
          />
        </Flex>
        <Flex justify='space-between' gap={6} align='center'>
          <Typography.Text style={{ fontSize: 12 }}>透明度</Typography.Text>
          <Slider
            min={0}
            max={100}
            defaultValue={1}
            value={(state.opacity || 0) * 100}
            onChange={(value) => {
              updateState({ ...state, opacity: value / 100 });
            }}
            style={{ width: 80 }}
          />
        </Flex>
      </Flex>
      <Flex wrap justify='start' align='center' gap={8} style={{ width: 90 }}>
        {ToolColorList.map((val) => (
          <a
            key={val}
            className='color-item'
            style={{ backgroundColor: val }}
          />
        ))}
        <ColorPicker
          value={state.color}
          disabledAlpha
          onChange={(value) => {
            updateState({ ...state, color: `#${value.toHex()}` });
          }}
        >
          <a
            className='color-item'
            style={{ backgroundColor: state.color }}
          ></a>
        </ColorPicker>
      </Flex>
      <Flex vertical>
        <Checkbox
          checked={state.full}
          onChange={(e) => {
            updateState({ ...state, full: e.target.checked });
          }}
        >
          空心
        </Checkbox>
      </Flex>
    </Flex>
  );
});
