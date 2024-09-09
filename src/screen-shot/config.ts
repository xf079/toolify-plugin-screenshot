import { IToolType } from './types';

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

export const toolList: IToolType[] = [
  {
    name: 'Rect',
    icon: RectIcon,
    title: '矩形工具',
    isSelect: true,
    width: 20,
    height: 20
  },
  {
    name: 'Circle',
    icon: CircleIcon,
    title: '圆形工具',
    isSelect: true,
    width: 20,
    height: 20
  },
  {
    name: 'Line',
    icon: LineIcon,
    title: '直线工具',
    isSelect: true,
    width: 16,
    height: 16
  },
  {
    name: 'Arrow',
    icon: ArrowTopRightIcon,
    title: '箭头工具',
    isSelect: true,
    width: 20,
    height: 20
  },
  {
    name: 'Pencil',
    icon: EditIcon,
    title: '铅笔工具',
    isSelect: true,
    width: 16,
    height: 16
  },
  {
    name: 'Mosaic',
    icon: MosaicIcon,
    title: '马赛克工具',
    isSelect: true,
    width: 16,
    height: 16
  },
  {
    name: 'Text',
    icon: TextIcon,
    title: '文本工具',
    isSelect: true,
    width: 18,
    height: 18
  },
  {
    name: 'Pinned',
    icon: PinnedIcon,
    width: 16,
    height: 16
  },
  {
    name: 'Refresh',
    icon: RefreshIcon,
    width: 20,
    height: 20
  },
  {
    name: 'Close',
    icon: CloseIcon,
    width: 20,
    height: 20
  },
  {
    name: 'Download',
    icon: DownloadIcon,
    width: 18,
    height: 18
  },
  {
    name: 'Success',
    icon: SuccessIcon,
    width: 20,
    height: 20
  }
];

export const customColorList = [
  '#f5222d',
  '#fa541c',
  '#fa8c16',
  '#52c41a',
  '#13c2c2',
  '#2f54eb',
  '#722ed1',
];
