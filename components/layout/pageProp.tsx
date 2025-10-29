'use client';

import {useTheme} from 'next-themes';
import React from 'react';
import {Toaster} from 'sonner';
import Footer from '../nav/footer';
import Header from '../nav/header';

function PageProp({children}: {children: React.ReactNode}) {
  const {theme} = useTheme();
  // console.log(theme);
  const toasterTheme =
    theme === 'light' || theme === 'dark' || theme === 'system' ? theme : undefined;

  return (
    <div>
      <Header />
      {children}
      <Toaster theme={toasterTheme} />
      <Footer />
    </div>
  );
}

export default PageProp;
