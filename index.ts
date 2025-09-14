import express from 'express';
import routes from './src/routes/index';
import cors from 'cors';
import { initializeDatabase } from './src/db';

const PORT = process.env.PORT || 3000;

export const app = express();

app.use(cors());
app.use(express.json());

initializeDatabase();

app.use('/api', routes);

app.listen(PORT, () => {
	console.log(`Application running on port ${PORT}!`);
});
