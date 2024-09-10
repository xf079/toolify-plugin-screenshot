import * as React from 'react';
import RectIcon from './rect-icon.svg?react';
import LineIcon from './line-icon.svg?react';
import CircleIcon from './circle-icon.svg?react';
import ArrowTopRightIcon from './arrow-top-right-icon.svg?react';
import EditIcon from './edit-icon.svg?react';
import MosaicIcon from './mosaic-icon.svg?react';
import TextIcon from './text-icon.svg?react';
import PinnedIcon from './pinned-icon.svg?react';
import RefreshIcon from './refresh-icon.svg?react';
import CloseIcon from './close-icon.svg?react';
import DownloadIcon from './download-icon.svg?react';
import SuccessIcon from './success-icon.svg?react';

export const ToolIconList: Record<
  IOptionsKeyType,
  React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>
> = {
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
};

export {
  RectIcon,
  LineIcon,
  CircleIcon,
  ArrowTopRightIcon,
  EditIcon,
  MosaicIcon,
  TextIcon,
  PinnedIcon,
  RefreshIcon,
  CloseIcon,
  DownloadIcon,
  SuccessIcon
};
