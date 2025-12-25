import { supabase } from '../utils/supabaseClient';

export interface KVRecord<T> {
    key: string;
    value: T;
}

export const kvStore = {
    // Generic get by key
    async get<T>(key: string): Promise<T | null> {
        const { data, error } = await supabase
            .from('kv_store_bbbda4f3')
            .select('value')
            .eq('key', key)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        return (data as any)?.value as T;
    },

    // Get all items by prefix (e.g., 'product:')
    async listByPrefix<T>(prefix: string): Promise<KVRecord<T>[]> {
        const { data, error } = await supabase
            .from('kv_store_bbbda4f3')
            .select('key, value')
            .ilike('key', `${prefix}%`);

        if (error) throw error;
        return (data as any[] || []).map(row => ({
            key: row.key,
            value: row.value as T
        }));
    },

    // Set (Insert or Update)
    async set<T extends object>(key: string, value: T): Promise<void> {
        const { error } = await supabase
            .from('kv_store_bbbda4f3')
            .upsert({ key, value } as any);

        if (error) throw error;
    },

    // Delete
    async delete(key: string): Promise<void> {
        const { error } = await supabase
            .from('kv_store_bbbda4f3')
            .delete()
            .eq('key', key);

        if (error) throw error;
    }
};
