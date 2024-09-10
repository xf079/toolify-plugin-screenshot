import { FC, Fragment, useState } from 'react';
import { Flex, Popover, Tooltip } from 'antd';
import { useLocalStorageState, useMemoizedFn } from 'ahooks';
import { createStyles } from 'antd-style';
import { ToolList, ToolSimpleList } from '../config';
import { OptionRect, OptionCircle } from './option';
import { ToolIconList } from '../icon';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    position: absolute;
    z-index: 999;
    height: 38px;
    padding: 0 4px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
  `,
  item: css`
    width: 32px;
    height: 32px;
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

export interface ShotToolsContainerProps {
  options?: Record<IOptionActionKey, IShapeOption>;
  x: number;
  y: number;
  position: 'top' | 'bottom';
  onAction: (action: ISelectToolOptionType) => void;
}

export const ShotToolsContainer: FC<ShotToolsContainerProps> = (props) => {
  const { styles, cx } = useStyles();

  const [tools, updateTools] = useLocalStorageState('local-tools', {
    defaultValue: ToolList.map((item) => ({
      ...item,
      options: Object.assign({}, item.options, {})
    })),
    listenStorageChange: true
  });
  const [current, setCurrent] = useState<ISelectToolOptionType>();

  const onItemOptionAction = (item: IToolType) => {
    setCurrent({
      type: item.type,
      options: item.options
    });
    props.onAction({
      type: item.type,
      options: item.options
    });
  };

  const onItemAction = (item: IToolSimpleType) => {
    props.onAction({
      type: item.type
    });
  };

  const onOptionsUpdate = useMemoizedFn((options: IShapeOption) => {
    if (current) {
      setCurrent({ ...current, options });
      if (tools) {
        updateTools(
          tools.map((item) => {
            if (item.type === current.type) {
              return {
                ...item,
                options
              };
            }
            return item;
          })
        );
      }
    }
  });

  return (
    <Flex
      className={styles.container}
      align='center'
      justify='center'
      gap={6}
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      {(tools || []).map((tool) => {
        const Icon = ToolIconList[tool.type];
        return (
          <Popover
            key={tool.type}
            overlayClassName={styles.popover}
            content={
              <Fragment>
                {tool.type === 'Rect' && (
                  <OptionRect
                    options={tool.options}
                    onUpdateOptions={onOptionsUpdate}
                  />
                )}
                {tool.type === 'Circle' && (
                  <OptionCircle
                    options={tool.options}
                    onUpdateOptions={onOptionsUpdate}
                  />
                )}
              </Fragment>
            }
            placement={(props.position + 'Left') as never}
            open={current?.type === tool.type}
            trigger='click'
          >
            <Tooltip title={tool.title}>
              <Flex
                className={cx(
                  styles.item,
                  current?.type === tool.type && styles.active
                )}
                justify='center'
                align='center'
                onClick={() => onItemOptionAction(tool)}
              >
                <Icon width={tool.width} height={tool.height} />
              </Flex>
            </Tooltip>
          </Popover>
        );
      })}
      {ToolSimpleList.map((tool) => {
        const Icon = ToolIconList[tool.type];
        return (
          <Flex
            key={tool.type}
            className={styles.item}
            justify='center'
            align='center'
            onClick={() => onItemAction(tool)}
          >
            <Icon width={tool.width} height={tool.height} />
          </Flex>
        );
      })}
    </Flex>
  );
};
