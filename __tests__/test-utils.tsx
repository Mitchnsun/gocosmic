import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ReactElement } from 'react';

// Import English messages from all namespaces for testing
import about from '../messages/en/about.json';
import common from '../messages/en/common.json';
import footer from '../messages/en/footer.json';
import home from '../messages/en/home.json';
import journey from '../messages/en/journey.json';
import navigation from '../messages/en/navigation.json';
import offers from '../messages/en/offers.json';
import projects from '../messages/en/projects.json';
import services from '../messages/en/services.json';

// Merge all namespaces
const messages = {
  ...common,
  ...navigation,
  ...footer,
  ...home,
  ...about,
  ...services,
  ...offers,
  ...journey,
  ...projects,
};

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
