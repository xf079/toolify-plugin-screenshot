import { IToolType } from './types';
import {
  CircleIcon,
  RectIcon,
  LineIcon,
  ArrowTopRightIcon,
  EditIcon,
  MosaicIcon,
  TextIcon,
  PinnedIcon,
  RefreshIcon,
  CloseIcon,
  DownloadIcon,
  SuccessIcon
} from './icon';

export const ToolColorList = [
  '#f5222d',
  '#fa541c',
  '#fa8c16',
  '#52c41a',
  '#13c2c2',
  '#2f54eb',
  '#722ed1'
];


export const ToolIconList:Record<any, any> = {
  Rect: RectIcon,
  Circle: CircleIcon,
  Line: LineIcon,
  Arrow: ArrowTopRightIcon,
  Pencil: EditIcon,
  Mosaic: MosaicIcon,
  Text: TextIcon,
  Pinned: PinnedIcon,
  Refresh: RefreshIcon,
  Close: CloseIcon,
  Download: DownloadIcon,
  Success: SuccessIcon
}


export const rectDefaultOptions = {
  size: 5,
  opacity: 1,
  color: ToolColorList[0],
  full: false,
  radius: false
}

export const circleDefaultOptions = {
  size: 5,
  opacity: 1,
  color: ToolColorList[0],
  full: false
}


export const ToolList: IToolType[] = [
  {
    name: 'Rect',
    title: '矩形',
    action: true,
    width: 20,
    height: 20,
    options: rectDefaultOptions
  },
  {
    name: 'Circle',
    title: '圆形',
    action: true,
    width: 20,
    height: 20,
    options: circleDefaultOptions
  },
  {
    name: 'Line',
    title: '直线',
    action: true,
    width: 16,
    height: 16
  },
  {
    name: 'Arrow',
    title: '箭头',
    action: true,
    width: 20,
    height: 20
  },
  {
    name: 'Pencil',
    title: '铅笔',
    action: true,
    width: 16,
    height: 16
  },
  {
    name: 'Mosaic',
    title: '马赛克',
    action: true,
    width: 16,
    height: 16
  },
  {
    name: 'Text',
    title: '文本',
    action: true,
    width: 18,
    height: 18
  },
  {
    name: 'Pinned',
    width: 16,
    height: 16
  },
  {
    name: 'Refresh',
    width: 20,
    height: 20
  },
  {
    name: 'Close',
    width: 20,
    height: 20
  },
  {
    name: 'Download',
    width: 18,
    height: 18
  },
  {
    name: 'Success',
    width: 20,
    height: 20
  }
];
