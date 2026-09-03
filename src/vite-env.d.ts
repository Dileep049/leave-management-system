/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'lucide-react' {
  import React from 'react';
  export type LucideIcon = React.FC<React.SVGProps<SVGSVGElement> & { size?: number | string; color?: string; strokeWidth?: number | string }>;
  export const Shield: LucideIcon;
  export const Users: LucideIcon;
  export const UserCheck: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Building2: LucideIcon;
  export const Building: LucideIcon;
  export const FileText: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Clock: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const XCircle: LucideIcon;
  export const Calendar: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Search: LucideIcon;
  export const Filter: LucideIcon;
  export const Award: LucideIcon;
  export const Download: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const FileSpreadsheet: LucideIcon;
  export const User: LucideIcon;
  export const Plus: LucideIcon;
  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const Hash: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Lock: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Layers: LucideIcon;
  export const Upload: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Paperclip: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Check: LucideIcon;
  export const Trash2: LucideIcon;
  export const Bell: LucideIcon;
  export const Menu: LucideIcon;
  export const LogOut: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Edit3: LucideIcon;
  export const Power: LucideIcon;
  export const KeyRound: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const UserX: LucideIcon;
  export const X: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Save: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Laptop: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Info: LucideIcon;
}

declare module 'jspdf' {
  const jsPDF: any;
  export default jsPDF;
}

declare module 'jspdf-autotable' {
  const autoTable: any;
  export default autoTable;
}
