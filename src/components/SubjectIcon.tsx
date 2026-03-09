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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  Atom,
  FlaskConical,
  Monitor,
  BookOpen,
  Languages,
  Palette,
  Music,
};

interface Props {
  icon: string;
  className?: string;
}

export default function SubjectIcon({ icon, className = 'w-7 h-7' }: Props) {
  const Icon = iconMap[icon] ?? GraduationCap;
  return <Icon className={className} />;
}
