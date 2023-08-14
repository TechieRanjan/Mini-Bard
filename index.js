
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const axios = require('axios');
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(express.json())

app.get("/", (req, res) => {
  res.render('index')
})


   

async function getAnswer(query) {
  let url = `https://api.duckduckgo.com/?skip_disambig=1&format=json&pretty=1&q=${query}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  } 
}
async function getImages(query) {
  let url = `https://pixabay.com/api/?key=38740507-856af4f327b4bb6602b66e087&q=${query}&image_type=photo&pretty=true`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  } 
}
   

// app.post('/answer', (req, res) => {
//   var {query} = req.body
//   getAnswer(query).then((data) => {
//   res.send(data) 
// });
 
// });

app.post('/answer', async (req, res) => {
  var { query } = req.body;
  try {
    const [answerData, imagesData] = await Promise.all([
      getAnswer(query),
      getImages(query)
    ]);

    res.json({
      answer: answerData,
      images: imagesData
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});


 
app.listen(port, (e) => {
  if (e) { console.error(e) }
  console.log("Started");
});