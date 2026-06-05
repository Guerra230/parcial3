import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { STORAGE_BUCKETS } from '../constants';

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const uploadFile = async (
  bucket: StorageBucket,
  path: string,
  file: File
): Promise<string> => {
  if (!isSupabaseConfigured) throw new Error('Supabase no está configurado');
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  return getPublicUrl(bucket, path);
};

export const getPublicUrl = (bucket: StorageBucket, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const deleteFile = async (bucket: StorageBucket, path: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
};

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/avatar.${ext}`;
  return uploadFile(STORAGE_BUCKETS.AVATARS, path, file);
};

export const uploadProductImage = async (
  productId: string,
  file: File,
  position: number
): Promise<string> => {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${productId}/${position}.${ext}`;
  return uploadFile(STORAGE_BUCKETS.PRODUCT_IMAGES, path, file);
};
