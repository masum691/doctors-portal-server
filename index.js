const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icwz7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri)

async function run() {
  try {
    await client.connect();
    const database = client.db("doctors_portal");
    const appoinmentsCollection = database.collection("appoinments");
    // console.log('db connected')

    app.get('/appoinments', async(req, res) => {
      const email = req.query;
      const query = {email: query.email}
      const cursor = appoinmentsCollection.find(query);
      const appoinments = await cursor.toArray();
      res.json(appoinments)
    })

    app.post('/appoinments', async (req, res) => {
      const appoinment = req.body;
      const result = await appoinmentsCollection.insertOne(appoinment)
      console.log(appoinment)
      res.json(result)
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})