import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { startChariowCheckout } from '../lib/payments';
import { formatPrice } from '../lib/utils';
import { Input } from '../components/ui/Input';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [checkoutError, setCheckoutError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneCountryCode, setPhoneCountryCode] = useState('BJ');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length !== 1) {
      setCheckoutError('Le checkout Chariow fonctionne produit par produit. Finalisez un seul contenu a la fois.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !phoneCountryCode.trim()) {
      setCheckoutError('Veuillez renseigner vos informations client avant le paiement.');
      return;
    }

    setCheckoutError('');
    setIsCheckingOut(true);

    try {
      const result = await startChariowCheckout({
        item: items[0],
        email,
        fullName,
        phoneNumber,
        phoneCountryCode,
        origin: window.location.origin,
      });

      if (result.step === 'completed' || result.step === 'already_purchased') {
        clearCart();
        navigate('/dashboard/purchases');
        return;
      }

      if (!result.checkoutUrl) {
        throw new Error('Aucune URL de paiement n\'a ete retournee par Chariow.');
      }

      window.location.assign(`${result.checkoutUrl}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Le paiement a echoue.';
      setCheckoutError(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-6">
            Découvrez notre collection de livres et d'enseignements spirituels
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/books">
              <Button variant="primary">Explorer les livres</Button>
            </Link>
            <Link to="/teachings">
              <Button variant="outline">Voir les enseignements</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Panier</h1>
        <p className="text-muted-foreground">
          {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((cartItem) => {
            const item = cartItem.item;
            const isBook = 'price' in item;
            const price = isBook ? item.price : 0;

            return (
              <Card key={cartItem.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {isBook && 'coverImageUrl' in item && (
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="h-24 w-16 object-cover rounded"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {isBook && 'author' in item ? `Par ${item.author}` : item.category}
                          </p>
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {cartItem.type === 'book' ? 'Livre' : 'Enseignement'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(cartItem.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                            disabled={cartItem.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{cartItem.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-lg font-bold text-secondary">
                          {formatPrice(price * cartItem.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <h3 className="font-semibold">Récapitulatif</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 rounded-lg border border-border p-4">
                <h4 className="font-medium text-sm">Informations de paiement</h4>
                <div className="space-y-2">
                  <label htmlFor="checkout-fullname" className="text-sm font-medium">Nom complet</label>
                  <Input
                    id="checkout-fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="checkout-email" className="text-sm font-medium">Email</label>
                  <Input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <label htmlFor="checkout-country" className="text-sm font-medium">Code pays</label>
                    <Input
                      id="checkout-country"
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value.toUpperCase())}
                      placeholder="BJ"
                      maxLength={10}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label htmlFor="checkout-phone" className="text-sm font-medium">Telephone</label>
                    <Input
                      id="checkout-phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="0199001122"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Chariow demande un email, un nom et un numero de telephone pour ouvrir la session de paiement.
                </p>
              </div>

              {checkoutError && (
                <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {checkoutError}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TVA (0%)</span>
                  <span>{formatPrice(0)}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-xl text-secondary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {isCheckingOut ? 'Paiement en cours...' : 'Procéder au paiement'}
              </Button>

              <Button
                variant="ghost"
                            disabled
                className="w-full"
                size="sm"
                onClick={clearCart}
              >
                Vider le panier
              </Button>

              <div className="bg-accent/10 rounded-lg p-4 mt-4">
                <h4 className="font-medium mb-2 text-sm">Paiement sécurisé</h4>
                <p className="text-xs text-muted-foreground">
                  Toutes les transactions sont cryptées et sécurisées.
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-sm">Accès instantané</h4>
                <p className="text-xs text-muted-foreground">
                  Apres validation Chariow, vos achats sont synchronises avec votre compte.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
