import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { createBook, deleteBookById } from '../../lib/admin';
import { fetchBooks } from '../../lib/content';
import { getPublicUrl, isSupabaseConfigured, uploadFile } from '../../lib/supabase';
import { Book } from '../../lib/types';
import { formatPrice } from '../../lib/utils';

export function AdminBooks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    price: '0',
    description: '',
    coverImageUrl: '',
    pdfUrl: '',
    isPremium: false,
  });

  useEffect(() => {
    let isActive = true;

    const loadBooks = async () => {
      try {
        setError('');
        const data = await fetchBooks();

        if (isActive) {
          setBooks(data);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les livres.');
        }
      }
    };

    void loadBooks();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        await deleteBookById(id);
        setBooks(books.filter(b => b.id !== id));
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : 'Impossible de supprimer ce livre.');
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      author: '',
      category: '',
      price: '0',
      description: '',
      coverImageUrl: '',
      pdfUrl: '',
      isPremium: false,
    });
    setCoverFile(null);
    setPdfFile(null);
  };

  const handleCreateBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      let coverImageUrl = form.coverImageUrl.trim();
      let pdfUrl = form.pdfUrl.trim();

      if (isSupabaseConfigured && coverFile) {
        // Générer un nom unique avec timestamp
        const timestamp = Date.now();
        const ext = coverFile.name.split('.').pop();
        const base = coverFile.name.split('.').slice(0, -1).join('.');
        const uniqueName = `${base}-${timestamp}.${ext}`;
        const coverPath = `admin/${uniqueName}`;
        await uploadFile('book-covers', coverPath, coverFile);
        coverImageUrl = await getPublicUrl('book-covers', coverPath);
      }

      if (isSupabaseConfigured && !coverImageUrl) {
        throw new Error('Ajoutez une couverture (URL ou fichier).');
      }

      if (!coverImageUrl) {
        coverImageUrl = 'https://via.placeholder.com/300x400?text=Book+Cover';
      }

      if (isSupabaseConfigured && pdfFile) {
        const timestamp = Date.now();
        const ext = pdfFile.name.split('.').pop();
        const base = pdfFile.name.split('.').slice(0, -1).join('.');
        const uniqueName = `${base}-${timestamp}.${ext}`;
        const pdfPath = `admin/${uniqueName}`;
        await uploadFile('book-pdfs', pdfPath, pdfFile);
        pdfUrl = await getPublicUrl('book-pdfs', pdfPath);
      }

      const createdBook = await createBook({
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        isPremium: form.isPremium,
        coverImageUrl,
        pdfUrl: pdfUrl || undefined,
      });

      setBooks((previous) => [createdBook, ...previous]);
      resetForm();
      setIsCreateOpen(false);
    } catch (createError) {
      console.error('Erreur création livre:', createError);
      setError(createError instanceof Error ? createError.message : 'Impossible de créer ce livre.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Gestion des livres</h2>
          <p className="text-muted-foreground">Gérez votre catalogue de livres</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un livre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un livre</DialogTitle>
              <DialogDescription>
                Renseignez les informations du livre. {!isSupabaseConfigured && 'Mode démo: les fichiers uploadés ne seront pas stockés, des images par défaut seront utilisées.'}
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreateBook}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="book-title" className="text-sm font-medium">Titre</label>
                  <Input id="book-title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="book-author" className="text-sm font-medium">Auteur</label>
                  <Input id="book-author" value={form.author} onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="book-category" className="text-sm font-medium">Catégorie</label>
                  <Input id="book-category" value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="book-price" className="text-sm font-medium">Prix</label>
                  <Input id="book-price" type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} required />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="book-description" className="text-sm font-medium">Description</label>
                <Textarea id="book-description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="book-cover-url" className="text-sm font-medium">URL couverture (optionnel)</label>
                  <Input id="book-cover-url" value={form.coverImageUrl} onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="book-cover-file" className="text-sm font-medium">Upload couverture {!isSupabaseConfigured && '(désactivé en mode démo)'}</label>
                  <Input id="book-cover-file" type="file" accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] || null)} disabled={!isSupabaseConfigured} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="book-pdf-url" className="text-sm font-medium">URL PDF (optionnel)</label>
                  <Input id="book-pdf-url" value={form.pdfUrl} onChange={(event) => setForm((prev) => ({ ...prev, pdfUrl: event.target.value }))} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="book-pdf-file" className="text-sm font-medium">Upload PDF {!isSupabaseConfigured && '(désactivé en mode démo)'}</label>
                  <Input id="book-pdf-file" type="file" accept="application/pdf" onChange={(event) => setPdfFile(event.target.files?.[0] || null)} disabled={!isSupabaseConfigured} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm font-medium">Livre premium</span>
                <Switch checked={form.isPremium} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isPremium: checked }))} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? 'Création...' : 'Créer le livre'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                placeholder="Rechercher par titre ou auteur..."
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
                  <th className="pb-3 font-semibold">Livre</th>
                  <th className="pb-3 font-semibold">Auteur</th>
                  <th className="pb-3 font-semibold">Catégorie</th>
                  <th className="pb-3 font-semibold">Prix</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold">Avis</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Book+Cover'; }}
                        />
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {book.reviews} avis
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{book.author}</td>
                    <td className="py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-4 font-semibold">{formatPrice(book.price)}</td>
                    <td className="py-4">
                      {book.isPremium ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-violet/10 text-violet">
                          Premium
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                          Gratuit
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{book.rating}</span>
                        <span className="text-xs text-muted-foreground">/ 5</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun livre trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage de {filteredBooks.length} sur {books.length} livres
        </p>
      </div>
    </div>
  );
}