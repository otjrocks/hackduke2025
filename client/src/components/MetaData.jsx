import React from 'react';

export default function MetaData({ image }) {
  const imageUrl = image || '/default-image.jpg'; // Fallback to default image if none is provided

  return (
    <>
      {/* Open Graph Meta Tags */}
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:image" content={imageUrl} />

    </>
  );
}
