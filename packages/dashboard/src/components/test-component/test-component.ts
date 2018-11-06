import Component from 'vue-class-component';
import { WidgetBase, AppState } from '@csnext/cs-client';
import './test-component.css';

import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { IWidget } from '@csnext/cs-core';
import { Watch } from 'vue-property-decorator';
import { Project } from '@/classes/Project';

@Component({
  name: 'test-component',
  components: { VuePerfectScrollbar },
  
  template: require('./test-component.html')
} as any)
export class TestComponent extends WidgetBase {

  public widget!: IWidget;
  

  public mounted() {
    
  }


}
