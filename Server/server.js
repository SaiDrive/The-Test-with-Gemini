const express = require('express');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert('path/to/your/serviceAccountKey.json')
// });

// const db = admin.firestore();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/data', async (req, res) => {
  try {
    const snapshot = await db.collection('yourCollectionName').get();
    const data = [];
    snapshot.forEach(doc => {
      data.push(doc.data());
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

app.post('/addData', async (req, res) => {
  try {
    const data = {
      // Your data fields here
      name: 'John Doe',
      age: 30
    };
    await db.collection('yourCollectionName').add(data);
    res.send('Data added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding data');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});