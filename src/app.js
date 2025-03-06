const express = require('express');

const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
    res.send('Hello Geet!');
});
app.get('/user', (req, res) => {
    res.send({ firstname: 'Geet', lastname: 'S' });
});
app.post('/user', (req, res) => {
    res.send('user added successfully');
});
app.delete('/user', (req, res) => {
    res.send('deleted successfully');
});
app.use('/test', (req, res) => {
    res.send('Hello World!');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});