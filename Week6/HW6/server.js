const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.text({type:"*/*"}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7326',
  database: 'todolist'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.get('/api/todolist', (req, res) => {
    const query = 'SELECT * FROM todolist';
    connection.query(query, (err, result) => {
    // Check if the result is empty
      if (!result) {
        return res.json([]); // Send an empty array as response
      }
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Error querying database' });
      }
      
      res.json(result);
    });
  });
  
app.post('/api/todolist', (req, res) => {
    const data =  req.body;
    const obj = JSON.parse(data);
    console.log(obj.text);
    const text = obj.text;
    const status = 'x';
    if (!text) {
      return res.status(400).json({ error: 'Empty body' });
    }

    const query = 'INSERT INTO todolist (text, status) VALUES (?, ?)';
    connection.query(query, [text,status], (err, result) => {
      if (err) {
        console.error('Error inserting into database:', err);
        return res.status(500).json({ error: 'Error inserting into database' });
      }
      res.status(201).json({ message: 'Item added successfully' });
    });
});

app.delete('/api/todolist', (req, res) => {
    const data =  req.body;
    const obj = JSON.parse(data);
    const text = obj.text;
    console.log(text);
    const query = 'DELETE FROM todolist WHERE text = ?';
    connection.query(query, [text], (err, result) => {
      if (err) {
        console.error('Error deleting from database:', err);
        return res.status(500).json({ error: 'Error deleting from database' });
      }
      res.status(200).json({ message: 'Item deleted successfully' });
    });
});

app.patch('/api/todolist', (req, res) => {
    const data = req.body;
    const { text, status } = JSON.parse(data);

    const query = 'UPDATE todolist SET status = ? WHERE text = ?';

    connection.query(query, [status, text], (err, result) => {
        if (err) {
            console.error('Error updating database:', err);
            return res.status(500).json({ error: 'Error updating database' });
        }
        res.status(200).json({ message: 'Status updated successfully' });
    });
});

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

