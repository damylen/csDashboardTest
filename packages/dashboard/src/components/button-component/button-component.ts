import Component from 'vue-class-component';
import { WidgetBase, AppState } from '@csnext/cs-client';

import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { IWidget } from '@csnext/cs-core';
import { Watch } from 'vue-property-decorator';
import { Project } from '@/classes/Project';

@Component({
  name: 'button-component',
  components: { VuePerfectScrollbar },
  
  template: require('./button-component.html')
} as any)
export class ButtonComponent extends WidgetBase {

  public widget!: IWidget;
  private _sliderData = 0;
  get project() : Project | undefined  {
    if (this.widget && this.widget.content) {
      return this.widget.content as Project;
    }
  }

  get sliderData() : number {
    return this._sliderData;
  }

  set sliderData(value: number) {
    this._sliderData = value;
    if (this.project) {
      this.project.socket.emit('slider',{value: value});
    }
  }

  buttonClick() {
    if (this.project) {
      this.project.socket.emit('button','click');
    }

  }


}
