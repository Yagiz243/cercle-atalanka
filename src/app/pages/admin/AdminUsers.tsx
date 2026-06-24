import { useEffect, useMemo, useState } from 'react';
import { Search, Shield, Ban, Mail } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { fetchAdminProfiles, fetchProfiles } from '../../lib/community';
import { updateUserRole } from '../../lib/admin';
import { User } from '../../lib/types';
import { formatDate } from '../../lib/utils';

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
      try {
        setError('');
        const [regularUsers, admins] = await Promise.all([fetchProfiles(), fetchAdminProfiles()]);

        if (isActive) {
          setAllUsers(regularUsers);
          setAdminUsers(admins);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les utilisateurs.');
        }
      }
    };

    void loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredUsers = allUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleAdmin = async (userId: string) => {
    const currentUser = allUsers.find((user) => user.id === userId);

    if (!currentUser) {
      return;
    }

    const nextRole = currentUser.role === 'admin' ? 'user' : 'admin';

    try {
      await updateUserRole(userId, nextRole);
      setAllUsers((prev) => prev.map((user) => (
        user.id === userId ? { ...user, role: nextRole } : user
      )));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Impossible de mettre a jour le role.');
    }
  };

  const handleBanUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir bannir cet utilisateur?')) {
      alert(`Utilisateur ${userId} banni`);
    }
  };

  const handleSendEmail = (email: string) => {
    alert(`Envoyer un email à ${email}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h2>
          <p className="text-muted-foreground">Gérez les membres de votre plateforme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total utilisateurs</p>
            <p className="text-3xl font-bold">{allUsers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Administrateurs</p>
            <p className="text-3xl font-bold">
              {adminUsers.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Membres actifs</p>
            <p className="text-3xl font-bold">{allUsers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Nouveaux (mois)</p>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          {error && (
            <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="pb-3 font-semibold">Utilisateur</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Rôle</th>
                  <th className="pb-3 font-semibold">Inscription</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-4">
                      {user.role === 'admin' ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-violet/10 text-violet flex items-center space-x-1 w-fit">
                          <Shield className="h-3 w-3" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          Utilisateur
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendEmail(user.email)}
                          title="Envoyer un email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAdmin(user.id)}
                          title="Basculer rôle admin"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBanUser(user.id)}
                          title="Bannir"
                        >
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage de {filteredUsers.length} sur {allUsers.length} utilisateurs
        </p>
        <p className="text-sm text-muted-foreground">
          {adminUsers.length} admin{adminUsers.length > 1 ? 's' : ''} séparé{adminUsers.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
