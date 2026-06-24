-- Cercle Atalanka - Seed data (safe to run multiple times)

insert into public.books (
  id,
  title,
  author,
  description,
  cover_image_url,
  pdf_url,
  price,
  is_premium,
  category,
  rating,
  reviews
)
values
  (
    '9f22a3a6-2bcf-46e3-b934-88f6404f8a11',
    'Le Chemin de la Sagesse',
    'Maitre Atalanka',
    'Guide spirituel pour cultiver la paix interieure et la clarte.',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    null,
    29.99,
    true,
    'Spiritualite',
    4.8,
    124
  ),
  (
    'd6cc96ab-c861-4467-ac95-5e247d9f7bd3',
    'Meditations Quotidiennes',
    'Cercle Atalanka',
    '365 pratiques simples pour structurer une routine de meditation.',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=600&fit=crop',
    null,
    19.99,
    false,
    'Meditation',
    4.9,
    256
  )
on conflict (id) do update
set
  title = excluded.title,
  author = excluded.author,
  description = excluded.description,
  cover_image_url = excluded.cover_image_url,
  pdf_url = excluded.pdf_url,
  price = excluded.price,
  is_premium = excluded.is_premium,
  category = excluded.category,
  rating = excluded.rating,
  reviews = excluded.reviews,
  updated_at = now();

insert into public.teachings (
  id,
  title,
  description,
  type,
  video_url,
  content,
  images,
  is_premium,
  category,
  duration,
  rating,
  views
)
values
  (
    '8ca0a485-31cb-4f64-b613-3df2fd44ca65',
    'Introduction a la Meditation',
    'Cours pour debutants avec respiration, posture et concentration.',
    'video',
    'https://example.com/videos/intro-meditation.mp4',
    null,
    null,
    false,
    'Meditation',
    '45 min',
    4.9,
    5234
  ),
  (
    '5a9155cd-f5aa-4960-a87b-0a074a4f8ea0',
    'Les Sept Chakras',
    'Exploration des chakras avec exercices pratiques et journal de progression.',
    'text_video',
    'https://example.com/videos/sept-chakras.mp4',
    'Contenu pedagogique pour approfondir chaque centre energetique.',
    '["https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1200"]'::jsonb,
    true,
    'Energie',
    '1h 30min',
    5.0,
    3456
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  type = excluded.type,
  video_url = excluded.video_url,
  content = excluded.content,
  images = excluded.images,
  is_premium = excluded.is_premium,
  category = excluded.category,
  duration = excluded.duration,
  rating = excluded.rating,
  views = excluded.views,
  updated_at = now();
