import DashboardLayout from '../dashboard/layout';

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 