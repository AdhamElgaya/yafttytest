import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/views/Map'), { ssr: false });

export const metadata = {
  title: 'Map',
  description: 'Explore approved outdoor advertising banners on the Yaftty map.',
};

export default function MapPage() {
  return <Map />;
}
