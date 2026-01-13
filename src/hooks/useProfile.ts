import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileStats {
  totalScore: number;
  modulesCompleted: number;
  scenariosAttempted: number;
  scenariosCorrect: number;
  accuracy: number;
}

export const useProfile = (userId: string | null) => {
  const [stats, setStats] = useState<ProfileStats>({
    totalScore: 0,
    modulesCompleted: 0,
    scenariosAttempted: 0,
    scenariosCorrect: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        setStats({
          totalScore: profile.total_score || 0,
          modulesCompleted: profile.training_completed || 0,
          scenariosAttempted: profile.scenarios_attempted || 0,
          scenariosCorrect: profile.scenarios_correct || 0,
          accuracy: profile.scenarios_attempted > 0 
            ? Math.round((profile.scenarios_correct || 0) / profile.scenarios_attempted * 100) 
            : 0,
        });
      }
    } catch (error) {
      console.error('Error in loadStats:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateStats = async (updates: Partial<{
    score: number;
    scenarioCorrect: boolean;
    moduleCompleted: boolean;
  }>) => {
    if (!userId) return false;

    try {
      const updateData: Record<string, number> = {};
      
      if (updates.score !== undefined) {
        updateData.total_score = stats.totalScore + updates.score;
      }
      
      if (updates.scenarioCorrect !== undefined) {
        updateData.scenarios_attempted = stats.scenariosAttempted + 1;
        if (updates.scenarioCorrect) {
          updateData.scenarios_correct = stats.scenariosCorrect + 1;
        }
      }
      
      if (updates.moduleCompleted) {
        updateData.training_completed = stats.modulesCompleted + 1;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      // Refresh stats after update
      await loadStats();
      return true;
    } catch (error) {
      console.error('Error in updateStats:', error);
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId, loadStats]);

  return { stats, loading, loadStats, updateStats };
};
