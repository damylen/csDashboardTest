import Component from 'vue-class-component';
import { WidgetBase, AppState } from '@csnext/cs-client';

import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { IWidget } from '@csnext/cs-core';
import { Watch } from 'vue-property-decorator';
import { Project } from '@/classes/Project';

@Component({
  name: 'background-component',
  components: { VuePerfectScrollbar },
  
  template: require('./background-component.html')
} as any)
export class BackgroundComponent extends WidgetBase {

  public widget!: IWidget;
  public project?: Project;

  public mounted() {
    
  }


}
