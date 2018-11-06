import { AppState } from '@csnext/cs-client';
import { IDatasource, IDashboard } from '@csnext/cs-core';
import io from 'socket.io-client';

export class Chart implements IDatasource {

  public id = 'chart';

  public execute(): Promise<any> {

    return new Promise((resolve, reject) => {
      resolve({
        columns: [
          ["data", 91.4]
        ],
        type: "gauge"
      });
    });
  }

}
