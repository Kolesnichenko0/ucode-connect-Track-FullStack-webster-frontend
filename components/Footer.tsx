import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          {/* Logo and Description */}
          <div className="mb-6 md:mb-0 md:max-w-xs">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white dark:text-black text-lg font-bold">G</span>
              </div>
              <h2 className="ml-2 text-lg font-bold text-gray-900 dark:text-white">GraphiCraft</h2>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pr-4">
              Design without limits. Create beautiful graphics for any project.
            </p>
            <div className="mt-4 flex-column">
              <div className="flex space-x-4 items-center">
                <a href="https://github.com/Kolesnichenko0/ucode-connect-Track-FullStack-webster-frontend" aria-label="GitHub Frontend" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.96.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.55-3.87-1.55-.53-1.35-1.3-1.7-1.3-1.7-1.07-.72.08-.71.08-.71 1.18.08 1.8 1.2 1.8 1.2 1.05 1.8 2.76 1.3 3.44.99.1-.77.41-1.3.75-1.6-2.55-.3-5.23-1.27-5.23-5.63 0-1.25.44-2.27 1.17-3.08-.12-.29-.51-1.46.1-3.04 0 0 .96-.31 3.14 1.18a10.89 10.89 0 015.72 0c2.18-1.49 3.14-1.18 3.14-1.18.61 1.58.22 2.75.11 3.04.73.81 1.16 1.83 1.16 3.08 0 4.37-2.69 5.32-5.25 5.61.42.36.8 1.08.8 2.18v3.24c0 .31.21.66.8.55A10.5 10.5 0 0023.5 12C23.5 5.74 18.26.5 12 .5z" />
                  </svg>
                </a>
                <label className="text-xs">frontend</label>
              </div>
              <div className="flex space-x-4 items-center mt-2">
                <a href="https://github.com/Kolesnichenko0/ucode-connect-Track-FullStack-webster-backend" aria-label="GitHub Backend" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.96.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.55-3.87-1.55-.53-1.35-1.3-1.7-1.3-1.7-1.07-.72.08-.71.08-.71 1.18.08 1.8 1.2 1.8 1.2 1.05 1.8 2.76 1.3 3.44.99.1-.77.41-1.3.75-1.6-2.55-.3-5.23-1.27-5.23-5.63 0-1.25.44-2.27 1.17-3.08-.12-.29-.51-1.46.1-3.04 0 0 .96-.31 3.14 1.18a10.89 10.89 0 015.72 0c2.18-1.49 3.14-1.18 3.14-1.18.61 1.58.22 2.75.11 3.04.73.81 1.16 1.83 1.16 3.08 0 4.37-2.69 5.32-5.25 5.61.42.36.8 1.08.8 2.18v3.24c0 .31.21.66.8.55A10.5 10.5 0 0023.5 12C23.5 5.74 18.26.5 12 .5z" />
                  </svg>
                </a>
                <label className="text-xs">backend</label>
              </div> 
              <div className="flex space-x-4 items-center mt-2">
                <a href="mailto:myprojects.kde.dev@gmail.com" aria-label="Email" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1.5 4.5h21v15h-21v-15zm19.5 1.5l-9 7.5-9-7.5v12h18v-12z" />
                    <path d="M1.5 4.5l10.5 8 10.5-8" />
                  </svg>
                </a>
                <label className="text-xs">myprojects.kde.dev@gmail.com</label>
              </div>
            </div>
          </div>
          
          {/* Links grid */}
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            {/* Product Links */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                PRODUCT
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/#tools" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                LEGAL
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} GraphiCraft. All rights reserved.
          </p>
          
          <div className="mt-2 sm:mt-0">
            <div className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
              Made with
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-1 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              in Simple Design
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}