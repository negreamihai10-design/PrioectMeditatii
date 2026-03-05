export interface Subject {
  name: string;
  icon: string;
  description: string;
  levels: string[];
}

export interface Tutor {
  name: string;
  subject: string;
  experience: string;
  rating: number;
  reviews: number;
  image: string;
  specialties: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
}
