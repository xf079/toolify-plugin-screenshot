import { ScreenShot } from './components/ScreenShot';
import BgImage from './assets/bg2.webp';

const App = () => {
  return (
    <ScreenShot
      image={BgImage}
      width={window.innerWidth}
      height={window.innerHeight}
      primaryColor='#1677ff'
    />
  );
};

export default App;
