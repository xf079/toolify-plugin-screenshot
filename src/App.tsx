import React, { useEffect, useRef } from "react";
import { Stage, Layer, Image, Text, Rect, Group } from "react-konva";

import BgImage from "./assets/bg.jpg";

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = generateShapes();

const App = () => {
  const [stars, setStars] = React.useState(INITIAL_STATE);

  const image = useRef(new window.Image());

  const handleDragStart = (e) => {
    console.log(e);
  };

  const handleDragMove = (e) => {
    console.log(e);
    
  }

  const handleDragEnd = (e) => {
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        };
      })
    );
  };

  useEffect(() => {
    image.current.src = BgImage;
  }, []);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleDragStart} onMouseMove={handleDragMove} onMouseUp={handleDragEnd}>
      <Layer>
        <Image image={image.current} width={window.innerWidth} height={window.innerHeight} />
      </Layer>
      <Layer>
        <Rect
          width={window.innerWidth}
          height={window.innerHeight}
          fill="rgba(0,0,0,0.4)"
        />
        <Rect
          width={200}
          height={200}
          x={200}
          y={200}
          fill="blue"
          draggable
          cornerRadius={[10, 10, 10, 10]}
          globalCompositeOperation="destination-out"
        />
        <Text text="Try to drag a star" />
      </Layer>
    </Stage>
  );
};

export default App;
