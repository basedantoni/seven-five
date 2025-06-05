'use client';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@antho/ui/components/breadcrumb';
import { usePathname } from 'next/navigation';
import { useTRPC } from '~/trpc/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export default function RootCrumbClient() {
  const pathname = usePathname();
  const trpc = useTRPC();

  // Split pathname into segments and filter out empty strings
  const segments = pathname.split('/').filter(Boolean);

  // Check if we're on a challenge detail page
  const isChallengeDetail =
    segments.length === 2 &&
    segments[0] === 'challenges' &&
    segments[1] !== undefined &&
    !isNaN(Number(segments[1]));
  const challengeId =
    isChallengeDetail && segments[1] ? parseInt(segments[1]) : null;

  // Fetch challenge data if on challenge detail page
  const { data: challenge } = useQuery({
    ...trpc.challenge.byId.queryOptions({ id: challengeId || 0 }),
    enabled: !!challengeId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Create breadcrumb items based on path segments
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...segments.map((segment, index) => {
      // Build the href by joining segments up to current index
      const href = '/' + segments.slice(0, index + 1).join('/');

      // Format the label (capitalize first letter, handle dynamic routes)
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Handle specific segments
      if (segment === 'challenges' && index === 0) {
        label = 'Challenges';
      } else if (isChallengeDetail && index === 1 && challenge?.name) {
        // Use the fetched challenge name
        label = challenge.name;
      } else if (!isNaN(Number(segment)) && isChallengeDetail && index === 1) {
        // Fallback for numeric IDs while loading
        label = `Loading...`;
      }

      return { label, href };
    }),
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {index < breadcrumbItems.length - 1 ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <span className='font-normal text-foreground'>
                  {item.label}
                </span>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
