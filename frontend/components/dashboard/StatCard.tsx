// components/StatCard.tsx
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
  teal:  { bg: "bg-[#E1F5EE]", text: "text-[#0F6E56]" },
  amber: { bg: "bg-[#FAEEDA]", text: "text-[#854F0B]" },
  coral: { bg: "bg-[#FAECE7]", text: "text-[#993C1D]" },
  blue:  { bg: "bg-[#E6F1FB]", text: "text-[#185FA5]" },
};

const deltaColor = {
  up:      "text-[#3B6D11]",
  neutral: "text-gray-400",
  down:    "text-[#A32D2D]",
};

export default function StatCard({
  title, value, description, icon: Icon,
  delta, deltaType = "neutral", color = "teal",
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg}`}>
        <Icon size={18} className={c.text} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{title}</p>
      </div>
      {delta && (
        <p className={`text-xs ${deltaColor[deltaType]} flex items-center gap-1`}>
          {deltaType === "up" ? "↑" : deltaType === "down" ? "↓" : "—"} {delta}
        </p>
      )}
    </div>
  );
}