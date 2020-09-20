import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const collection = db.collection('reflex');
const increment = admin.firestore.FieldValue.increment(1);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const reflex = {
  getStatus: functions.https.onRequest(async (request, response) => {
    const docRef = collection.doc('test');
    const doc = await docRef.get();

    response.send({
      success: doc.exists,
      data: doc.exists ? doc.data() : null
    }); 
  }),
  action: functions.https.onRequest(async(request, response) => {
    const docRef = collection.doc('test');
    const type = request.query['type'] || '';
    console.log('query', request.query);
    if (request.method === 'GET' && type === 'clap') {
      await docRef.update({ clap:  increment});
      const doc = await docRef.get();
      console.log('doc response', doc.data());
      response.send({
        success: true,
        data: doc.data()
      }); 
    } else {
      response.send({
        success: false,
        data: null
      })
    }
  }
  )
}