import express from 'express';
import cors from 'cors';


const app = express();
const PORT = 5001;

app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
app.use(cors());  


app.get('/', (req, res) => {
    res.send('Hello, API is running!');
});

app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is connected successfully!" });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
