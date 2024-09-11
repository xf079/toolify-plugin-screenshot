interface IShotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IShapeOption {
  size?: number;
  opacity?: number;
  color?: string;
  full?: boolean;
  radius?: boolean;
}

type IOptionActionKey =
  | 'Rect'
  | 'Circle'
  | 'Line'
  | 'Arrow'
  | 'Pencil'
  | 'Mosaic'
  | 'Text';

type IOptionsKeyType =
  | IOptionActionKey
  | 'Pinned'
  | 'Refresh'
  | 'Close'
  | 'Download'
  | 'Success';

interface IToolType {
  type: IOptionActionKey;
  title?: string;
  width: number;
  height: number;
  options?: IShapeOption;
}

interface IToolSimpleType {
  type: IOptionsKeyType;
  width: number;
  height: number;
}

type IToolOptionsType = Record<IOptionActionKey, IShapeOption>;

interface ISelectToolOptionType {
  type: IOptionsKeyType;
  options?: IOptionShape;
}

interface IShapeType {
  type: IOptionsKeyType;
  options?: IShapeOption;
  x?: number;
  y?: number;
  endX?: number;
  endY?: number;
}
