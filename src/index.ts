import express, { Request, Response } from 'express';
import { todo } from 'node:test';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'todo_db'
});

class Todo {
  constructor(public readonly title: string, public readonly content: string, public readonly check: boolean = false) { }
}

const todos: Todo[] = []



app.post('/post', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const now = new Date();

    const [result] = await pool.query<mysql.ResultSetHeader>(
      `INSERT INTO todos (title, content, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP(3))`,
      [title, content]
    );

    const todo = {
      id: result.insertId,
      title,
      content,
      status: 'TODO' as const,
      created_at: now,
      updated_at: now
    };

    res.status(201).send({ "todo": todo });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).send({ error: 'Database error' });
  }
});

app.get('/post', async (req: Request, res: Response) => {
  const [result] = await pool.query(
    `SELECT * FROM todos`
  );
  res.send({
    "todos": result
  })
});

app.get('/search', (req: Request, res: Response) => {
  var word: string = req.query.word as string;
  const results: Todo[] = todos.filter(x =>
    x.title.includes(word) ||
    x.content.includes(word));
  // const results: Todo[] = [];
  // for (var i = 0; i < todos.length; i++) {
  //   if (todos[i].title.includes(word)) {
  //     results.push(todos[i])
  //   }
  // }
  res.send({ "todos": results })
})

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

