import { Mail, Globe, AlertTriangle, Shield } from "lucide-react";

interface ScenarioCardProps {
  scenario: {
    scenario_id: string;
    type: string;
    title: string;
    difficulty: string;
  };
  onClick: () => void;
  completed?: boolean;
}

const ScenarioCard = ({ scenario, onClick, completed }: ScenarioCardProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'phishing': return Mail;
      case 'fake_login': return Globe;
      case 'ransomware': return AlertTriangle;
      default: return Shield;
    }
  };

  const Icon = getIcon(scenario.type);

  return (
    <button
      onClick={onClick}
      className={`border-2 border-border p-4 bg-card text-left hover:border-primary/50 transition-all duration-300 group relative overflow-hidden ${completed ? 'opacity-60' : ''}`}
    >
      {/* Hover effect */}
      <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${
            scenario.difficulty === "easy" ? "border-primary/50 text-primary" :
            scenario.difficulty === "medium" ? "border-accent/50 text-accent" :
            "border-destructive/50 text-destructive"
          }`}>
            {scenario.difficulty}
          </span>
          {completed && (
            <span className="text-xs uppercase tracking-wider px-2 py-1 border border-primary bg-primary/20 text-primary ml-auto">
              Done
            </span>
          )}
        </div>
        <h3 className="font-bold uppercase text-sm mb-1">{scenario.title}</h3>
        <p className="text-xs text-muted-foreground uppercase">{scenario.type.replace('_', ' ')}</p>
      </div>
    </button>
  );
};

export default ScenarioCard;
