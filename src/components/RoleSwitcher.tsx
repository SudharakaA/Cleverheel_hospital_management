
import React from "react";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, ShieldCheck } from "lucide-react";

type Role = "Patient" | "Doctor" | "Admin";

interface RoleSwitcherProps {
  role: Role;
  onChange: (r: Role) => void;
  className?: string;
}

const roleItems = [
  { label: "Patient", icon: <User className="mr-1.5 w-4 h-4" /> },
  { label: "Doctor", icon: <Stethoscope className="mr-1.5 w-4 h-4" /> },
  { label: "Admin", icon: <ShieldCheck className="mr-1.5 w-4 h-4" /> },
];

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ role, onChange, className }) => (
  <div className={className}>
    <span className="uppercase text-xs text-muted-foreground font-medium tracking-wide mr-4">Role:</span>
    <div className="inline-flex gap-1">
      {roleItems.map(({ label, icon }) => (
        <Button
          key={label}
          size="sm"
          variant={role === label ? "default" : "outline"}
          onClick={() => onChange(label as Role)}
          className="flex items-center px-3"
        >
          {icon}
          {label}
        </Button>
      ))}
    </div>
  </div>
);

export type { Role };
export default RoleSwitcher;
