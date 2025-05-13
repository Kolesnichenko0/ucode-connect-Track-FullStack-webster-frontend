import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Добавляем фавиконку */}
        <link rel="icon" href="/logo.png" />
        
        {/* Предзагрузка темы перед рендерингом страницы, чтобы избежать мигания */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                
                const savedTheme = localStorage.getItem('theme');
                
                
                const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                
                if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode) || 
                    (savedTheme === 'system' && prefersDarkMode)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

