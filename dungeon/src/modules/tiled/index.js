import * as PIXI from "pixi.js";

import path from "path-browserify";
// import tmx from "tmx-parser";
import { parse } from "./libtmx";

import TileSet from "./TileSet";
import TileLayer from "./TileLayer";
import CollisionLayer from "./CollisionLayer";

export function middleware(resource, next) {
  if (resource.extension !== "tmx") return next();

  const xmlString = resource.xhr.responseText;
  const pathToFile = resource.url;

  parse(xmlString, pathToFile, (error, map) => {
    if (error) throw error;

    resource.data = map;
    next();
  });
}

export default class TiledMap extends PIXI.Container {
  constructor(resource) {
    super();

    // const resource = PIXI.Loader.shared.resources[resourceId]
    const route = path.dirname(resource.url);

    this.setDataProperties(resource.data);
    this.setDataTileSets(resource.data, route);
    this.setDataLayers(resource.data);
  }

  setDataProperties(data) {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(data, property)) {
        this[property] = data[property];
      }
    }
  }

  setDataTileSets(data, route) {
    this.tileSets = [];
    data.tileSets.forEach((tileSetData) =>
      this.tileSets.push(new TileSet(route, tileSetData))
    );
  }

  setDataLayers(data) {
    data.layers.forEach((layerData) => {
      if (layerData.type === "tile") {
        this.setTileLayer(layerData);
        return;
      }

      this.layers[layerData.name] = layerData;
    });
  }

  setTileLayer(layerData) {
    if (layerData.name === "Collisions") {
      this.layers.CollisionLayer = new CollisionLayer(layerData);
      return;
    }

    const tileLayer = new TileLayer(layerData, this.tileSets);
    this.layers[layerData.name] = tileLayer;
    this.addLayer(tileLayer);
  }

  addLayer(layer) {
    this.addChild(layer);
  }
}
