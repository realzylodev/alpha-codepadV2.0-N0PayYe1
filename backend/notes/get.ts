import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { notesDB } from "./db";

export interface GetNoteParams {
  id: number;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Retrieves a specific note by ID.
export const get = api<GetNoteParams, Note>(
  { expose: true, method: "GET", path: "/notes/:id", auth: true },
  async (params) => {
    const auth = getAuthData()!;
    const row = await notesDB.queryRow<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, content, created_at, updated_at
      FROM notes
      WHERE id = ${params.id} AND user_id = ${auth.userID}
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
