import { createClient } from "@supabase/supabase-js";
import { env } from "../utils/env";

const _supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLIC_KEY);

export class SupabaseService {
  async getFile(fileName: string) {
    const { data, error } = await _supabase.storage
      .from("documents")
      .download(fileName);

    if (error) {
      throw error;
    }

    return data;
  }

  async getFileUrl(fileName: string) {
    try {
      return await _supabase.storage
        .from("documents")
        .createSignedUrl(fileName, 60);
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const data = await _supabase.storage
        .from("documents")
        .upload(`public/${file.originalname}`, file.buffer);

      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(fileName: string) {
    const { data, error } = await _supabase.storage
      .from("documents")
      .remove([fileName]);

    if (error) {
      throw error;
    }

    return data;
  }
}
