'use client';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsNavItems = [
    {
        title: 'General',
        href: '/tenant/settings/general',
    },
    {
        title: 'Branding',
        href: '/tenant/settings/branding',
    },
    {
        title: 'Localization',
        href: '/tenant/settings/localization',
    },
    {
        title: 'Notifications',
        href: '/tenant/settings/notifications',
    },
];

export default function TenantSettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {settingsNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    buttonVariants({ variant: 'ghost' }),
                                    pathname === item.href
                                        ? 'bg-muted hover:bg-muted'
                                        : 'hover:bg-transparent hover:underline',
                                    'justify-start'
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-3xl">{children}</div>
            </div>
        </div>
    );
} 