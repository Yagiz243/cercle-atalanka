import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { createTeaching, deleteTeachingById } from '../../lib/admin';
import { fetchTeachings } from '../../lib/content';
import { getPublicUrl, isSupabaseConfigured, uploadFile } from '../../lib/supabase';
import { Teaching } from '../../lib/types';

// 🔧 Fonction utilitaire pour nettoyer les noms de fichiers
const sanitizeFileName = (fileName: string): string => {
  // Supprimer les accents
  const withoutAccents = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Remplacer les espaces par des underscores
  const withoutSpaces = withoutAccents.replace(/\s+/g, '_');
  // Supprimer tout caractère non alphanumérique (sauf . et -)
  const sanitized = withoutSpaces.replace(/[^a-zA-Z0-9._-]/g, '');
  return sanitized;
};

export function AdminTeachings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [error, setError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'text_video' | 'text_photo' | 'text',
    category: '',
    duration: '',
    content: '',
    videoUrl: '',
    imageUrl: '',
    isPremium: false,
  });

  useEffect(() => {
    let isActive = true;

    const loadTeachings = async () => {
      try {
        setError('');
        const data = await fetchTeachings();

        if (isActive) {
          setTeachings(data);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les enseignements.');
        }
      }
    };

    void loadTeachings();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredTeachings = teachings.filter(teaching =>
    teaching.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teaching.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignement ?')) {
      try {
        await deleteTeachingById(id);
        setTeachings(teachings.filter(t => t.id !== id));
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : 'Impossible de supprimer cet enseignement.');
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      type: 'video',
      category: '',
      duration: '',
      content: '',
      videoUrl: '',
      imageUrl: '',
      isPremium: false,
    });
    setVideoFile(null);
    setImageFile(null);
  };

  const handleCreateTeaching = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      let videoUrl = form.videoUrl.trim();
      let imageUrl = form.imageUrl.trim();

      // Upload vidéo avec nom nettoyé
      if (isSupabaseConfigured && videoFile) {
        const timestamp = Date.now();
        const ext = videoFile.name.split('.').pop();
        const base = videoFile.name.split('.').slice(0, -1).join('.');
        const sanitizedBase = sanitizeFileName(base);
        const uniqueName = `${sanitizedBase}-${timestamp}.${ext}`;
        const videoPath = `admin/${uniqueName}`;
        await uploadFile('teaching-videos', videoPath, videoFile);
        videoUrl = await getPublicUrl('teaching-videos', videoPath);
      }

      // Upload image avec nom nettoyé
      if (isSupabaseConfigured && imageFile) {
        const timestamp = Date.now();
        const ext = imageFile.name.split('.').pop();
        const base = imageFile.name.split('.').slice(0, -1).join('.');
        const sanitizedBase = sanitizeFileName(base);
        const uniqueName = `${sanitizedBase}-${timestamp}.${ext}`;
        const imagePath = `admin/${uniqueName}`;
        await uploadFile('teaching-images', imagePath, imageFile);
        imageUrl = await getPublicUrl('teaching-images', imagePath);
      }

      // Placeholder en mode démo (sans Supabase)
      if (!isSupabaseConfigured && !videoUrl && !imageUrl && !form.content.trim()) {
        if (form.type === 'video' || form.type === 'text_video') {
          videoUrl = 'https://via.placeholder.com/video';
        }
        if (form.type === 'text_photo' || form.type === 'text_video') {
          imageUrl = 'https://via.placeholder.com/300x200?text=Teaching+Image';
        }
      }

      const createdTeaching = await createTeaching({
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        category: form.category.trim(),
        duration: form.duration.trim() || undefined,
        content: form.content.trim() || undefined,
        videoUrl: videoUrl || undefined,
        images: imageUrl ? [imageUrl] : undefined,
        isPremium: form.isPremium,
      });

      setTeachings((previous) => [createdTeaching, ...previous]);
      resetForm();
      setIsCreateOpen(false);
    } catch (createError) {
      console.error('Erreur création enseignement:', createError);
      setError(createError instanceof Error ? createError.message : 'Impossible de créer cet enseignement.');
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video: 'Vidéo',
      text_video: 'Texte + Vidéo',
      text_photo: 'Texte + Photo',
      text: 'Texte',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Gestion des enseignements</h2>
          <p className="text-muted-foreground">Gérez vos contenus pédagogiques</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un enseignement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un enseignement</DialogTitle>
              <DialogDescription>
                Créez un contenu avec texte, vidéo et/ou photo depuis ce formulaire. {!isSupabaseConfigured && 'Mode démo: les fichiers uploadés ne seront pas stockés, des images par défaut seront utilisées.'}
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreateTeaching}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="teaching-title" className="text-sm font-medium">Titre</label>
                  <Input id="teaching-title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="teaching-category" className="text-sm font-medium">Catégorie</label>
                  <Input id="teaching-category" value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="teaching-type" className="text-sm font-medium">Type</label>
                  <select
                    id="teaching-type"
                    value={form.type}
                    onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as 'video' | 'text_video' | 'text_photo' | 'text' }))}
                    className="border-input bg-input-background h-9 w-full rounded-md border px-3 text-sm"
                  >
                    <option value="video">Vidéo</option>
                    <option value="text_video">Texte + Vidéo</option>
                    <option value="text_photo">Texte + Photo</option>
                    <option value="text">Texte</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="teaching-duration" className="text-sm font-medium">Durée (optionnel)</label>
                  <Input id="teaching-duration" value={form.duration} onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))} placeholder="Ex: 1h 30min" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="teaching-description" className="text-sm font-medium">Description</label>
                <Textarea id="teaching-description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="teaching-content" className="text-sm font-medium">Contenu texte (optionnel)</label>
                <Textarea id="teaching-content" value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="teaching-video-url" className="text-sm font-medium">URL vidéo (optionnel)</label>
                  <Input id="teaching-video-url" value={form.videoUrl} onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="teaching-video-file" className="text-sm font-medium">Upload vidéo {!isSupabaseConfigured && '(désactivé en mode démo)'}</label>
                  <Input id="teaching-video-file" type="file" accept="video/*" onChange={(event) => setVideoFile(event.target.files?.[0] || null)} disabled={!isSupabaseConfigured} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="teaching-image-url" className="text-sm font-medium">URL photo (optionnel)</label>
                  <Input id="teaching-image-url" value={form.imageUrl} onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="teaching-image-file" className="text-sm font-medium">Upload photo {!isSupabaseConfigured && '(désactivé en mode démo)'}</label>
                  <Input id="teaching-image-file" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} disabled={!isSupabaseConfigured} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm font-medium">Contenu premium</span>
                <Switch checked={form.isPremium} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isPremium: checked }))} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
                  Annuler
                </Button>
                <Button type="submit" variant="accent" disabled={isSaving}>
                  {isSaving ? 'Création...' : 'Créer l\'enseignement'}
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
                placeholder="Rechercher par titre ou catégorie..."
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
                  <th className="pb-3 font-semibold">Titre</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Catégorie</th>
                  <th className="pb-3 font-semibold">Durée</th>
                  <th className="pb-3 font-semibold">Vues</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachings.map(teaching => (
                  <tr key={teaching.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{teaching.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {teaching.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                        {getTypeLabel(teaching.type)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {teaching.category}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {teaching.duration || '-'}
                    </td>
                    <td className="py-4 text-sm">
                      {teaching.views?.toLocaleString() || '0'}
                    </td>
                    <td className="py-4">
                      {teaching.isPremium ? (
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
                          onClick={() => handleDelete(teaching.id)}
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

          {filteredTeachings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun enseignement trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage de {filteredTeachings.length} sur {teachings.length} enseignements
        </p>
      </div>
    </div>
  );
}