import React, { useMemo } from 'react';
import { Star, PlayCircle, Share2 } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { dummyCourses } from './constant/courses';
import type { Course } from './types/course';

const CourseOverviewPage: React.FC = () => {
  const allCourses: Course[] = dummyCourses;

  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // find course by id
  const course: Course | undefined = useMemo(
    () => allCourses.find((c) => c.courseId === courseId),
    [courseId, allCourses]
  );

  if (!course) {
    return (
      <div className='min-h-screen bg-green-50 flex items-center justify-center p-6'>
        <div className='max-w-xl bg-white rounded-lg p-8 shadow text-center'>
          <h2 className='text-xl font-semibold mb-2'>Course not found</h2>
          <p className='text-gray-600 mb-4'>
            We couldn't locate that course. You can return to the course
            catalog.
          </p>
          <Link
            to='/learn/courses'
            className='inline-block px-4 py-2 bg-green-600 text-white rounded-lg'
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* HERO */}
      <div className='relative bg-green-700 text-white'>
        <div
          className='absolute inset-0 bg-cover bg-center opacity-30'
          style={{ backgroundImage: `url('${course.coverImage}')` }}
        />
        <div className='relative z-10 max-w-6xl mx-auto px-6 py-14 md:py-20'>
          {/* Breadcrumbs */}
          <nav className='text-sm text-green-100 mb-4'>
            <Link to='/learn/courses' className='hover:underline'>
              Courses
            </Link>
            <span className='mx-2'>/</span>
            <span className='font-medium'>{course.title}</span>
          </nav>

          <div className='md:flex md:items-center md:justify-between'>
            <div className='md:flex-1'>
              <h1 className='text-3xl md:text-4xl font-bold leading-tight'>
                {course.title}
              </h1>
              <p className='text-green-100 max-w-2xl mt-3'>
                {course.description}
              </p>

              <div className='flex flex-wrap items-center gap-4 mt-6 text-green-100'>
                <span className='flex items-center gap-1 text-yellow-300 font-medium'>
                  <Star className='w-5 h-5 fill-yellow-300' />{' '}
                  {course.lessons.length.toFixed(1)}
                </span>
                <span>100 learners</span>
                <span>{course.lessons.length} lessons</span>
                <span>{course.duration}</span>
              </div>
            </div>

            {/* CTA */}
            <div className='mt-6 md:mt-0 md:ml-6 flex gap-3 items-center'>
              <button
                onClick={() => alert('Added to wishlist (placeholder)')}
                className='px-3 py-3 bg-green-600/20 text-white rounded-lg hover:bg-green-600/30 transition'
                aria-label='Add to wishlist'
              >
                ♥
              </button>

              <button
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href)
                }
                className='px-3 py-3 bg-green-600/20 text-white rounded-lg hover:bg-green-600/30 transition'
                aria-label='Share course'
                title='Copy link'
              >
                <Share2 className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <main className='space-y-8'>
          {/* About */}
          <section className='bg-white p-6 rounded-lg shadow-sm'>
            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
              About this course
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              {course.description}
            </p>
          </section>

          {/* Course content (list lessons only) */}
          <section className='bg-white p-0 rounded-lg shadow-sm overflow-hidden'>
            <div className='p-6 border-b'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Course lessons
              </h2>
            </div>
            <ul className='divide-y'>
              {course.lessons.map((lesson) => (
                <li
                  key={lesson.lessonId}
                  className='flex items-center justify-between gap-3 p-4 md:p-6 rounded-md hover:bg-green-50 transition cursor-pointer'
                  onClick={() =>
                    navigate(`/learn/courses/${course.courseId}/lessons`, {
                      state: {
                        courseId: course.courseId,
                        lessonId: lesson.lessonId,
                      },
                    })
                  }
                >
                  <div className='flex items-center gap-3'>
                    <span className='p-2 bg-green-100 rounded-md'>
                      <PlayCircle className='w-5 h-5 text-green-600' />
                    </span>
                    <div>
                      <div className='font-medium text-gray-800'>
                        {lesson.title}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {lesson.duration}
                      </div>
                    </div>
                  </div>
                  <div className='text-sm text-gray-500'>view</div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CourseOverviewPage;
