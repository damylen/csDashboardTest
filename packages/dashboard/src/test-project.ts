import { IProject, ILayoutManagerConfig, IMenu } from '@csnext/cs-core';
import { LayoutManager, MdWidget, ImageWidget, Grid } from '@csnext/cs-client';
import './assets/example.css';
import './assets/styles.css';
import { SplitPanel, SplitPanelDashboardOptions } from '@csnext/cs-split-panel';
import { Billboard } from '@csnext/cs-billboard';

import {
  CsMap,
  MapOptions,
  LayerSelection,
  LayerSources,
  MapLayers,
  LayerSource,
  GeojsonLayer
} from '@csnext/cs-map';
import { Project } from './classes/Project';
import { TestComponent } from './components/test-component/test-component';
import Component from 'vue-class-component';
import { BackgroundComponent } from './components/background-component/background-component';
import { ButtonComponent } from './components/button-component/button-component';
const LAYER_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/layers/' : 'http://192.168.1.53:3000/layers/';

LayoutManager.add({
  id: 'split-panel',
  component: SplitPanel
} as ILayoutManagerConfig);

export const project: IProject = {
  header: {
    title: '',
    breadcrumbs: false,
    dense: false
  },
  navigation: {
    style: 'tabs',
    search: {
      enabled: false
    }
  },
  data: { seconds: 0 },
  datasources: {
    layers: new LayerSources({
      buienradar: {
        title: 'Buienradar',
        type: 'raster',
        url: 'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?SERVICE=WMS&VERSION=1.3.0&bbox={bbox-epsg-3857}&REQUEST=GetMap&format=image/png&width=265&height=256&LAYERS=RADNL_OPER_R___25PCPRR_L3_COLOR&CRS=EPSG%3A3857&transparent=true',
        tileSize: 256,
      } as LayerSource,
      luchtfoto: {
        title: 'Lucht foto\'s actueel (25m)',
        type: 'raster',
        url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?SERVICE=WMS&VERSION=1.3.0&bbox={bbox-epsg-3857}&REQUEST=GetMap&format=image/png&width=265&height=256&LAYERS=Actueel_ortho25&CRS=EPSG%3A3857&transparent=true&styles=default',
        tileSize: 256,
      } as LayerSource,
      hoogtekaart: {
        title: 'Hoogte Kaart (AHN3)',
        type: 'raster',
        url: 'https://geodata.nationaalgeoregister.nl/ahn3/wms?SERVICE=WMS&VERSION=1.3.0&bbox={bbox-epsg-3857}&REQUEST=GetMap&format=image/png&width=265&height=256&LAYERS=ahn3_5m_dsm&CRS=EPSG%3A3857&transparent=true&styles=default',
        tileSize: 256,
      } as LayerSource,

      // https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts?layer=Actueel_ortho25&style=default&tilematrixset=EPSG%3A28992&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=13&TileCol=3724&TileRow=3782
      gemeenten: {
        title: 'Gemeenten',
        url: '/layers/townships.json'
      } as LayerSource,
      wijken: {
        title: 'Wijken',
        url: '/layers/wijk_2017.json'
      } as LayerSource,
      buurten: {
        title: 'Buurten',
        url: '/layers/buurt_2017.json'
      } as LayerSource,
      provincie: {
        title: 'Provincie',
        url: '/layers/provincie_2017.json'
      } as LayerSource,
      evenement: {
        title: 'Evenement',
        url: '/layers/evenement.json'
      } as LayerSource
    }),
    mainmap: new MapLayers(
      [

        // { source: 'sectoren', type: 'line', tags: ['evenement'] } as MapLayer,
        { source: 'gemeenten', tags: ['grenzen'], type: 'line' } as GeojsonLayer,
        { source: 'wijken', tags: ['grenzen'], type: 'line' } as GeojsonLayer,
        { title: 'Buurten', source: 'buurten', tags: ['grenzen'], type: 'line' } as GeojsonLayer,
        { source: 'provincie', tags: ['grenzen'], type: 'line' } as GeojsonLayer,
        { source: 'buienradar', description: 'Huidige neerslag', color: 'blue', tags: ['weer'], type: 'raster' } as GeojsonLayer,
        { source: 'hoogtekaart', description: 'Hoogte kaart', color: 'darkblue', tags: ['basis kaarten'], type: 'raster' } as GeojsonLayer,
        { source: 'luchtfoto', description: 'Luchtfoto', color: 'green', tags: ['basis kaarten'], type: 'raster' } as GeojsonLayer
      ],
      'layers',
      [
        { id: 'event', type: 'layer-server', options: { tags: ['evenement'], url: LAYER_URL } as any }
      ]
    ),
    project: new Project()
  },
  theme: {
    dark: false,
    colors: {
      primary: '#EBF0F5',
      secondary: '#e5e9ea',
      accent: '#82B1FF',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
      menu: '#EBF0F5'
    }
  },

  // leftSidebar: {
  //   open: true,
  //   mini: false,
  //   floating: true,
  //   clipped: true,
  //   permanent: false,
  //   temporary: false
  // },
  rightSidebar: {
    open: false,
    clipped: false,
    width: 500,
    // floating: true,
    dashboard: {
      widgets: [{ component: MdWidget, data: 'right sidebar' }]
    }
  },
  menus: [


  ],
  dashboards: [
    {
      title: 'Simpel',
      icon: 'assignment',
      path: '/simpel',
      layout: 'grid',
      datasource: 'project',
      leftSidebar: {
        open: false,
        clipped: true,
        dashboard: {
          widgets: [{
            component: MdWidget,
            data: ' Menuutje ? s'
          }
          ]
        }
      },
      footer: { visible: false },
      widgets: [
        
        {
          id: 'background',
          component: BackgroundComponent,
          datasource: 'project',         
          options: { class: 'simple-background-widget' },
        },
        {
          id: 'gauge',
          component: Billboard,
          datasource: 'project',
          data:
          {
            columns: [
              ["data", 91.4]
            ],
            type: "gauge"
          },
          options: { class: 'gauge-widget' },
        },
        {
          id: 'button',
          component: ButtonComponent,
          datasource: 'project',         
          options: { class: 'simple-button-widget' },
        },
      ]
    },
    {
      title: 'Dashboard',
      icon: 'assignment',
      path: '/monitor',
      layout: 'split-panel',
      datasource: 'project',
      leftSidebar: {
        open: false,
        clipped: true,
        dashboard: {
          widgets: [
            {
              component: LayerSelection,
              options: { class: 'layer-selection-widget', searchEnabled: true } as any,
              datasource: 'mainmap'
            }
          ]
        }
      },
      defaultWidgetOptions: {
        widgetBorder: 'widget-border-shadow'

        // height: 300
      },
      options: {

        splitpanel: {
          direction: 'horizontal',
          elements: [
            {
              size: 66,
              splitpanel: {
                direction: 'vertical',
                disableVerticalScroll: true,
                elements: [
                  { size: 20, widgetId: 'navigator' },
                  {
                    size: 80,
                    splitpanel: {
                      direction: 'horizontal',
                      disableVerticalScroll: true,
                      elements: [
                        { size: 50, widgetId: 'chart1' },
                        { size: 50, widgetId: 'chart2' }
                      ]
                    }
                  }
                ]
              }
            },
            { size: 33, widgetId: 'map' }
          ]
        }

      } as SplitPanelDashboardOptions,
      widgets: [
        {
          id: 'chart1',
          component: Billboard,
          data: {

            type: "bar",
            columns: [
              ["data1", 30, 200, 100, 170, 150, 250],
              ["data2", 130, 100, 140, 35, 110, 50]
            ]
          },
          options: { class: 'scenario-risk-container' }

        },
        {
          id: 'chart2',
          component: MdWidget,
          data: "# h1 Heading 8-)"
        },
        {
          id: 'navigator',
          component: TestComponent,
          datasource: 'project',
          options: { class: 'navigator-container' }
        },
        {
          id: 'map',
          component: CsMap,
          datasource: 'mainmap',
          options: {
            class: 'data-map-container',
            token:
              '',
            mbOptions: {
              style: 'mapbox://styles/mapbox/light-v9',
              center: [6.581510, 53.190415],
              zoom: 13
            }
          } as MapOptions
        }
        // {
        //   component: RiskVariables,
        //   options: <any> { x: 0, y: 4, width: 4, height: 5 }
        // },
      ]
    }



  ]
};
