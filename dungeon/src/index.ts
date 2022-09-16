import * as PIXI from "pixi.js";
// import Tiled from "./modules/tiled";
import TiledMap, { middleware as tmxl } from "./modules/tiled";

interface DungeonOpts {
  view: {
    width: number;
    height: number;
  };
}

class DungeonInstance {
  app: PIXI.Application;
  loader: PIXI.Loader = new PIXI.Loader();
  constructor(parent: HTMLDivElement, { view }: DungeonOpts) {
    this.app = new PIXI.Application({
      width: view.width,
      height: view.height,
    });
    parent.appendChild(this.app.view);
    this.app.loader = this.loader;
    this.loader.use(tmxl);
  }

  loadlevel(map: string) {
    // this.app.loader.add("map", map).load((loader, resources) => {
    //   loader.use(tmxl);
    //   this.app.stage.addChild(new TiledMap(resources["map"]));
    // });
    this.loader.add("map", map).load((loader, resource) => {
      this.app.stage.addChild(new TiledMap(resource.map));
    });
  }
}

export default DungeonInstance;
