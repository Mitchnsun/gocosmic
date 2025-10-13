import dynamic from 'next/dynamic';

import { Loader } from '@/components/Loader';

// Dynamically import the JourneyContent to avoid SSR issues with Three.js
const JourneyContent = dynamic(() => import('@/views/Journey'), {
  loading: () => <Loader className="bg-gray-900" fullScreen />,
});

export default function JourneyPage() {
  return <JourneyContent />;
}
