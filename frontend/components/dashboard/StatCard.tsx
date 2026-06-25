import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  delta?: string;
  deltaType?: "up" | "neutral" | "down";
  color?: "teal" | "amber" | "coral" | "blue";
}

const colorMap = {
  teal:  { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  coral: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  blue:  { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
};

export default function StatCard({
  title, value, description, icon: Icon, color = "teal",
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.bg} ${c.border} border`}>
          <Icon size={20} className={c.text} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none mb-1.5 group-hover:scale-[1.02] origin-left transition-transform">{value}</p>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
}