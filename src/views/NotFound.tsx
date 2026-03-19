'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-7xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
