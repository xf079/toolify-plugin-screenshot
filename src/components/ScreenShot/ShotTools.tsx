import {
  FC,
  FunctionComponent,
  SVGProps,
  useState
} from 'react';

import RectIcon from './icon/rect-icon.svg?react';
import LineIcon from './icon/line-icon.svg?react';
import CircleIcon from './icon/circle-icon.svg?react';
import ArrowTopRightIcon from './icon/arrow-top-right-icon.svg?react';
import EditIcon from './icon/edit-icon.svg?react';
import MosaicIcon from './icon/mosaic-icon.svg?react';
import TextIcon from './icon/text-icon.svg?react';
import PinnedIcon from './icon/pinned-icon.svg?react';
import RefreshIcon from './icon/refresh-icon.svg?react';
import CloseIcon from './icon/close-icon.svg?react';
import DownloadIcon from './icon/download-icon.svg?react';
import SuccessIcon from './icon/success-icon.svg?react';

export interface ScreenShotToolsProps {
  x: number;
  y: number;
  onAction: (name: string) => void;
}

export interface ToolsItem {
  name: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
  title?: string;
  width: number;
  height: number;
}

const tools: ToolsItem[] = [
  {
    name: 'Rect',
    icon: RectIcon,
    title: 'rectangle tool',
    width:20,
    height:20
  },
  {
    name: 'Circle',
    icon: CircleIcon,
    width:20,
    height:20
  },

  {
    name: 'Line',
    icon: LineIcon,
    width:16,
    height:16
  },
  {
    name: 'Arrow',
    icon: ArrowTopRightIcon,
    width:20,
    height:20
  },
  {
    name: 'Pencil',
    icon: EditIcon,
    width:16,
    height:16
  },
  {
    name: 'Mosaic',
    icon: MosaicIcon,
    width:16,
    height:16
  },
  {
    name: 'Text',
    icon: TextIcon,
    width:18,
    height:18
  },
  {
    name: 'Pinned',
    icon: PinnedIcon,
    width:16,
    height:16
  },
  {
    name: 'Refresh',
    icon: RefreshIcon,
    width:20,
    height:20
  },
  {
    name: 'Close',
    icon: CloseIcon,
    width:20,
    height:20
  },
  {
    name: 'Download',
    icon: DownloadIcon,
    width:18,
    height:18
  },
  {
    name: 'Success',
    icon: SuccessIcon,
    width:20,
    height:20
  }
];

export const ShotTools: FC<ScreenShotToolsProps> = (props) => {
  const [currentTool, setCurrentTool] = useState<ToolsItem>();
  const onItemClick = (item: ToolsItem) => {
    console.log(item);
    if (currentTool === item) {
      setCurrentTool(undefined);
    } else {
      setCurrentTool(item);
    }
    props.onAction(item.name);
  };
  return (
    <div
      className='screen-shot-tools'
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      <div className='container'>
        {tools.map((tool, index) => {
          const IconComp = tool.icon;
          return (
            <div
              className={`btn-item ${currentTool === tool ? 'active' : ''}`}
              key={tool.name}
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
