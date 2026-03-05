export interface SubjectRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  levels: string[];
  color: string;
  icon: string;
  created_at: string;
}

export interface TutorRow {
  id: string;
  name: string;
  bio: string;
  experience: string;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  image: string;
  specialties: string[];
  price: string;
  mode: 'online' | 'fizic' | 'ambele';
  days: string[];
  hours: string[];
  levels: string[];
  session_type: 'individual' | 'grup' | 'ambele';
  is_featured: boolean;
  created_at: string;
}

export interface TutorWithSubjects extends TutorRow {
  subjects: { id: string; name: string; slug: string }[];
}
