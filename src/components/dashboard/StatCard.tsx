import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  suffix?: string;
  highlight?: boolean;
  animate?: boolean;
}

const StatCard = ({ icon: Icon, label, value, suffix = "", highlight = false, animate = true }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;

  useEffect(() => {
    if (!animate || typeof value !== 'number') {
      setDisplayValue(numericValue);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const stepValue = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue, animate, value]);

  return (
    <div className={`border-2 border-border p-6 bg-card transition-all duration-300 hover:border-primary/50 hover:cyber-glow ${highlight ? 'border-primary/30' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-6 h-6 ${highlight ? 'text-primary animate-pulse' : 'text-primary'}`} />
        <span className="text-sm uppercase text-muted-foreground tracking-wider">{label}</span>
      </div>
      <p className={`text-4xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {typeof value === 'number' ? displayValue : value}
        {suffix && <span className="text-2xl text-muted-foreground">{suffix}</span>}
      </p>
    </div>
  );
};

export default StatCard;
