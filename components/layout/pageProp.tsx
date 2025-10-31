'use client';

import {useTheme} from 'next-themes';
import React from 'react';
import {motion} from 'framer-motion';
import {Toaster} from 'sonner';
import Footer from '../nav/footer';
import Header from '../nav/header';

function PageProp({children}: {children: React.ReactNode}) {
  const {theme} = useTheme();
  // console.log(theme);
  const toasterTheme =
    theme === 'light' || theme === 'dark' || theme === 'system' ? theme : undefined;

  return (
    <motion.main
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, ease: 'easeOut'}}
    >
      <Header />
      {children}
      <Toaster theme={toasterTheme} />
      <Footer />
    </motion.main>
  );
}

export default PageProp;
