import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SharePage() {
  const router = useRouter();
  const { title, description, imageUrl } = router.query;

  const safeTitle = Array.isArray(title) ? title[0] : title || '';
  const safeDescription = Array.isArray(description) ? description[0] : description || '';
  const safeImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl || '';
 
  return (
    <>
      <Head>
        <title>{safeTitle}</title>
        <meta property="og:title" content={safeTitle} />
        <meta property="og:description" content={safeDescription} />
        <meta property="og:image" content={safeImageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={safeImageUrl} />
      </Head>
      <main>
      </main>
    </>
  );
}