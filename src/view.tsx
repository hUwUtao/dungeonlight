import { createRef, useEffect } from "react";
import DungeonInstance from "dungeon";

function Game(instance: DungeonInstance) {
  instance.loadlevel("/level/desert.tmx");
}

const opt = {
  view: {
    width: 640,
    height: 480,
  },
};

export default function View() {
  const ref = createRef<HTMLDivElement>();
  useEffect(
    () => Game(new DungeonInstance(ref.current || new HTMLDivElement(), opt)),
    []
  );
  return (
    <div
      id="view"
      ref={ref}
      style={{
        ...opt.view,
      }}
    ></div>
  );
}
