-- Criar tabela para sessões de gravação
CREATE TABLE public.recording_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_code TEXT NOT NULL UNIQUE,
  controller_id UUID,
  recorder_id UUID,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'connected', 'recording', 'finished')),
  recording_start_time TIMESTAMP WITH TIME ZONE,
  recording_end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.recording_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso público (não precisa de autenticação)
CREATE POLICY "Sessions are publicly accessible" 
ON public.recording_sessions 
FOR ALL 
USING (true);

-- Adicionar à publicação realtime
ALTER TABLE public.recording_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recording_sessions;

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para timestamps
CREATE TRIGGER update_recording_sessions_updated_at
BEFORE UPDATE ON public.recording_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();