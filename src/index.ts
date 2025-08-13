import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'todo_db'
});

const TodoStatus = {
  Todo: "TODO",
  Done: "DONE",
  In_progress: "IN_PROGRESS",
} as const;

// post
app.post('/todo', async (req: Request, res: Response) => {
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
    status: TodoStatus.Todo,
    created_at: now,
    updated_at: now
  };

  res.status(201).send({ "todo": todo });
});

// get
app.get('/todo', async (req: Request, res: Response) => {
  const [result] = await pool.query(
    `SELECT id, title, content, status, created_at, updated_at 
    FROM todos 
    ORDER BY created_at DESC`
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
    `SELECT id, title, content, status, created_at, updated_at 
    FROM todos 
    WHERE title LIKE ? OR content LIKE ?
    ORDER BY created_at DESC`,
    [searchPattern, searchPattern]
    // ["%" + word + "%", "%" + word + "%"]
  );
  res.send({
    "todos": results
  });
});

// update
app.put('/todo/:id', async (req: Request, res: Response) => {
  const todoId = req.params.id;
  const { title, content, status } = req.body;

  const [result] = await pool.query<mysql.ResultSetHeader>(
    `UPDATE todos SET title = ?, content = ?, status = ?, updated_at = CURRENT_TIMESTAMP(3) WHERE id = ?`,
    [title, content, status || TodoStatus.Todo, todoId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).send({ error: 'Todo not found' });
  }

  const [updatedTodo] = await pool.query(
    `SELECT id, title, content, status, created_at, updated_at 
    FROM todos 
    WHERE id = ?`,
    [todoId]
  );

  res.status(200).send({ todo: (updatedTodo as any[])[0] });
});

// delete
app.delete('/todo/:id', async (req: Request, res: Response) => {
  const todoId = req.params.id;
  await pool.query(
    `DELETE FROM todos WHERE id = ?`,
    [todoId]
  )
  res.status(200).send({})
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});