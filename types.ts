import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Role {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
}

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
  progress: number;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  duration: string;
}