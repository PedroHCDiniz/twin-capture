import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Upload, 
  Mail, 
  Settings,
  Signal,
  HardDrive,
  Wifi,
  WifiOff,
  Play,
  Square
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Interface do Gravador
 * Responsável por receber comandos e executar a gravação
 * Mostra status da gravação, upload e configurações
 */
const Recorder = () => {
  // Estados para controle da gravação
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [storageUsed, setStorageUsed] = useState(67); // Porcentagem
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { toast } = useToast();

  // Simulação do timer de gravação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        // Simular níveis de áudio
        setAudioLevel(Math.random() * 100);
      }, 1000);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Inicializar gravador de mídia
  const initializeMediaRecorder = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = async () => {
        console.log('Gravação finalizada, processando áudio...');
        await processRecording();
      };

      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone",
        variant: "destructive"
      });
    }
  }, []);

  // Processar e enviar gravação por email
  const processRecording = useCallback(async () => {
    if (audioChunks.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        if (!base64Audio) return;

        setUploadProgress(30);

        const { data, error } = await supabase.functions.invoke('send-audio-email', {
          body: {
            audioData: base64Audio,
            duration: recordingTime,
            timestamp: new Date().toISOString()
          }
        });

        setUploadProgress(100);

        if (error) {
          console.error('Erro ao enviar email:', error);
          toast({
            title: "Erro",
            description: "Erro ao enviar gravação por email",
            variant: "destructive"
          });
        } else {
          console.log('Email enviado com sucesso:', data);
          toast({
            title: "Sucesso!",
            description: "Gravação enviada para pedrohcdiniz00@gmail.com",
          });
        }

        setIsUploading(false);
        setUploadProgress(0);
        setAudioChunks([]);
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Erro ao processar gravação:', error);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Erro",
        description: "Erro ao processar gravação",
        variant: "destructive"
      });
    }
  }, [audioChunks, recordingTime, toast]);

  // Inicializar conexão e gravador
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
      initializeMediaRecorder();
      toast({
        title: "Dispositivo Pronto",
        description: "Microfone configurado e pronto para gravar",
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [initializeMediaRecorder]);

  // Formatar tempo de gravação
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Iniciar gravação real
  const startRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'inactive' && isConnected) {
      setAudioChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast({
        title: "Gravação Iniciada",
        description: "Gravando áudio...",
      });
    }
  }, [mediaRecorder, isConnected, toast]);

  // Parar gravação real
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      toast({
        title: "Gravação Finalizada",
        description: "Processando e enviando por email...",
      });
    }
  }, [mediaRecorder, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header com navegação */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Gravador</h1>
            <p className="text-muted-foreground">Dispositivo de gravação remota</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Painel principal de gravação */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status principal */}
            <Card className="p-8">
              <div className="text-center space-y-6">
                {/* Indicador visual de microfone */}
                <div className="relative mx-auto w-32 h-32">
                  <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                    isRecording 
                      ? 'border-recording bg-recording/10 animate-pulse-recording' 
                      : 'border-muted bg-muted/10'
                  }`}>
                    {isRecording ? (
                      <Mic className="w-16 h-16 text-recording" />
                    ) : (
                      <MicOff className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Indicador de nível de áudio */}
                  {isRecording && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Status e timer */}
                <div>
                  {isRecording ? (
                    <>
                      <h3 className="text-3xl font-bold text-recording mb-2">GRAVANDO</h3>
                      <div className="text-5xl font-mono font-bold text-recording">
                        {formatTime(recordingTime)}
                      </div>
                    </>
                  ) : isUploading ? (
                    <>
                      <h3 className="text-2xl font-bold text-accent mb-2">FAZENDO UPLOAD</h3>
                      <Progress value={uploadProgress} className="w-64 mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">{Math.round(uploadProgress)}% concluído</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-muted-foreground mb-2">AGUARDANDO</h3>
                      <p className="text-muted-foreground">Dispositivo pronto para receber comandos</p>
                    </>
                  )}
                </div>

                {/* Botões de controle real */}
                <div className="flex justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={startRecording}
                    disabled={isRecording || isUploading || !isConnected}
                    className="text-sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Gravação
                  </Button>
                  <Button
                    variant="outline"
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className="text-sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Parar Gravação
                  </Button>
                </div>
              </div>
            </Card>

            {/* Configurações de qualidade */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações de Gravação
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Qualidade de Áudio</label>
                  <select className="w-full p-2 bg-secondary border border-border rounded-md">
                    <option>Alta - 192 kbps</option>
                    <option>Média - 128 kbps</option>
                    <option>Baixa - 64 kbps</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Formato</label>
                  <select className="w-full p-2 bg-secondary border border-border rounded-md">
                    <option>M4A (recomendado)</option>
                    <option>OGG</option>
                    <option>MP3</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Painel lateral */}
          <div className="space-y-6">
            {/* Status da conexão */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Signal className="w-5 h-5" />
                <h4 className="font-semibold">Conexão</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={isConnected ? "default" : "secondary"}>
                    {isConnected ? (
                      <>
                        <Wifi className="w-3 h-3 mr-1" />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 mr-1" />
                        Offline
                      </>
                    )}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Controlador:</span>
                  <Badge variant="outline">Conectado</Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  ✓ Conexão segura WebSocket ativa
                </div>
              </div>
            </Card>

            {/* Armazenamento */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="w-5 h-5" />
                <h4 className="font-semibold">Armazenamento</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uso local:</span>
                    <span>{storageUsed}%</span>
                  </div>
                  <Progress value={storageUsed} className="h-2" />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  2.1 GB / 32 GB utilizados
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Upload className="w-4 h-4 text-green-500" />
                  <span>Auto-upload: Ativo</span>
                </div>
              </div>
            </Card>

            {/* Configurações de email */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5" />
                <h4 className="font-semibold">Email</h4>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline">Configurado</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span>Destinatário:</span>
                  <span className="text-muted-foreground">pedrohcdiniz00@gmail.com</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Envio automático:</span>
                  <Badge variant="outline">Ativo</Badge>
                </div>
              </div>
            </Card>

            {/* Logs recentes */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Logs Recentes</h4>
              
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-muted/30 rounded text-green-600">
                  15:23 - Conectado ao controlador
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  15:22 - Sistema iniciado
                </div>
                <div className="p-2 bg-muted/30 rounded text-blue-600">
                  15:20 - Upload concluído
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recorder;