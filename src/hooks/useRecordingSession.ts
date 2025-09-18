import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RecordingSession {
  id: string;
  session_code: string;
  controller_id: string | null;
  recorder_id: string | null;
  status: 'waiting' | 'connected' | 'recording' | 'finished';
  recording_start_time: string | null;
  recording_end_time: string | null;
}

export const useRecordingSession = () => {
  const [session, setSession] = useState<RecordingSession | null>(null);
  const [deviceId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

  // Gerar código de sessão
  const generateSessionCode = useCallback(() => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }, []);

  // Criar nova sessão (Controlador)
  const createSession = useCallback(async () => {
    try {
      const sessionCode = generateSessionCode();
      const { data, error } = await supabase
        .from('recording_sessions')
        .insert({
          session_code: sessionCode,
          controller_id: deviceId,
          status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;
      setSession(data as RecordingSession);
      
      toast({
        title: "Sessão Criada",
        description: `Código: ${sessionCode}`,
      });
      
      return sessionCode;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a sessão",
        variant: "destructive"
      });
      return null;
    }
  }, [deviceId, generateSessionCode, toast]);

  // Entrar em sessão (Gravador)
  const joinSession = useCallback(async (sessionCode: string) => {
    try {
      const { data, error } = await supabase
        .from('recording_sessions')
        .update({
          recorder_id: deviceId,
          status: 'connected'
        })
        .eq('session_code', sessionCode)
        .eq('status', 'waiting')
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        toast({
          title: "Erro",
          description: "Código inválido ou sessão já conectada",
          variant: "destructive"
        });
        return false;
      }

      setSession(data as RecordingSession);
      toast({
        title: "Conectado!",
        description: "Conectado ao controlador",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao entrar na sessão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível entrar na sessão",
        variant: "destructive"
      });
      return false;
    }
  }, [deviceId, toast]);

  // Iniciar gravação (Controlador)
  const startRecording = useCallback(async () => {
    if (!session) return false;

    try {
      const { error } = await supabase
        .from('recording_sessions')
        .update({
          status: 'recording',
          recording_start_time: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      return false;
    }
  }, [session]);

  // Parar gravação (Controlador)
  const stopRecording = useCallback(async () => {
    if (!session) return false;

    try {
      const { error } = await supabase
        .from('recording_sessions')
        .update({
          status: 'finished',
          recording_end_time: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      return false;
    }
  }, [session]);

  // Escutar mudanças em tempo real
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('recording-session-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'recording_sessions',
          filter: `id=eq.${session.id}`
        },
        (payload) => {
          console.log('Session updated:', payload.new);
          setSession(payload.new as RecordingSession);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  const disconnect = useCallback(() => {
    setSession(null);
  }, []);

  return {
    session,
    deviceId,
    createSession,
    joinSession,
    startRecording,
    stopRecording,
    disconnect
  };
};