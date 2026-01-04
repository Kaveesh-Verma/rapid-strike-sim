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
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200 ${highlight ? 'border-blue-300' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${highlight ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
        {typeof value === 'number' ? displayValue : value}
        {suffix && <span className="text-xl text-gray-400 font-normal">{suffix}</span>}
      </p>
    </div>
  );
};

export default StatCard;