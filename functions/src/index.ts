import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const DEFAULT_DOC = {
  clap: 0,
  think: 0
};

admin.initializeApp(functions.config().firebase);

const app = express();
app.use(cors({ origin: true }));

const db = admin.firestore();
const collection = db.collection('reflex');
const increment = admin.firestore.FieldValue.increment(1);

const getStatus = async (request: any, response: any) => {
  const docRef = collection.doc('test');
  const doc = await docRef.get();

  response.send({
    success: doc.exists,
    data: doc.exists ? doc.data() : null
  }); 
}

const updateStatus = async (request: any, response: any) => {
  const type = request.body['type'] || '';
  const postId = request.params['postId'] || 'test';
  const docRef = collection.doc(postId);

  console.log('DOC', postId, docRef);
  let success = false;
  let data = null;
  let doc = null;

  if (!!type) {
    doc = await docRef.get();
    if (!doc.exists) {
      // TODO: combine with UPDATE
      await docRef.create(DEFAULT_DOC);
      console.log(`Collection doc  ${postId} added!`);
    }

    try {
      await docRef.update({ [type]: increment}); 
      success = true;
    } catch(ex) {
      console.warn('Update was unsuccessful!', ex);
    }

    doc = await docRef.get();
    data = doc.data();
  }

  response.send({ success, data })
}

app.get('/', getStatus);
app.post('/', updateStatus);
app.post('/:postId', updateStatus);

export const reaction = functions.https.onRequest(app);