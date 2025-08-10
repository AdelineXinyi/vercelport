'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('./ThreeBackground'), {
  ssr: false,
});

export default function ThreeBackgroundWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <ThreeBackground />;
}