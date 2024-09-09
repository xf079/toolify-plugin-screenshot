import Konva from 'konva';

interface IOptionsType {
  size?: number;
  opacity?: number;
  color?: string;
  full?: boolean;
  radius?: boolean;
}

interface IToolType {
  name: string;
  title?: string;
  action?: boolean;
  width: number;
  height: number;
  options?: IOptionsType;
}

interface ISelectToolType {
  name: string;
  options?: IOptionsType;
}

export interface IShape extends Konva.NodeConfig {
  type: string;
}
