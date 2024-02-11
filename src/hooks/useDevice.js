import { useState, useEffect } from 'react';

const getDeviceConfig = (width) => {
  const mobileMaxWidth = 767; // Max width for mobile devices
  const tabletMaxWidth = 1024; // Max width for tablet devices

  const isMobile = width <= mobileMaxWidth;
  const isTablet = width > mobileMaxWidth && width <= tabletMaxWidth;
  const isDesktop = width > tabletMaxWidth;

  return { isMobile, isTablet, isDesktop };
};

export const useDevice = () => {
  const [device, setDevice] = useState(getDeviceConfig(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceConfig(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
};

export default useDevice;