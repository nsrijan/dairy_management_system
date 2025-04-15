import { redirect } from 'next/navigation';

export const GET = async () => {
  return redirect('/features/mcb/list');
}; 