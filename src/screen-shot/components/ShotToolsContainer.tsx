import { FC, Fragment, useState } from 'react';
import { ColorPicker, Flex, Popover, Slider, Tooltip, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { customColorList, toolList } from '../config';
import { IToolType } from '../types';
import { RectOptions } from './options/RectOptions.tsx';
import { CircleOptions } from './options/CircleOptions.tsx';

export interface ShotToolsContainerProps {
  x: number;
  y: number;
  position: 'top' | 'bottom';
  onAction: (name: string) => void;
}

const useStyles = createStyles(({ token, css }) => ({
  wrapper: css`
    position: absolute;
    z-index: 999;
    height: 38px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
  `,
  container: css`
    position: absolute;
    z-index: 999;
    height: 38px;
    display: flex;
    padding: 0 4px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
  `,
  item: css`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 5px;
    color: #000;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `,
  active: css`
    background-color: rgba(0, 0, 0, 0.1);
    color: ${token.colorPrimary};
  `,

  popover: css`
    --ant-color-bg-elevated: rgba(255, 255, 255, 0.7);
    .ant-popover-inner {
      padding: 8px;
    }
  `
}));

export const ShotToolsContainer: FC<ShotToolsContainerProps> = (props) => {
  const { styles, cx } = useStyles();
  const [currentTool, setCurrentTool] = useState<IToolType>();
  const [color, setColor] = useState<string>('#e12160');
  const [size, setSize] = useState(1);
  const [opacity, setOpacity] = useState(1);

  const onItemClick = (item: IToolType) => {
    if (item.isSelect) {
      setCurrentTool(item);
    }
    props.onAction(item.name);
  };
  return (
    <Flex
      className={styles.container}
      align='center'
      justify='center'
      gap={6}
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      {toolList.map((tool) => {
        const IconComp = tool.icon;
        if (tool.isSelect) {
          return (
            <Popover
              key={tool.name}
              overlayClassName={styles.popover}
              content={
                <Fragment>
                  {tool.name === 'Rect' && <RectOptions />}
                  {tool.name === 'Circle' && <CircleOptions />}
                </Fragment>
              }
              placement={(props.position + 'Left') as never}
              open={currentTool?.name === tool.name}
              trigger='click'
            >
              <Tooltip title={tool.title}>
                <div
                  className={cx(
                    styles.item,
                    currentTool === tool && styles.active
                  )}
                  onClick={() => onItemClick(tool)}
                >
                  <IconComp width={tool.width} height={tool.height} />
                </div>
              </Tooltip>
            </Popover>
          );
        }
        return (
          <div
            key={tool.name}
            className={styles.item}
            onClick={() => onItemClick(tool)}
          >
            <IconComp width={tool.width} height={tool.height} />
          </div>
        );
      })}
    </Flex>
  );
};
