import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { notesDB } from "./db";

export interface DeleteNoteParams {
  id: number;
}

// Deletes a note.
export const deleteNote = api<DeleteNoteParams, void>(
  { expose: true, method: "DELETE", path: "/notes/:id", auth: true },
  async (params) => {
    const auth = getAuthData()!;
    const result = await notesDB.queryRow<{ count: number }>`
      DELETE FROM notes
      WHERE id = ${params.id} AND user_id = ${auth.userID}
      RETURNING 1 as count
    `;

    if (!result) {
      throw APIError.notFound("note not found");
    }
  }
);
