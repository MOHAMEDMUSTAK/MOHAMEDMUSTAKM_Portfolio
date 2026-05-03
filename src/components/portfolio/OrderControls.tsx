import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  className?: string;
}

export default function OrderControls({ 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast,
  className = ''
}: OrderControlsProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        size="sm"
        disabled={isFirst}
        className="h-6 w-6 p-0 bg-muted/40 hover:bg-muted/60 border border-border/30 disabled:opacity-30 disabled:cursor-not-allowed"
        variant="ghost"
      >
        <ChevronUp className="w-3 h-3 text-muted-foreground" />
      </Button>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        size="sm"
        disabled={isLast}
        className="h-6 w-6 p-0 bg-muted/40 hover:bg-muted/60 border border-border/30 disabled:opacity-30 disabled:cursor-not-allowed"
        variant="ghost"
      >
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </Button>
    </div>
  );
}
