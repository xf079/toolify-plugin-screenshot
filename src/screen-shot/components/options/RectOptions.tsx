import { FC, memo } from 'react';
import { Checkbox, ColorPicker, Flex, Slider, Typography } from 'antd';
import { rectDefaultOptions, ToolColorList } from '../../config';
import { useControllableValue } from 'ahooks';
import { IOptionsType } from '../../types';

export interface IRectOptions {
  options?: IOptionsType;
  defaultOptions?: IOptionsType;
  onUpdateOptions: (options: IOptionsType) => void;
}

export const RectOptions: FC<IRectOptions> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: rectDefaultOptions,
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
              updateState({
                ...state,
                size: value
              });
            }}
            style={{ width: 48 }}
          />
        </Flex>
        <Flex justify='space-between' gap={6} align='center'>
          <Typography.Text style={{ fontSize: 12 }}>透明度</Typography.Text>
          <Slider
            min={0}
            max={100}
            defaultValue={1}
            value={state.opacity * 100}
            onChange={(value) => {
              updateState({
                ...state,
                opacity: value / 100
              });
            }}
            style={{ width: 48 }}
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
            updateState({
              ...state,
              color: `#${value.toHex()}`
            });
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
            updateState({
              ...state,
              full: e.target.checked
            });
          }}
        >
          <Typography.Text style={{ fontSize: 12 }}>空心</Typography.Text>
        </Checkbox>
        <Checkbox
          checked={state.radius}
          onChange={(e) => {
            updateState({
              ...state,
              radius: e.target.checked
            });
          }}
        >
          <Typography.Text style={{ fontSize: 12 }}>圆角</Typography.Text>
        </Checkbox>
      </Flex>
    </Flex>
  );
});
