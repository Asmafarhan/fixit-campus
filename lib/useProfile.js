'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';

// Checks who is logged in. needAdmin=true -> only admin allowed, false -> only student/staff.
export function useProfile(needAdmin) {
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace('/');
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!data || (needAdmin && data.role !== 'admin') || (!needAdmin && data.role === 'admin')) return router.replace('/');
      setProfile(data);
    })();
  }, []);
  return profile;
}
