import { Get, Controller, Param } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Layer } from './layer.entity';
import * as tgj from '@mapbox/togeojson';
var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser();

const layerFolder = './static/layers';

@Controller('layers')
export class LayerController {
  public layers: Layer[] = [];

  constructor() {
    fs.readdirSync(layerFolder).forEach(file => {
      console.log(file);
      let extension = path.extname(file);
      let title = path.basename(file).replace(extension, '');
      const layer = {
        id: title
          .split(' ')
          .join('_')
          .toLowerCase(),
        source: path.join(layerFolder, file),
        sourceType: extension.replace('.', ''),
        type: 'fill',
        title: title
      } as Layer;
      console.log('Init Layer');
      this.initLayer(layer);
      this.layers.push(layer);
    });
  }

  private findColor(content: GeoJSON.FeatureCollection): string {
    if (content.features) {
      for (const f of content.features) {
        if (f.properties) {
          for (const p in f.properties) {
            if (f.properties[p].match(/\#(.*)/)) {
              return f.properties[p];
            }
          }
        }
      }
    }
    return 'lightgray';
  }

  private loadLayer(layer: Layer) {
    let content = fs.readFileSync(layer.source).toString();    
    switch (layer.sourceType) {
      case 'kml':
        let kml = parser.parseFromString(content);
        layer._geojson = tgj.kml(kml) as GeoJSON.FeatureCollection;
        break;
      default:
        layer._geojson = JSON.parse(content) as GeoJSON.FeatureCollection;
    }
  }

  
  private findType(content: GeoJSON.FeatureCollection): string {
    let types :string[] = [];
    for (const f of content.features) {
      if (f.geometry && f.geometry.type && types.indexOf(f.geometry.type) === -1) { types.push(f.geometry.type); }
    }
    if (types.length === 1) {
      switch (types[0]) {
        case 'Point': return 'poi';
        case 'LineString': return 'line';
        case 'Polygon': return 'fill';        
      } 
    }
    else {
      return 'geojson';
    }    
    return 'geojson';
  }

  private initLayer(layer: Layer) {
    this.loadLayer(layer);
    if (layer._geojson) {
      layer.type = this.findType(layer._geojson);
      layer.color = this.findColor(layer._geojson);
    }
  }


  @Get()
  root(): Layer[] {
    let res = [];
    this.layers.map(l => res.push({ id: l.id, type: l.type, color: l.color, title: l.title }));
    return res;
  }
  @Get(':layer')
  getLayer(@Param() params: any): string {
    let res = this.layers.find(l => l.id === params.layer);
    if (res) {            
      return JSON.stringify(res._geojson);
    } else {
      return undefined;
    }
  }
}
