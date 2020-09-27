import * as uuid from 'uuid';
import * as assert from 'assert';
import * as sinon from 'sinon';

import * as functionsTestNonInit from 'firebase-functions-test';

import { getStatus } from '../src/index';

functionsTestNonInit({
  databaseURL: 'https://alxblsk-com.firebaseio.com',
  projectId: 'alxblsk-com',
}, './alxblsk-com-key.json');

describe('', () => {
  it('Should make a valid GET request', async () => {
    // Mock ExpressJS 'req' and 'res' parameters
    const name = uuid.v4();
    const req = {
      query: {},
      body: {
        name: name,
      },
    };
    const res = { send: sinon.stub() };

    // Call tested function
    await getStatus(req, res);

    // Verify behavior of tested function
    assert.ok(res.send.calledOnce);
    return assert.deepStrictEqual(res.send.firstCall.args, [{
      data: {
        clap: 6,
        question: 3,
        think: 1
      },
      success: true
    }]);
  })
})