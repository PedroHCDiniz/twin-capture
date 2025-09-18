import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Play, 
  Square, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Clock,
  History,
  Settings,
  Copy,
  LogIn
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useRecordingSession } from "@/hooks/useRecordingSession";

/**
 * Interface do Controlador
 * Responsável por enviar comandos de start/stop para o dispositivo gravador
 * Mostra status da conexão, histórico e configurações
 */
const Controller = () => {
  const { session, createSession, startRecording, stopRecording, disconnect } = useRecordingSession();
  const [sessionCode, setSessionCode] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState(0);
  const { toast } = useToast();

  const isConnected = session?.status === 'connected' || session?.status === 'recording' || session?.status === 'finished';
  const isRecording = session?.status === 'recording';

  // Simulação do timer de gravação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Formatar tempo de gravação (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Criar nova sessão
  const handleCreateSession = async () => {
    const code = await createSession();
    if (code) {
      setSessionCode(code);
    }
  };

  // Desconectar
  const handleDisconnect = () => {
    disconnect();
    setSessionCode("");
    setRecordingTime(0);
    toast({
      title: "Desconectado",
      description: "Sessão encerrada",
    });
  };

  // Copiar código da sessão
  const copySessionCode = () => {
    navigator.clipboard.writeText(sessionCode);
    toast({
      title: "Copiado!",
      description: "Código copiado para a área de transferência",
    });
  };

  // Função para iniciar gravação
  const handleStartRecording = async () => {
    if (!isConnected) {
      toast({
        title: "Erro",
        description: "Conecte-se ao gravador primeiro",
        variant: "destructive",
      });
      return;
    }

    const success = await startRecording();
    if (success) {
      setRecordingTime(0);
      toast({
        title: "Gravação Iniciada",
        description: "Comando enviado para o gravador",
      });
    }
  };

  // Função para parar gravação
  const handleStopRecording = async () => {
    const success = await stopRecording();
    if (success) {
      toast({
        title: "Gravação Finalizada", 
        description: `Duração: ${formatTime(recordingTime)}`,
      });
    }
  };

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
            <h1 className="text-3xl font-bold">Controlador</h1>
            <p className="text-muted-foreground">Comando remoto de gravação</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Painel principal de controle */}
          <div className="lg:col-span-2 space-y-6">
            {/* Criar/Gerenciar Sessão */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Sessão de Gravação</h3>
                <Badge variant={isConnected ? "default" : "secondary"} className="text-sm">
                  {session?.status === 'waiting' && (
                    <>
                      <Clock className="w-4 h-4 mr-1" />
                      Aguardando
                    </>
                  )}
                  {session?.status === 'connected' && (
                    <>
                      <Wifi className="w-4 h-4 mr-1" />
                      Conectado
                    </>
                  )}
                  {session?.status === 'recording' && (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                      Gravando
                    </>
                  )}
                  {!session && (
                    <>
                      <WifiOff className="w-4 h-4 mr-1" />
                      Desconectado
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="space-y-4">
                {!session ? (
                  <Button 
                    onClick={handleCreateSession}
                    className="w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Criar Nova Sessão
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Código da Sessão</label>
                      <div className="flex gap-2">
                        <Input 
                          value={sessionCode || session.session_code} 
                          readOnly 
                          className="font-mono text-lg"
                        />
                        <Button variant="outline" size="icon" onClick={copySessionCode}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Compartilhe este código com o dispositivo gravador
                      </p>
                    </div>
                    
                    <Button 
                      variant="destructive"
                      onClick={handleDisconnect}
                      disabled={isRecording}
                      className="w-full"
                    >
                      Encerrar Sessão
                    </Button>
                  </>
                )}
                
                {session?.status === 'connected' && (
                  <div className="text-sm text-muted-foreground">
                    ✓ Gravador conectado e pronto
                  </div>
                )}
              </div>
            </Card>

            {/* Controles de gravação */}
            <Card className="p-8">
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Controle de Gravação</h3>
                  {isRecording && (
                    <div className="text-4xl font-mono font-bold text-recording animate-pulse-recording">
                      {formatTime(recordingTime)}
                    </div>
                  )}
                </div>

                {/* Botões de controle principais */}
                <div className="flex justify-center gap-4">
                  {!isRecording ? (
                    <Button
                      size="lg"
                      className="w-32 h-16 text-lg bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                      onClick={handleStartRecording}
                      disabled={!isConnected}
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Iniciar
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="destructive"
                      className="w-32 h-16 text-lg bg-gradient-to-r from-recording to-recording/80 hover:from-recording/90 hover:to-recording/70"
                      onClick={handleStopRecording}
                    >
                      <Square className="w-6 h-6 mr-2" />
                      Parar
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="text-sm text-muted-foreground">
                    🔴 Gravação em andamento no dispositivo remoto
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Painel lateral com informações */}
          <div className="space-y-6">
            {/* Histórico recente */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5" />
                <h4 className="font-semibold">Histórico Recente</h4>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span>Gravação #003</span>
                  <Badge variant="secondary">02:45</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span>Gravação #002</span>
                  <Badge variant="secondary">01:23</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span>Gravação #001</span>
                  <Badge variant="secondary">05:12</Badge>
                </div>
              </div>
            </Card>

            {/* Configurações rápidas */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" />
                <h4 className="font-semibold">Configurações</h4>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Qualidade:</span>
                  <Badge variant="outline">Alta (192kbps)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Formato:</span>
                  <Badge variant="outline">M4A</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto-upload:</span>
                  <Badge variant="outline">Ativado</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <Badge variant="outline">Configurado</Badge>
                </div>
              </div>
            </Card>

            {/* Status do sistema */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Status do Sistema</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Backend: Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Storage: Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Email: Aguardando</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;