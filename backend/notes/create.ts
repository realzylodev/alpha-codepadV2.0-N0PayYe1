import { api } from "encore.dev/api";
import { notesDB } from "./db";

export interface CreateNoteRequest {
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

// Creates a new note.
export const create = api<CreateNoteRequest, Note>(
  { expose: true, method: "POST", path: "/notes" },
  async (req) => {
    const row = await notesDB.queryRow<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO notes (title, content)
      VALUES (${req.title}, ${req.content})
      RETURNING id, title, content, created_at, updated_at
    `;

    if (!row) {
      throw new Error("Failed to create note");
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
