import type { Quiz } from './quiz';

export interface Course {
  courseId: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  duration: string; // e.g. "55m"
  lessons: Lesson[];
  quizzes: Quiz[];
}

export interface Lesson {
  lessonId: string;
  title: string;
  shortDescription: string;
  contentType: 'video' | 'article';
  thumbnail: string;
  duration: string; // e.g. "10m"
  videoUrl?: string;
  resources?: Resource[];
}

export interface Resource {
  title: string;
  type: 'pdf' | 'external_link';
  url: string;
}
