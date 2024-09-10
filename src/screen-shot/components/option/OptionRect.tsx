import { FC, memo, useState } from 'react';
import { Checkbox, ColorPicker, Flex, Slider, Typography } from 'antd';
import { rectDefaultOptions, ToolColorList } from '../../config';
import { useControllableValue } from 'ahooks';
import { SuccessIcon } from '../../icon';
import { useStyles } from './styles';

export interface IRectOptions {
  options?: IShapeOption;
  defaultOptions?: IShapeOption;
  onUpdateOptions: (options: IShapeOption) => void;
}

export const OptionRect: FC<IRectOptions> = memo((props) => {
  const { styles, cx } = useStyles();
  const [state, updateState] = useControllableValue(props, {
    defaultValue: rectDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  const [hasCustomColor, setHasCustomColor] = useState(false);

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
            value={(state.opacity || 1) * 100}
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
            className={cx(styles.item)}
            style={{ backgroundColor: val }}
            onClick={() => {
              setHasCustomColor(false);
              updateState({ ...state, color: val });
            }}
          >
            {state.color === val && <SuccessIcon width={14} height={14} />}
          </a>
        ))}
        <ColorPicker
          value={state.color}
          disabledAlpha
          onChange={(value) => {
            setHasCustomColor(true);
            updateState({
              ...state,
              color: `#${value.toHex()}`
            });
          }}
        >
          <a
            className='color-item'
            style={{ backgroundColor: state.color }}
          >
            {hasCustomColor && <SuccessIcon width={14} height={14} />}
          </a>
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
