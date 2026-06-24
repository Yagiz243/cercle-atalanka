import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { verifyChariowPayment } from '../lib/payments';

export function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'completed' | 'pending' | 'failed'>('loading');
  const [message, setMessage] = useState('Verification de votre paiement...');

  useEffect(() => {
    const sessionId = searchParams.get('session');

    if (!sessionId) {
      setStatus('failed');
      setMessage('Aucune session de paiement n\'a ete trouvee.');
      return;
    }

    let isActive = true;

    const verify = async () => {
      try {
        const result = await verifyChariowPayment(sessionId);

        if (!isActive) {
          return;
        }

        if (result.status === 'completed' || result.status === 'already_purchased') {
          clearCart();
          setStatus('completed');
          setMessage(result.message);
          return;
        }

        if (result.status === 'pending') {
          setStatus('pending');
          setMessage(result.message);
          return;
        }

        setStatus('failed');
        setMessage(result.message);
      } catch (error) {
        setStatus('failed');
        setMessage(error instanceof Error ? error.message : 'Impossible de verifier le paiement.');
      }
    };

    void verify();

    return () => {
      isActive = false;
    };
  }, [clearCart, searchParams]);

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="mx-auto max-w-xl">
        <CardContent className="p-8 text-center space-y-6">
          {status === 'loading' && <LoaderCircle className="mx-auto h-14 w-14 animate-spin text-primary" />}
          {status === 'completed' && <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />}
          {status === 'failed' && <XCircle className="mx-auto h-14 w-14 text-destructive" />}
          {status === 'pending' && <LoaderCircle className="mx-auto h-14 w-14 text-secondary" />}

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Retour de paiement</h1>
            <p className="text-muted-foreground">{message}</p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard/purchases">
              <Button variant="primary">Voir mes achats</Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline">Retour au panier</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}