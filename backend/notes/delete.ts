import { api, APIError } from "encore.dev/api";
import { notesDB } from "./db";

export interface DeleteNoteParams {
  id: number;
}

// Deletes a note.
export const deleteNote = api<DeleteNoteParams, void>(
  { expose: true, method: "DELETE", path: "/notes/:id" },
  async (params) => {
    const result = await notesDB.queryRow<{ count: number }>`
      DELETE FROM notes
      WHERE id = ${params.id}
      RETURNING 1 as count
    `;

    if (!result) {
      throw APIError.notFound("note not found");
    }
  }
);
