import dynamic from 'next/dynamic';
import { createTranslator, useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Loader } from '@/components/Loader';
import { getCanonicalUrl } from '@/i18n/canonical';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = createTranslator({ messages, locale });
  const title = t('meta.title');
  const description = t('meta.description');

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/journey'),
    },
    openGraph: {
      title,
      description,
      images: ['/og-default.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-card.jpg'],
    },
  };
}

// Dynamically import the JourneyContent to avoid SSR issues with Three.js
const JourneyContent = dynamic(() => import('@/views/Journey'), {
  loading: () => <Loader className="bg-slate-950" fullScreen />,
});

export default function JourneyPage() {
  const t = useTranslations();

  // Pass translations as props to the dynamically loaded component
  const translations = {
    title: t('journey.title'),
    subtitle: t('journey.subtitle'),
  };

  return <JourneyContent translations={translations} />;
}
