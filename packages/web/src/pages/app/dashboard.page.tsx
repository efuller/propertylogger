import { observer } from 'mobx-react';
import { Button } from '@/components/ui/button.tsx';

export const DashboardPage = observer(() => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        You have no properties
      </h3>
      <p className="text-sm text-muted-foreground">
        You can start managing tasks as soon as you add a property.
      </p>
      <Button className="mt-4">Add Property</Button>
    </div>
  );
})