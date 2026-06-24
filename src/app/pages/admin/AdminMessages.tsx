import { useEffect, useMemo, useState } from 'react';
import { Search, Send, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import {
  deleteConversation,
  getAdminConversations,
  markConversationAsRead,
  sendAdminReply,
} from '../../lib/messages';
import { Message } from '../../lib/types';
import { formatRelativeTime } from '../../lib/utils';

export function AdminMessages() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadMessages = async () => {
      try {
        setError('');
        const data = await getAdminConversations();

        if (!isActive) {
          return;
        }

        setMessages(data);
        setSelectedUserId((current) => current || data.find((message) => !message.isAdminReply)?.userId || null);
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

    void loadMessages();

    return () => {
      isActive = false;
    };
  }, []);

  const threadSummaries = useMemo(() => {
    const summaries = new Map<string, { userId: string; userName: string; userAvatar?: string; lastMessage: string; lastDate: string; unread: number }>();

    messages.forEach((message) => {
      const current = summaries.get(message.userId);
      const unreadIncrement = !message.isAdminReply && !message.read ? 1 : 0;

      if (!current) {
        summaries.set(message.userId, {
          userId: message.userId,
          userName: message.userName,
          userAvatar: message.userAvatar,
          lastMessage: message.message,
          lastDate: message.createdAt,
          unread: unreadIncrement,
        });
        return;
      }

      summaries.set(message.userId, {
        ...current,
        userName: message.userName,
        userAvatar: message.userAvatar || current.userAvatar,
        lastMessage: message.message,
        lastDate: message.createdAt,
        unread: current.unread + unreadIncrement,
      });
    });

    return Array.from(summaries.values()).sort(
      (left, right) => new Date(right.lastDate).getTime() - new Date(left.lastDate).getTime()
    );
  }, [messages]);

  const filteredThreads = threadSummaries.filter((thread) =>
    thread.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = messages.filter((message) => message.userId === selectedUserId);
  const selectedThread = filteredThreads.find((thread) => thread.userId === selectedUserId)
    || threadSummaries.find((thread) => thread.userId === selectedUserId)
    || null;

  const unreadCount = threadSummaries.reduce((sum, thread) => sum + thread.unread, 0);

  const handleMarkAsRead = async (userId: string) => {
    try {
      await markConversationAsRead(userId);
      setMessages((prev) => prev.map((message) => (
        message.userId === userId && !message.isAdminReply
          ? { ...message, read: true }
          : message
      )));
    } catch (markError) {
      setError(markError instanceof Error ? markError.message : 'Impossible de marquer la conversation comme lue.');
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      try {
        await deleteConversation(userId);
        setMessages((prev) => prev.filter((message) => message.userId !== userId));
        setSelectedUserId((current) => (current === userId ? null : current));
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : 'Impossible de supprimer la conversation.');
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedUserId) return;

    setIsSubmitting(true);
    setError('');

    try {
      const newMessage = await sendAdminReply(selectedUserId, replyText.trim());
      setMessages((prev) => [...prev, newMessage]);
      setReplyText('');
    } catch (replyError) {
      setError(replyError instanceof Error ? replyError.message : 'Impossible d\'envoyer la réponse.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          Cette section est réservée aux administrateurs.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Messages utilisateurs</h2>
          <p className="text-muted-foreground">
            {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {isLoading && (
                  <p className="text-sm text-muted-foreground">Chargement des conversations...</p>
                )}

                {filteredThreads.map(thread => (
                  <div
                    key={thread.userId}
                    onClick={() => setSelectedUserId(thread.userId)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUserId === thread.userId
                        ? 'bg-primary/10 border border-primary'
                        : 'hover:bg-muted'
                    } ${thread.unread > 0 ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={thread.userAvatar || 'https://ui-avatars.com/api/?name=User&size=40&background=6b7280&color=fff'}
                        alt={thread.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{thread.userName}</p>
                          {thread.unread > 0 && (
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {thread.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(thread.lastDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedThread ? (
            <Card className="h-full flex flex-col">
              <div className="border-b border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedThread.userAvatar || 'https://ui-avatars.com/api/?name=User&size=48&background=6b7280&color=fff'}
                      alt={selectedThread.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{selectedThread.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatRelativeTime(selectedThread.lastDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedThread.unread > 0 && selectedUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedUserId)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme lu
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => selectedUserId && handleDelete(selectedUserId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {currentConversation.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isAdminReply ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.isAdminReply ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                      }`}>
                        <img
                          src={message.userAvatar || 'https://ui-avatars.com/api/?name=User&size=32&background=6b7280&color=fff'}
                          alt={message.userName}
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className={`${
                          message.isAdminReply ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        } rounded-lg p-4`}>
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs mt-2 opacity-70">
                            {formatRelativeTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border p-6">
                <div className="flex items-end space-x-2">
                  <textarea
                    placeholder="Écrivez votre réponse..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 min-h-[80px] bg-input-background border border-border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || isSubmitting}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Sélectionnez un message pour voir la conversation
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}