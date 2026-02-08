import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, user_id, full_name, email, phone, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (!data) {
      // Create profile if it doesn't exist
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({ user_id: user.id, email: user.email })
        .select('id, user_id, full_name, email, phone, avatar_url')
        .single();
      if (!insertError) setProfile(newProfile);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'full_name' | 'email' | 'phone'>>) => {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    } else {
      setProfile(prev => prev ? { ...prev, ...updates } : prev);
      toast({ title: 'Success', description: 'Profile updated successfully!' });
    }
    setSaving(false);
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setSaving(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Error', description: 'Failed to upload avatar.', variant: 'destructive' });
      setSaving(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Append timestamp to bust cache
    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ avatar_url: avatarUrl })
      .eq('user_id', user.id);

    if (!updateError) {
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : prev);
      toast({ title: 'Success', description: 'Avatar updated!' });
    }
    setSaving(false);
  };

  return { profile, loading, saving, updateProfile, uploadAvatar, refetch: fetchProfile };
};
