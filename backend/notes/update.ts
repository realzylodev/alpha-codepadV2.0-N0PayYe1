import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";

export interface UpdateNoteParams {
  id: number;
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Updates an existing note.
export const update = api<UpdateNoteParams & UpdateNoteRequest, Note>(
  { expose: true, method: "PUT", path: "/notes/:id" },
  async (req) => {
    const row = await notesDB.queryRow<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>`
      UPDATE notes
      SET title = ${req.title}, content = ${req.content}, updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING id, title, content, created_at, updated_at
    `;

    if (!row) {
      throw APIError.notFound("note not found");
    }

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
