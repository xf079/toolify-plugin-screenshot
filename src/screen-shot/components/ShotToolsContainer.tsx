import { FC, Fragment, useState } from 'react';
import { Flex, Popover, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import { ToolIconList, ToolList } from '../config';
import { RectOptions } from './options/RectOptions';
import { CircleOptions } from './options/CircleOptions';

import type { IOptionsType, ISelectToolType, IToolType } from '../types';
import { useLocalStorageState } from 'ahooks';

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
  const [toolList, updateToolList] = useLocalStorageState('local-tools', {
    defaultValue: ToolList,
    listenStorageChange: true,
  });
  const [currentTool, setCurrentTool] = useState<ISelectToolType>();

  const onItemClick = (item: IToolType) => {
    if (item.action) {
      setCurrentTool({
        name: item.name,
        options: item.options
      });
    }
    props.onAction(item.name);
  };

  const onOptionsUpdate = (options: IOptionsType) => {
    if (currentTool) {
      setCurrentTool({
        ...currentTool,
        options
      });
      updateToolList((prevState) => {
        if (!prevState) return prevState;
        const index = prevState.findIndex(
          (tool) => tool.name === currentTool.name
        );
      });
    }
  };

  console.log(toolList);

  return (
    <Flex
      className={styles.container}
      align='center'
      justify='center'
      gap={6}
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      {(toolList || []).map((tool) => {
        const Icon = ToolIconList[tool.name];
        if (tool.action) {
          return (
            <Popover
              key={tool.name}
              overlayClassName={styles.popover}
              content={
                <Fragment>
                  {tool.name === 'Rect' && (
                    <RectOptions
                      options={tool.options}
                      onUpdateOptions={onOptionsUpdate}
                    />
                  )}
                  {tool.name === 'Circle' && (
                    <CircleOptions
                      options={tool.options}
                      onUpdateOptions={onOptionsUpdate}
                    />
                  )}
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
                  <Icon width={tool.width} height={tool.height} />
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
            <Icon width={tool.width} height={tool.height} />
          </div>
        );
      })}
    </Flex>
  );
};
