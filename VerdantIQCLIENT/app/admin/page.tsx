import { redirect } from 'next/navigation';

export default function AdminRootAliasPage() {
  redirect('/admin/telemetry');
}
