import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAdmin } from '../../context/AdminContext';

export function AdminLogin() {
  const { isAdminLoggedIn, adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminLoggedIn, navigate]);

  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await adminLogin(email, password);
      navigate('/admin', { replace: true });
    } catch (submitError) {
      const message = submitError instanceof Error
        ? submitError.message
        : 'Connexion admin impossible. Verifiez vos identifiants.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-violet/10 via-primary/5 to-secondary/10 py-12 px-4">
      <Card className="w-full max-w-md border-violet/20">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet via-primary to-secondary flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Connexion administration</h1>
          <p className="text-muted-foreground">Acces reserve a l'equipe admin</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium">E-mail admin</label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="admin@cercleatalanka.org"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium">Mot de passe</label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="violet" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion admin...' : 'Se connecter en admin'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Vous cherchez l'espace utilisateur ?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Connexion standard
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
