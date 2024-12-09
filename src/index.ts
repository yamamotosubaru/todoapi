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


// post
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

// get
app.get('/post', async (req: Request, res: Response) => {
  const [result] = await pool.query(
    `SELECT * FROM todos`
  );
  res.send({
    "todos": result
  })
});

// search
app.get('/search', async (req: Request, res: Response) => {
  const word: string = req.query.word as string;
  const searchPattern = `%${word}%`;
  const [results] = await pool.query(
    `SELECT * FROM todos WHERE title LIKE ? OR content LIKE ?`,
    [searchPattern, searchPattern]
    // ["%" + word + "%", "%" + word + "%"]
  );
  res.send({
    "todos": results
  });
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

