import { useEffect, useMemo, useState } from 'react';
import { Users, UserPlus, Heart, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { fetchCommunityMembers } from '../lib/community';
import { CommunityMember } from '../lib/types';
import { formatDate } from '../lib/utils';

export function Community() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadMembers = async () => {
      try {
        setError('');
        const data = await fetchCommunityMembers();

        if (isActive) {
          setMembers(data);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger la communaute.');
        }
      }
    };

    void loadMembers();

    return () => {
      isActive = false;
    };
  }, []);

  const interestCount = useMemo(
    () => members.reduce((sum, member) => sum + member.interests.length, 0),
    [members],
  );

  const popularInterests = useMemo(() => {
    const counts = new Map<string, number>();

    members.forEach((member) => {
      member.interests.forEach((interest) => {
        counts.set(interest, (counts.get(interest) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8)
      .map(([interest]) => interest);
  }, [members]);

  return (
    <div className="container mx-auto px-4 py-12">
      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Communauté Atalanka</h1>
        <p className="text-muted-foreground">
          Connectez-vous avec d'autres pratiquants sur le chemin de l'éveil spirituel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{members.length}</h3>
          <p className="text-muted-foreground">Membres actifs</p>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{members.length}</h3>
          <p className="text-muted-foreground">Discussions</p>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-violet/5 to-violet/10 border-violet/20">
          <div className="h-16 w-16 rounded-full bg-violet/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-violet" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{interestCount}</h3>
          <p className="text-muted-foreground">Pratiques partagées</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Membres de la communauté</h2>
          </div>

          <div className="space-y-6">
            {members.map(member => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={member.user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'}
                      alt={member.user.fullName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{member.user.fullName}</h3>
                        <span className="text-xs text-muted-foreground">
                          Membre depuis {formatDate(member.joinedAt)}
                        </span>
                      </div>
                      {member.bio && (
                        <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {member.interests.map(interest => (
                          <span
                            key={interest}
                            className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Suivre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Rejoignez la communauté</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Créez votre profil pour partager votre parcours et connecter avec d'autres membres.
              </p>
              <Button variant="violet" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Rejoindre
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">Intérêts populaires</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularInterests.map(interest => (
                  <span
                    key={interest}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet/5 to-primary/5 border-violet/20">
            <CardHeader>
              <h3 className="font-semibold">Événement à venir</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Méditation de Pleine Lune</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rejoignez-nous pour une méditation collective sous la pleine lune
                  </p>
                  <div className="text-xs text-muted-foreground">
                    📅 15 Mai 2026, 20h00
                  </div>
                </div>
                <Button variant="violet" size="sm" className="w-full">
                  S'inscrire
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
