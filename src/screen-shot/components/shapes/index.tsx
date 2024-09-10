import { Group } from 'react-konva';
import { ShapeRect } from './ShapeRect.tsx';
import { ShapeArrow } from './ShapeArrow.tsx';

export interface ShapesProps {
  list: IShapeType[];
}

export const Shapes = ({ list }: ShapesProps) => {
  return (
    <Group>
      {list.map((item, index) => {
        if (item.type === 'Rect') {
          return <ShapeRect shape={item} key={index} />;
        }

        if (item.type === 'Arrow') {
          return <ShapeArrow shape={item} key={index} />;
        }
        return null;
      })}
    </Group>
  );
};
