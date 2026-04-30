import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL;
const API_KEY = process.env.SUPABASE_API_KEY;

if (!STORAGE_URL || !API_KEY)
  throw new Error("Variáveis de ambiente para storage não encontradas.");

export const supabase = createClient(STORAGE_URL, API_KEY);
