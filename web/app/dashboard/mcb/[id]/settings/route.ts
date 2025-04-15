import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return redirect(`/features/mcb/settings/${params.id}`);
} 