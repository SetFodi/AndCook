'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useLoading } from '../../context/LoadingContext';

interface SessionGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export default function SessionGuard({ 
  children, 
  requireAuth = false,
  requireAdmin = false 
}: SessionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading, stopLoading } = useLoading();
  
  useEffect(() => {
    // Start loading when checking session
    if (status === 'loading') {
      startLoading();
    } else {
      // Stop loading when session check is complete
      stopLoading();
      
      // If authentication is required but user is not authenticated
      if (requireAuth && status === 'unauthenticated') {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      }
      
      // If admin access is required but user is not an admin
      if (requireAdmin && session?.user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [status, session, requireAuth, requireAdmin, router, pathname, startLoading, stopLoading]);
  
  // If we're still loading the session, or if authentication is required but user is not authenticated
  if (status === 'loading' || (requireAuth && status === 'unauthenticated') || (requireAdmin && session?.user?.role !== 'admin')) {
    return null; // Return nothing while loading or redirecting
  }
  
  // Otherwise, render the children
  return <>{children}</>;
}
