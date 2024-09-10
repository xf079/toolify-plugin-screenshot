export const ToolColorList = [
  '#f5222d',
  '#fa541c',
  '#fa8c16',
  '#52c41a',
  '#13c2c2',
  '#2f54eb',
  '#722ed1'
];

export const rectDefaultOptions: IShapeOption = {
  size: 5,
  opacity: 1,
  color: ToolColorList[0],
  full: false,
  radius: false
};

export const circleDefaultOptions: IShapeOption = {
  size: 5,
  opacity: 1,
  color: ToolColorList[0],
  full: false
};

export const lineDefaultOptions: IShapeOption = {
  size: 1,
  opacity: 1,
  color: ToolColorList[0]
};

export const arrowDefaultOptions: IShapeOption = {
  size: 1,
  opacity: 1,
  color: ToolColorList[0]
};

/**
 * 操作选项工具栏
 */
export const ToolList: IToolType[] = [
  {
    type: 'Rect',
    title: '矩形',
    width: 20,
    height: 20,
    options: rectDefaultOptions
  },
  {
    type: 'Circle',
    title: '圆形',
    width: 20,
    height: 20,
    options: circleDefaultOptions
  },
  {
    type: 'Line',
    title: '直线',
    width: 16,
    height: 16,
    options: lineDefaultOptions
  },
  {
    type: 'Arrow',
    title: '箭头',
    width: 20,
    height: 20,
    options: arrowDefaultOptions
  },
  {
    type: 'Pencil',
    title: '铅笔',
    width: 16,
    height: 16,
    options: arrowDefaultOptions
  },
  {
    type: 'Mosaic',
    title: '马赛克',
    width: 16,
    height: 16,
    options: arrowDefaultOptions
  },
  {
    type: 'Text',
    title: '文本',
    width: 18,
    height: 18,
    options: arrowDefaultOptions
  }
];

/**
 * 单操作工具栏
 */
export const ToolSimpleList: IToolSimpleType[] = [
  {
    type: 'Pinned',
    width: 16,
    height: 16
  },
  {
    type: 'Refresh',
    width: 20,
    height: 20
  },
  {
    type: 'Close',
    width: 20,
    height: 20
  },
  {
    type: 'Download',
    width: 18,
    height: 18
  },
  {
    type: 'Success',
    width: 20,
    height: 20
  }
];
