import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-muted p-6 md:py-12 w-full">
    <div className="container max-w-7xl mt-8 text-center text-xs text-muted-foreground">
      &copy; 2024 CarNation. All rights reserved.
    </div>
  </footer>
  );
};

export default Footer;