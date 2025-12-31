import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Server {
  id: string;
  name: string;
  country: string;
  city: string;
  ping: number;
  load: number;
  flag: string;
}

const servers: Server[] = [
  { id: '1', name: 'US East', country: 'США', city: 'Нью-Йорк', ping: 45, load: 23, flag: '🇺🇸' },
  { id: '2', name: 'EU West', country: 'Нидерланды', city: 'Амстердам', ping: 32, load: 67, flag: '🇳🇱' },
  { id: '3', name: 'Asia', country: 'Япония', city: 'Токио', ping: 120, load: 45, flag: '🇯🇵' },
  { id: '4', name: 'UK', country: 'Великобритания', city: 'Лондон', ping: 28, load: 55, flag: '🇬🇧' },
  { id: '5', name: 'CA', country: 'Канада', city: 'Торонто', ping: 52, load: 34, flag: '🇨🇦' },
  { id: '6', name: 'AU', country: 'Австралия', city: 'Сидней', ping: 180, load: 28, flag: '🇦🇺' },
];

export default function Index() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server>(servers[0]);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleConnect = () => {
    if (!isAuthenticated) {
      setShow2FA(true);
      return;
    }

    setIsConnected(!isConnected);
    toast.success(isConnected ? 'Отключено от VPN' : `Подключено к ${selectedServer.city}`);
  };

  const handle2FASubmit = () => {
    if (twoFactorCode.length === 6) {
      setIsAuthenticated(true);
      setShow2FA(false);
      setTwoFactorCode('');
      toast.success('Аутентификация успешна!');
      setTimeout(() => {
        setIsConnected(true);
        toast.success(`Подключено к ${selectedServer.city}`);
      }, 300);
    } else {
      toast.error('Введите корректный 6-значный код');
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 40) return 'text-green-500';
    if (load < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPingColor = (ping: number) => {
    if (ping < 50) return 'text-green-500';
    if (ping < 100) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold">SecureVPN</h1>
          </div>
          
          {isAuthenticated && (
            <Badge variant="outline" className="gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
              Авторизован
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-card border-border">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className={`w-48 h-48 rounded-full border-8 flex items-center justify-center transition-all duration-500 ${
                    isConnected 
                      ? 'border-primary bg-primary/10 animate-pulse-slow' 
                      : 'border-muted bg-muted/5'
                  }`}>
                    <Icon 
                      name={isConnected ? "ShieldCheck" : "Shield"} 
                      size={80} 
                      className={isConnected ? "text-primary" : "text-muted-foreground"}
                    />
                  </div>
                  {isConnected && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        {selectedServer.flag} {selectedServer.city}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {isConnected ? 'Защищено' : 'Не защищено'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isConnected 
                      ? `Ваше соединение зашифровано и защищено` 
                      : 'Нажмите для подключения к VPN'}
                  </p>
                </div>

                <Button 
                  size="lg"
                  onClick={handleConnect}
                  className={`w-full max-w-xs h-14 text-lg font-semibold transition-all duration-300 ${
                    isConnected 
                      ? 'bg-destructive hover:bg-destructive/90' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isConnected ? 'Отключить' : 'Подключить'}
                </Button>

                {isConnected && (
                  <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-border">
                    <div className="text-center">
                      <Icon name="Download" size={20} className="text-primary mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">Загрузка</p>
                      <p className="text-lg font-semibold">5.2 Мб/с</p>
                    </div>
                    <div className="text-center">
                      <Icon name="Upload" size={20} className="text-primary mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">Отдача</p>
                      <p className="text-lg font-semibold">2.8 Мб/с</p>
                    </div>
                    <div className="text-center">
                      <Icon name="Clock" size={20} className="text-primary mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">Время</p>
                      <p className="text-lg font-semibold">24:13</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Server" size={20} />
                Серверы
              </h3>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {servers.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => {
                      setSelectedServer(server);
                      if (isConnected) {
                        toast.success(`Переподключено к ${server.city}`);
                      }
                    }}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 text-left hover:border-primary/50 ${
                      selectedServer.id === server.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-card/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{server.flag}</span>
                        <div>
                          <p className="font-semibold">{server.country}</p>
                          <p className="text-sm text-muted-foreground">{server.city}</p>
                        </div>
                      </div>
                      {selectedServer.id === server.id && (
                        <Icon name="Check" size={20} className="text-primary" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Icon name="Activity" size={14} className={getPingColor(server.ping)} />
                        <span className={getPingColor(server.ping)}>{server.ping}ms</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Gauge" size={14} className={getLoadColor(server.load)} />
                        <span className={getLoadColor(server.load)}>{server.load}%</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={show2FA} onOpenChange={setShow2FA}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="ShieldCheck" size={24} className="text-primary" />
              Двухфакторная аутентификация
            </DialogTitle>
            <DialogDescription>
              Введите 6-значный код из вашего приложения-аутентификатора
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код подтверждения</Label>
              <Input
                id="code"
                placeholder="000000"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest font-mono"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handle2FASubmit();
                  }
                }}
              />
            </div>
            
            <Button 
              onClick={handle2FASubmit} 
              className="w-full"
              disabled={twoFactorCode.length !== 6}
            >
              Подтвердить
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Не получили код? Проверьте приложение Google Authenticator или Authy
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
