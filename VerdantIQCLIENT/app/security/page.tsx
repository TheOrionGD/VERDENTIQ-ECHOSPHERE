import { redirect } from 'next/navigation';

export default function SecurityRootAliasPage() {
  redirect('/security/db-claims');
}
