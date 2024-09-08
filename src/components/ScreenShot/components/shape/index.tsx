import { Group } from 'react-konva';
import { IShape } from '../../types';
import { ShapeRect } from './ShapeRect.tsx';
import { ShapeArrow } from './ShapeArrow.tsx';

export interface Shape {
  list: IShape[];
}

export const Shape = ({ list }: Shape) => {
  return (
    <Group>
      {list.map((item, index) => {
        if (item.type === 'Rect') {
          return <ShapeRect shapeProps={item} key={index} />;
        }

        if (item.type === 'Arrow') {
          return <ShapeArrow shapeProps={item as never} key={index} />;
        }
        return null;
      })}
    </Group>
  );
};
