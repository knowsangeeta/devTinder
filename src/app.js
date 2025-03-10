const express = require('express');

const app = express();
const port = 3001;

app.get('/user/:userId/:name/:password', (req, res) => {
    console.log(req.params);
    res.send({ firstname: 'Geet', lastname: 'S' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});