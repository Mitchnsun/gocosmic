import { InfoPopover } from '@/design-system/info-popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/tabs';

import { SAMPLE } from './DesignSystemShowcase.copy';

/** Tabs switching between two panels, and an info button opening a bubble of context. */
export function PanelGallery() {
  return (
    <div className="flex flex-col gap-5">
      <Tabs defaultValue="managed" className="flex flex-col gap-4">
        <TabsList aria-label={SAMPLE.tabsLabel}>
          <TabsTrigger value="managed">{SAMPLE.tabManaged}</TabsTrigger>
          <TabsTrigger value="self_service">{SAMPLE.tabSelfService}</TabsTrigger>
        </TabsList>
        <TabsContent value="managed" className="text-fg-2 text-sm">
          {SAMPLE.panelManaged}
        </TabsContent>
        <TabsContent value="self_service" className="text-fg-2 text-sm">
          {SAMPLE.panelSelfService}
        </TabsContent>
      </Tabs>
      <div className="text-fg flex items-center gap-1 text-sm">
        {SAMPLE.infoOption}
        <InfoPopover label={`More about: ${SAMPLE.infoOption}`} title={SAMPLE.infoOption}>
          <p>{SAMPLE.infoBody}</p>
        </InfoPopover>
      </div>
    </div>
  );
}
