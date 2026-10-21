import { pool } from "../config/db.js";
import type { Party } from "../types/Party.js";

export const fetchParties: (party?: string) => Promise<Array<Party>> = async (
  party: string = "",
) => {
  const response =
    party.length > 0
      ? await pool
          .request()
          .input("party", party)
          .query(
            "SELECT * FROM parties WHERE party LIKE CONCAT('%', @party, '%')",
          )
      : await pool.request().query("SELECT * FROM parties");
  const { recordset } = response;
  return recordset;
};

export const insertParty: (details: Partial<Party>) => Promise<Party> = async (
  details,
) => {
  const response = await pool
    .request()
    .input("party", details.party)
    .input("contact_num", details.contact_num)
    .input("contact_person", details.contact_person)
    .input("contact_email", details.contact_email)
    .query(
      "INSERT INTO parties (party, contact_num, contact_person, contact_email) OUTPUT INSERTED.* VALUES (@party, @contact_num, @contact_person, @contact_email)",
    );
  const { recordset } = response;
  return recordset[0];
};

export const removeParty: (id: number) => Promise<boolean> = async (
  id: number,
) => {
  const response = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM parties WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export const patchParty: (
  id: number,
  details: Partial<Party>,
) => Promise<boolean> = async (id, details) => {
  const { party, contact_person, contact_num, contact_email } = details;
  const response = await pool
    .request()
    .input("id", id)
    .input("party", party)
    .input("contact_email", contact_email)
    .input("contact_num", contact_num)
    .input("contact_person", contact_person).query(`UPDATE parties SET 
      party=@party, 
      contact_email=@contact_email, 
      contact_person=@contact_person  
      WHERE id=@id`);
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};
