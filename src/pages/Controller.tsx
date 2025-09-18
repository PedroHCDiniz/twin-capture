import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Play, 
  Square, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Clock,
  History,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

/**
 * Interface do Controlador
 * Responsável por enviar comandos de start/stop para o dispositivo gravador
 * Mostra status da conexão, histórico e configurações
 */
const Controller = () => {
  // Estados para controle da interface
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [deviceName, setDeviceName] = useState("Gravador-001");
  const { toast } = useToast();

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

  // Função para conectar/desconectar do gravador
  const handleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setIsRecording(false);
      setRecordingTime(0);
      toast({
        title: "Desconectado",
        description: "Desconectado do dispositivo gravador",
      });
    } else {
      // Simulação de processo de conexão
      toast({
        title: "Conectando...",
        description: "Estabelecendo conexão com o gravador",
      });
      
      setTimeout(() => {
        setIsConnected(true);
        toast({
          title: "Conectado!",
          description: `Conectado ao ${deviceName}`,
          variant: "default",
        });
      }, 2000);
    }
  };

  // Função para iniciar gravação
  const handleStartRecording = () => {
    if (!isConnected) {
      toast({
        title: "Erro",
        description: "Conecte-se ao gravador primeiro",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    setRecordingTime(0);
    toast({
      title: "Gravação Iniciada",
      description: "Comando enviado para o gravador",
    });
  };

  // Função para parar gravação
  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Gravação Finalizada",
      description: `Duração: ${formatTime(recordingTime)}`,
    });
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
            {/* Status da conexão */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Status da Conexão</h3>
                <Badge variant={isConnected ? "default" : "secondary"} className="text-sm">
                  {isConnected ? (
                    <>
                      <Wifi className="w-4 h-4 mr-1" />
                      Conectado
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 mr-1" />
                      Desconectado
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <span>Dispositivo: {deviceName}</span>
                  </div>
                  <Button 
                    variant={isConnected ? "destructive" : "default"}
                    onClick={handleConnection}
                    disabled={isRecording}
                  >
                    {isConnected ? "Desconectar" : "Conectar"}
                  </Button>
                </div>
                
                {isConnected && (
                  <div className="text-sm text-muted-foreground">
                    ✓ Conexão segura estabelecida via WebSocket
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