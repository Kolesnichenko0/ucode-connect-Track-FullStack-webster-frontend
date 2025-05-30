import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-black dark:bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-black">Privacy Policy</h1>
              <p className="mt-4 text-gray-400 dark:text-gray-600 text-lg max-w-3xl">
                We respect your privacy and are committed to protecting your personal data.
                This privacy policy explains how we collect, use, and safeguard your information.
              </p>
            </motion.div>
          </div>
        </div>
        {/* Curved divider */}
        <div className="relative h-16">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 text-white dark:text-gray-900 fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0Z"></path>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-emerald-900/5 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="prose dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:mt-8 prose-headings:mb-4">
              {/* Last Updated */}
              <div className="flex items-center mb-8 text-sm text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Last Updated: April 13, 2025
              </div>

              <h2>1. Introduction</h2>
              <p>
                Welcome to our Privacy Policy. This policy describes how we collect, use, process, and disclose your information, 
                including personal information, in conjunction with your access to and use of our services.
              </p>
              <p>
                By using our services, you consent to the collection and use of information in accordance with this policy. 
                We will not use or share your information with anyone except as described in this Privacy Policy.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                <strong>Personal Information:</strong> When you register for an account, purchase tickets, or subscribe to our newsletter, 
                we may collect personal information such as your name, email address, phone number, and billing information.
              </p>
              <p>
                <strong>Usage Data:</strong> We automatically collect information about how you interact with our services, 
                including the pages you visit, the time and date of your visit, and the time spent on each page.
              </p>
              <p>
                <strong>Device Information:</strong> We may collect information about the device you use to access our services, 
                including the hardware model, operating system, unique device identifiers, and mobile network information.
              </p>

              <h2>3. How We Use Your Information</h2>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our services</li>
                <li>Improve, personalize, and expand our services</li>
                <li>Understand and analyze how you use our services</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, including for customer service, updates, and marketing purposes</li>
                <li>Process transactions and send related information</li>
                <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity</li>
                <li>For compliance, operations, and administration purposes</li>
              </ul>

              <h2>4. Sharing Your Information</h2>
              <p>
                We may share information we collect in the following situations:
              </p>
              <ul>
                <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us.</li>
                <li><strong>For Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                <li><strong>To Comply with Laws:</strong> We may disclose your information where required to do so by law.</li>
                <li><strong>With Your Consent:</strong> We may share your information with third parties when we have your consent to do so.</li>
              </ul>

              <h2>5. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our services and hold certain information. 
                Cookies are files with a small amount of data that may include an anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, 
                you may not be able to use some portions of our services.
              </p>

              <h2>6. Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul>
                <li>The right to access personal information we hold about you</li>
                <li>The right to request correction of inaccurate personal information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to object to processing of your personal information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided in the "Contact Us" section.
              </p>

              <h2>7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to maintain the security of your personal information, 
                including but not limited to encryption, firewalls, and secure socket layer technology. However, no method of transmission over 
                the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children 
                under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
              </p>

              <h2>9. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
                and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul>
                <li>By email: privacy@eventcompany.com</li>
                <li>By phone: +1 (555) 123-4567</li>
                <li>By mail: 123 Event Ave, Suite 200, San Francisco, CA 94107</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-10 flex justify-center">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-5 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;