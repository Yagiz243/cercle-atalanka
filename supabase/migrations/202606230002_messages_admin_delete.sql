create policy "messages_admin_delete"
on public.messages
for delete
using (public.is_admin(auth.uid()));