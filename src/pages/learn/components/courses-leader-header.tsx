import SparkIcon from '@/assets/spark.svg';
import SpringIcon from '@/assets/spring.svg';

export default function CoursesLeaderHeader() {
  return (
    <div className='relative flex flex-col justify-center items-center gap-6 bg-green-600 px-6 sm:px-10 py-16 sm:py-20 text-white overflow-hidden'>
      <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-[700px]'>
        Explore courses that empower your growth
      </h1>
      <p className='text-sm sm:text-base md:text-lg text-center max-w-[700px]'>
        Explore expertly curated courses in modern farming, sustainable
        practices, and agribusiness—designed to help you plant the seeds of
        growth and harvest your future.
      </p>

      {/* Decorative icons */}
      <img
        src={SpringIcon}
        alt='Spring Icon'
        className='absolute w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 -left-4 -top-4 sm:-left-6 sm:-top-6'
      />
      <img
        src={SparkIcon}
        alt='Spark Icon'
        className='absolute w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 -right-4 -bottom-4 sm:-right-6 sm:-bottom-6'
      />
    </div>
  );
}
