import { Button } from '@/components/ui/button';
import type { Course } from '../types/course';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const CourseItem = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/learn/courses/${course.courseId}`);
  };

  return (
    <div className='rounded-lg overflow-hidden shadow-sm bg-white mx-4 my-4'>
      <img
        src={course.coverImage}
        alt={course.title}
        className='w-full h-48 object-cover'
      />
      <div className='p-4'>
        <Badge variant='secondary'>{course.category}</Badge>
        <div className='flex items-center mt-4'>
          <div className='flex items-center'>
            <span className='text-gray-500 text-sm mr-2'>
              {course.lessons.length} Lessons
            </span>
            <span className='text-gray-500 text-sm mr-2'>
              {course.duration}
            </span>
          </div>
        </div>
        <h2 className='text-xl font-bold mt-2'>{course.title}</h2>
        <p className='text-gray-600 text-sm mt-2'>{course.description}</p>

        <div className='flex items-center mt-2'>
          <Button
            className='w-full bg-green-600 text-white hover:bg-green-700'
            onClick={handleViewCourse}
          >
            View Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
