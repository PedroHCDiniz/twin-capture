import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Mic, Radio, Shield, Cloud, Mail } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Página inicial do sistema de gravação remota
 * Apresenta as funcionalidades e permite escolher o modo (Controlador ou Gravador)
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header principal com título e descrição */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            RemoteRec
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Sistema profissional de gravação remota entre dois dispositivos do mesmo usuário
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Comunicação segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              <span>Storage em nuvem</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Envio por email</span>
            </div>
          </div>
        </div>

        {/* Cards de seleção de modo */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Card do Controlador */}
          <Card className="p-8 border-2 border-border hover:border-accent transition-all duration-300 group hover:shadow-2xl animate-slide-up">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-recording rounded-full flex items-center justify-center">
                  <Radio className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-3">Controlador</h3>
                <p className="text-muted-foreground mb-6">
                  Dispositivo que envia comandos de iniciar/parar gravação remotamente
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li>• Pairing com código QR ou PIN</li>
                  <li>• Comandos start/stop remotos</li>
                  <li>• Histórico de gravações</li>
                  <li>• Interface simples e intuitiva</li>
                </ul>
              </div>

              <Link to="/controller" className="block">
                <Button variant="default" size="lg" className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold">
                  Usar como Controlador
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card do Gravador */}
          <Card className="p-8 border-2 border-border hover:border-recording transition-all duration-300 group hover:shadow-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-recording to-recording/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent rounded-full animate-pulse"></div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-3">Gravador</h3>
                <p className="text-muted-foreground mb-6">
                  Dispositivo que executa a gravação de áudio e faz upload automático
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li>• Gravação em background</li>
                  <li>• Upload automático para cloud</li>
                  <li>• Qualidade configurável</li>
                  <li>• Envio por email opcional</li>
                </ul>
              </div>

              <Link to="/recorder" className="block">
                <Button variant="destructive" size="lg" className="w-full bg-gradient-to-r from-recording to-recording/80 hover:from-recording/90 hover:to-recording/70 font-semibold">
                  Usar como Gravador
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Seção de recursos técnicos */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Técnicos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h4 className="font-semibold mb-2">Segurança</h4>
              <p className="text-sm text-muted-foreground">
                Comunicação criptografada TLS, tokens JWT com expiração, logs de auditoria
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Cloud className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h4 className="font-semibold mb-2">Cloud Storage</h4>
              <p className="text-sm text-muted-foreground">
                Upload automático para Firebase Storage/S3, metadados organizados
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Radio className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h4 className="font-semibold mb-2">Comunicação</h4>
              <p className="text-sm text-muted-foreground">
                WebSocket em tempo real, fallback P2P WebRTC, push notifications
              </p>
            </Card>
          </div>
        </div>

        {/* Note sobre backend */}
        <div className="mt-16 text-center">
          <Card className="p-6 bg-muted/30 border-dashed">
            <p className="text-muted-foreground">
              <strong>Nota:</strong> Para implementar as funcionalidades completas (backend, banco de dados, 
              autenticação, WebSocket), será necessário conectar com Supabase
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;