import {
  Bot,
  BriefcaseBusiness,
  Camera,
  Code2,
  Database,
  Globe2,
  Mail,
  MonitorSmartphone,
  Rocket,
  Server,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { IconKey } from "@/types/content";

export const iconMap: Record<IconKey, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  code2: Code2,
  briefcaseBusiness: BriefcaseBusiness,
  camera: Camera,
  mail: Mail,
  globe2: Globe2,
  smartphone: Smartphone,
  monitorSmartphone: MonitorSmartphone,
  bot: Bot,
  settings2: Settings2,
  server: Server,
  database: Database,
  rocket: Rocket,
  sparkles: Sparkles,
  shieldCheck: ShieldCheck,
  workflow: Workflow,
};

export const allowedIconKeys = Object.keys(iconMap) as IconKey[];

