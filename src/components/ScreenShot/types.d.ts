import Konva from 'konva';
import { FunctionComponent, SVGProps } from 'react';


interface IToolType {
  name: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
  title?: string;
  isSelect?: boolean;
  width: number;
  height: number;
}


export interface IShape extends Konva.NodeConfig {
  type: string;
}