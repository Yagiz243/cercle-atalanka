import { useEffect, useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { getCurrentUserConversation, sendUserMessage } from '../../lib/messages';
import { Message } from '../../lib/types';
import { formatRelativeTime } from '../../lib/utils';

export function DashboardMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadConversation = async () => {
      try {
        setError('');
        const data = await getCurrentUserConversation(user);

        if (isActive) {
          setMessages(data);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les messages.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadConversation();

    return () => {
      isActive = false;
    };
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsSending(true);
    setError('');

    try {
      const message = await sendUserMessage(user, newMessage.trim());
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Impossible d\'envoyer le message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Messages</h2>
        <p className="text-muted-foreground">
          Communiquez directement avec l'équipe du Cercle Atalanka
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary via-secondary to-violet flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Support Cercle Atalanka</h3>
              <p className="text-xs text-muted-foreground">Nous répondons généralement en 24h</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading && (
            <p className="text-sm text-muted-foreground">Chargement de la conversation...</p>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isAdminReply ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.isAdminReply ? 'flex-row' : 'flex-row-reverse space-x-reverse'
              }`}>
                <img
                  src={message.userAvatar || 'https://ui-avatars.com/api/?name=User&size=32&background=6b7280&color=fff'}
                  alt={message.userName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className={`flex flex-col ${message.isAdminReply ? 'items-start' : 'items-end'}`}>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.isAdminReply
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="border-t border-border p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Input
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              disabled={!user || isSending}
            />
            <Button type="submit" variant="primary" disabled={!newMessage.trim() || !user || isSending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-violet/5 to-primary/5 border-violet/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Besoin d'aide immédiate?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Consultez notre FAQ ou nos guides pour obtenir des réponses rapides à vos questions.
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Voir la FAQ</Button>
            <Button variant="outline" size="sm">Guides</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}