import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// /api/todos エンドポイント
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { project_id } = req.query;

  try {
    switch (method) {
      case "GET": {
        if (!project_id) {
          return res.status(400).json({ error: "project_idが必要です。" });
        }
        const result = await pool.query("SELECT * FROM todos WHERE project_id = $1", [project_id]);
        return res.status(200).json(result.rows);
      }

      case "POST": {
        const { project_id, todo_title, todo_detail } = req.body;
        if (!project_id || !todo_title) {
          return res.status(400).json({ error: "project_idとtodo_titleは必須です。" });
        }
        const result = await pool.query(
          "INSERT INTO todos (project_id, todo_id, todo_title, todo_detail, todo_completed) VALUES ($1, (SELECT COALESCE(MAX(todo_id), 0) + 1 FROM todos WHERE project_id=$1), $2, $3, false) RETURNING *",
          [project_id, todo_title, todo_detail || null]
        );
        return res.status(201).json(result.rows[0]);
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "サーバーエラーが発生しました。" });
  }
}

// /api/todos/[project_id]/[todo_id] エンドポイント
export async function handlerById(req: NextApiRequest, res: NextApiResponse) {
  const { project_id, todo_id } = req.query;
  const { method } = req;

  if (!project_id || !todo_id) {
    return res.status(400).json({ error: "project_idとtodo_idが必要です。" });
  }

  try {
    switch (method) {
      case "PATCH": {
        const result = await pool.query(
          "UPDATE todos SET todo_completed = NOT todo_completed WHERE project_id = $1 AND todo_id = $2 RETURNING *",
          [project_id, todo_id]
        );
        if (result.rowCount === 0) {
          return res.status(404).json({ error: "Todoが見つかりません。" });
        }
        return res.status(200).json({ message: "ステータス更新成功", todo: result.rows[0] });
      }

      case "DELETE": {
        const result = await pool.query(
          "DELETE FROM todos WHERE project_id = $1 AND todo_id = $2 RETURNING *",
          [project_id, todo_id]
        );
        if (result.rowCount === 0) {
          return res.status(404).json({ error: "Todoが見つかりません。" });
        }
        return res.status(200).json({ message: "削除成功" });
      }

      default: {
        res.setHeader("Allow", ["PATCH", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "サーバーエラーが発生しました。" });
  }
}
