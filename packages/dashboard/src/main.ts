import Vue from 'vue';
import { CsApp, AppState } from '@csnext/cs-client';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { project } from './test-project';
import { Project } from './classes/Project';


Vue.use(Vuetify);

Vue.config.productionTip = false;

let app = AppState.Instance;

new Vue({
  render: h => h(CsApp as any)
}).$mount('#app');

app.init(project);

(<any>window).app = AppState.Instance;



app.loadDatasource<Project>('project').then(p => {
  console.log('Project info loeaded')
});

let events: Project = new Project();
