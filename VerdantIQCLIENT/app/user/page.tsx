import { redirect } from 'next/navigation';

export default function UserRootAliasPage() {
  redirect('/user/dashboard');
}
