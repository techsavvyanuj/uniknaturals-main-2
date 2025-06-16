'use client';

import Image from 'next/image';

interface HeroBannerProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  height?: 'sm' | 'md' | 'lg';
  maxContentWidth?: string;
}

export default function HeroBanner({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  height = 'md',
  maxContentWidth = 'max-w-2xl'
}: HeroBannerProps) {
  const heightClass = {
    sm: 'h-[20vh]',
    md: 'h-[25vh]',
    lg: 'h-[30vh]'
  };

  return (
    <section className={`hero-banner relative ${heightClass[height]} md:h-[45vh] bg-secondary overflow-hidden w-full max-w-full mt-[118px] md:mt-[155px] z-20`}>
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="relative w-full h-full animate-zoomIn">
          <Image 
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            priority
            className="object-cover object-center max-w-full w-full h-full mobile-hero-image animate-fadeIn"
            style={{
              maxWidth: '100%',
              objectPosition: 'center 30%',
              objectFit: 'cover'
            }}
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