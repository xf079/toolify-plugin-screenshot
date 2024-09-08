import { FC, Fragment, useState } from 'react';
import {
  ColorPicker,
  Flex,
  Popover,
  Slider,
  Tooltip,
  Typography
} from 'antd';
import { customColorList, toolList } from '../config.ts';
import { IToolType } from '../types';

export interface ShotToolsContainerProps {
  x: number;
  y: number;
  position: 'top' | 'bottom';
  onAction: (name: string) => void;
}

export const ShotToolsContainer: FC<ShotToolsContainerProps> = (props) => {
  const [currentTool, setCurrentTool] = useState<IToolType>();
  const [color, setColor] = useState<string>('#e12160');

  const onItemClick = (item: IToolType) => {
    if (item.isSelect) {
      setCurrentTool(item);
    }
    props.onAction(item.name);
  };
  return (
    <div
      className='shot-tools-container'
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      <div className='container'>
        {toolList.map((tool) => {
          const IconComp = tool.icon;
          if (tool.isSelect) {
            return (
              <Popover
                content={
                  <Fragment>
                    <Flex gap={12}>
                      <Flex vertical gap={6}>
                        <Flex justify='space-between' gap={6} align='center'>
                          <Typography.Text style={{ fontSize: 12 }}>
                            宽度
                          </Typography.Text>
                          <Slider style={{ width: 80 }} />
                        </Flex>
                        <Flex justify='space-between' gap={6} align='center'>
                          <Typography.Text style={{ fontSize: 12 }}>
                            透明度
                          </Typography.Text>
                          <Slider style={{ width: 80 }} />
                        </Flex>
                      </Flex>
                      <Flex
                        wrap
                        justify='start'
                        align='center'
                        gap={8}
                        style={{ width: 90 }}
                      >
                        {customColorList.map((val) => (
                          <a
                            className='color-item'
                            style={{ backgroundColor: val }}
                          ></a>
                        ))}
                        <ColorPicker
                          value={color}
                          onChange={(value, hex) => {
                            console.log(value, hex);
                            setColor(hex);
                          }}
                        >
                          <a
                            className='color-item'
                            style={{ backgroundColor: color }}
                          ></a>
                        </ColorPicker>
                      </Flex>
                    </Flex>
                  </Fragment>
                }
                style={{}}
                placement={(props.position + 'Left') as never}
                open={currentTool?.name === tool.name}
                trigger='click'
                key={tool.name}
              >
                <Tooltip title={tool.title}>
                  <div
                    className={`btn-item ${currentTool === tool ? 'active' : ''}`}
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
              className={`btn-item ${currentTool === tool ? 'active' : ''}`}
              onClick={() => onItemClick(tool)}
            >
              <IconComp width={tool.width} height={tool.height} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
