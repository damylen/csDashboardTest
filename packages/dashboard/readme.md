# CS demo project

## Installation

Make sure yarn, typescript and lerna are installed globally:

`npm install yarn typescript lerna -g`

After checking out the code, update the references:

`yarn` 

and start in dev mode:

`yarn dev`

## Configuration

THe application consists of two parts: a client and a server. Both are managed by [Lerna](https://lernajs.io/) and are located in the ./packages/ folder.

### Server
The server uses [nestjs](https://nestjs.com/) with a simple layer rest api that can be used in the client map component:
`http://localhost:3000/layers`
`http://localhost:3000/layers/groningen` 

It also has simple support for websockets. This is located in the 'src/app.service.ts' file.

### Client
The client uses the [Common Sense Framework](https://github.com/TNOCS/csnext). It will start at the following url:
`http://localhost:8080/#/simpel`

There are currently two dashboards configured: simpel & dashboard. The configuration for both can be found in: 'src/test-project.ts' 

For the map component in the dashboard to work correctly you get a [MapBox Token](https://www.mapbox.com/maps/) and update the configuration.

There is a 'project' datasource (/src/classes/project.ts) that handles the websocket connection with the server and 3 example components available in (/src/compoments). If you want to interact with the project datasource you can define a datasource in the configuration, e.g:

```json
       {
          id: 'navigator',
          component: TestComponent,
          datasource: 'project',
          options: { class: 'navigator-container' }
        }
```

The instance of the Project class will now be available for Vue to bind: 

```html
<div v-if="widget.content"> {{ widget.content.seconds }}</div>
```

or from code:

```typescript

get project() : Project | undefined  {
    if (this.widget && this.widget.content) {
      return this.widget.content as Project;
    }
  }
```

todo: Other concepts that need more clarification later: dashboard layout, managers, plugins

