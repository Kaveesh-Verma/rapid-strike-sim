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
    <div className={`bg-black/50 rounded-xl border p-4 transition-all duration-300 hover:border-cyber-green/40 ${
      highlight ? 'border-cyber-green/40' : 'border-cyber-green/20'
    }`}>
      <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1 font-mono">
        <Icon className={`w-4 h-4 ${highlight ? 'text-cyber-green' : 'text-gray-500'}`} />
        {label}
      </div>
      <p className={`text-2xl font-bold font-mono ${highlight ? 'text-cyber-green' : 'text-gray-300'}`}>
        {typeof value === 'number' ? displayValue : value}
        {suffix && <span className="text-lg text-gray-600">{suffix}</span>}
      </p>
    </div>
  );
};

export default StatCard;