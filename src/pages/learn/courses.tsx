import CourseItem from './components/course-item';
import CoursesLeaderHeader from './components/courses-leader-header';
import { dummyCourses } from './constant/courses';
import type { Course } from './types/course';

export default function CoursesPages() {
  const allCourses: Course[] = dummyCourses;

  return (
    <>
      <CoursesLeaderHeader />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h3 className='text-2xl font-bold mb-3.5'>All Courses</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
          {allCourses.map((course) => (
            <CourseItem key={course.courseId} course={course} />
          ))}
        </div>
      </div>
    </>
  );
}
