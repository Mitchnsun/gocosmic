import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import { Loader } from '@/components/Loader';

// Dynamically import the JourneyContent to avoid SSR issues with Three.js
const JourneyContent = dynamic(() => import('@/views/Journey'), {
  loading: () => <Loader className="bg-gray-900" fullScreen />,
});

export default function JourneyPage() {
  const t = useTranslations('journey');

  // Pass translations as props to the dynamically loaded component
  const translations = {
    title: t('title'),
    subtitle: t('subtitle'),
  };

  return <JourneyContent translations={translations} />;
}
