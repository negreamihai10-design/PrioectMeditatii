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
  Sigma,
  Microscope,
  Code2,
  PenTool,
  Globe,
  BookMarked,
  Piano,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator: Sigma,
  Atom,
  FlaskConical: Microscope,
  Monitor: Code2,
  BookOpen: BookMarked,
  Languages: Globe,
  Palette: PenTool,
  Music: Piano,
};

interface Props {
  icon: string;
  className?: string;
}

export default function SubjectIcon({ icon, className = 'w-7 h-7' }: Props) {
  const Icon = iconMap[icon] ?? GraduationCap;
  return <Icon className={className} />;
}
