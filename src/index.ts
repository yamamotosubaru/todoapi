import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  const { message } = req.query;
  res.json({ message: message });
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

class Todo {
  constructor(public readonly title: string, public readonly content: string, public readonly check: boolean) { }
}