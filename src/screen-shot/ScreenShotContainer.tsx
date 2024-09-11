import { ShotProvider } from './Context.tsx';
import ScreenShot, { ScreenShotProps } from './ScreenShot.tsx';
import { FC } from 'react';
import { ConfigProvider } from 'antd';

const ScreenShotContainer: FC<ScreenShotProps> = (props) => (
  <ShotProvider>
    <ConfigProvider
      componentSize='small'
      theme={{
        cssVar: true,
        hashed: false,
        token: {
          motion: false,
          colorPrimary: props.primaryColor
        },
        components: {
          Slider: {
            boxShadow: 'none',
            controlHeight: 10
          }
        }
      }}
    >
      <ScreenShot {...props} />
    </ConfigProvider>
  </ShotProvider>
);

export default ScreenShotContainer;
