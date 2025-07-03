'use client';

import Image from 'next/image';

interface HeroBannerProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  height?: 'sm' | 'md' | 'lg';
  maxContentWidth?: string;
  boxed?: boolean; // new prop
}

export default function HeroBanner({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  height = 'md',
  maxContentWidth = 'max-w-2xl',
  boxed = false // default to false for full-bleed
}: HeroBannerProps) {
  const heightClass = {
    sm: 'h-[20vh]',
    md: 'h-[25vh]',
    lg: 'h-[30vh]'
  };

  if (boxed) {
    return (
      <section className="hero-banner w-full flex justify-center items-center bg-transparent mt-[118px] md:mt-[155px] z-20">
        <div className="relative w-full h-[30vh] md:h-[60vh] max-w-6xl xl:max-w-7xl mx-auto overflow-hidden rounded-2xl shadow-lg animate-zoomIn">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center w-full h-full animate-fadeIn"
            style={{ objectPosition: 'center 30%', objectFit: 'cover' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-center ${maxContentWidth} px-4`}>
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{title}</h1>
              {subtitle && <p className="text-base md:text-2xl text-white drop-shadow-lg">{subtitle}</p>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`hero-banner relative w-screen max-w-none left-1/2 right-1/2 -translate-x-1/2 ${heightClass[height]} md:h-[45vh] bg-secondary overflow-hidden z-20`}
      style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', width: '100vw', marginTop: 0 }}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="relative w-full h-full animate-zoomIn">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center w-full h-full mobile-hero-image animate-fadeIn"
            style={{ objectPosition: 'center 30%', objectFit: 'cover' }}
          />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-center ${maxContentWidth} px-4`}>
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{title}</h1>
          {subtitle && <p className="text-base md:text-2xl text-white drop-shadow-lg">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}