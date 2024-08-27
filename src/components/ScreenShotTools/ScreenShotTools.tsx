import { FC } from 'react';
import './ScreenShotTools.less';

export interface ScreenShotToolsProps {
  // TODO: Add props
  x: number;
  y: number;
}

const ScreenShotTools: FC<ScreenShotToolsProps> = (props) => {
  return (
    <div
      className='screen-shot-tools'
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      <div className='container'>
        <div className='btn-item'>
          <span className='border-icon'></span>
        </div>
        <div className='btn-item'>
          <span className='circle-icon'></span>
        </div>
        <div className='btn-item'>
          <span className='uil--line-alt'></span>
        </div>
        <div className='btn-item'>
          <span className='mdi--arrow-top-right-thin'></span>
        </div>
      </div>
    </div>
  );
};

export default ScreenShotTools;
