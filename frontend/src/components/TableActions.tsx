import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface TableActionsProps {
  actions: TableAction[];
}

export default function TableActions({ actions }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-[#a39e98] hover:text-[rgba(0,0,0,0.95)] hover:bg-[rgba(0,0,0,0.05)]"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 bg-white border-[rgba(0,0,0,0.1)] shadow-notion-deep rounded-xl p-1"
      >
        {actions.map((action, index) => (
          <div key={action.label}>
            {index > 0 && action.variant === 'danger' && <DropdownMenuSeparator className="bg-[rgba(0,0,0,0.06)]" />}
            <DropdownMenuItem
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                action.variant === 'danger'
                  ? 'text-primary-red focus:text-primary-red focus:bg-[rgba(196,30,58,0.06)]'
                  : 'text-[rgba(0,0,0,0.95)] focus:bg-[rgba(0,0,0,0.04)]'
              } ${action.disabled ? 'opacity-50' : ''}`}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
