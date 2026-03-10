import {
  Calculator,
  Atom,
  FlaskConical,
  Monitor,
  BookOpen,
  Languages,
  Palette,
  Music,
  GraduationCap,
} from 'lucide-react';

const lucideIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Raw Lucide component names
  calculator: Calculator,
  atom: Atom,
  flaskconical: FlaskConical,
  monitor: Monitor,
  bookopen: BookOpen,
  languages: Languages,
  palette: Palette,
  music: Music,
};

// Friendly subject identifiers -> icons.
const subjectIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  matematica: Calculator,
  mate: Calculator,
  chimie: FlaskConical,
  fizica: Atom,
  biologie: Atom,
  informatica: Monitor,
  programare: Monitor,
  romana: BookOpen,
  limbaromana: BookOpen,
  engleza: Languages,
  limbaengleza: Languages,
  franceza: Languages,
  germana: Languages,
  desen: Palette,
  arte: Palette,
  muzica: Music,
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ...lucideIconMap,
  ...subjectIconMap,
};

interface Props {
  icon: string;
  className?: string;
}

export default function SubjectIcon({ icon, className = 'w-7 h-7' }: Props) {
  const normalized = icon?.toLowerCase().replace(/[\s_-]/g, '');
  const Icon = (normalized && iconMap[normalized]) ?? GraduationCap;
  return <Icon className={className} />;
}