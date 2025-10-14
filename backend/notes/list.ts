import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { notesDB } from "./db";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListNotesResponse {
  notes: Note[];
}

// Retrieves all notes, ordered by creation date (latest first).
export const list = api<void, ListNotesResponse>(
  { expose: true, method: "GET", path: "/notes", auth: true },
  async () => {
    const auth = getAuthData()!;
    const rows = await notesDB.queryAll<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, content, created_at, updated_at
      FROM notes
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `;

    const notes: Note[] = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { notes };
  }
);
