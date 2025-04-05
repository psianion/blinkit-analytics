import { LoaderCircle } from 'lucide-react';

const Loader = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <LoaderCircle
        className='animate-spin text-[#027056]/10'
        size={40}
        strokeWidth={2}
      />
    </div>
  );
};

export default Loader;
