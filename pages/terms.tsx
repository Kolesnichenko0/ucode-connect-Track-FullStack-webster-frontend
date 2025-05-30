import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      
      <header className="bg-black dark:bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-black">Terms of Service</h1>
              <p className="mt-4 text-gray-400 dark:text-gray-600 text-lg max-w-3xl">
                Please read these terms of service carefully before using our platform. 
                These terms govern your access to and use of our services.
              </p>
            </motion.div>
          </div>
        </div>
        
        <div className="relative h-16">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 text-white dark:text-gray-900 fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0Z"></path>
          </svg>
        </div>
      </header>

      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-emerald-900/5 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="prose dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:mt-8 prose-headings:mb-4">
              
              <div className="flex items-center mb-8 text-sm text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Last Updated: April 13, 2025
              </div>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
                If you do not agree with any of these terms, you are prohibited from using or accessing our services.
              </p>
              <p>
                We may modify these Terms at any time, and such modifications shall be effective immediately upon posting on our website. 
                Your continued use of our services constitutes your acknowledgment and acceptance of the modified terms.
              </p>

              <h2>2. User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access our services and for any activities or actions under your password. 
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>

              <h2>3. User Conduct</h2>
              <p>
                You agree not to use our services:
              </p>
              <ul>
                <li>In any way that violates any applicable local, state, national, or international law or regulation</li>
                <li>To impersonate or attempt to impersonate our company, an employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of our services</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To interfere with or circumvent the security features of our services</li>
              </ul>

              <h2>4. Intellectual Property</h2>
              <p>
                Our services and their original content, features, and functionality are and will remain the exclusive property of our company and its licensors. 
                Our services are protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of our company.
              </p>

              <h2>5. User Content</h2>
              <p>
                Our services may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. 
                By providing such content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through our services.
              </p>
              <p>
                You retain any and all of your rights to any content you submit, post or display on or through our services and you are responsible for 
                protecting those rights. You represent and warrant that the content is yours or that you have the right to use it and that the 
                posting of your content does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
              </p>

              <h2>6. Event Tickets and Purchases</h2>
              <p>
                All purchases through our services are subject to our Refund Policy. We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to:
              </p>
              <ul>
                <li>Product or service availability</li>
                <li>Errors in the description or price of the product or service</li>
                <li>Error in your order</li>
                <li>Suspected fraudulent or illegal activity</li>
              </ul>
              <p>
                We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
              </p>

              <h2>7. Refund and Cancellation Policy</h2>
              <p>
                All event ticket sales are final and non-refundable unless otherwise specified at the time of purchase. In the event of a cancellation by the organizer, 
                refunds will be processed according to the specific event's cancellation policy.
              </p>
              <p>
                For subscription services, you may cancel your subscription at any time by contacting us. Upon cancellation, your subscription will remain active until the end of the current billing period.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, in no event shall our company, its affiliates, officers, directors, employees, agents, suppliers, or licensors be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from your access to or use of or inability to access or use our services.
              </p>

              <h2>9. Disclaimer of Warranties</h2>
              <p>
                Our services are provided on an "as is" and "as available" basis. Our company and its suppliers and licensors hereby disclaim all warranties of any kind, 
                express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose and non-infringement.
              </p>
              <p>
                Neither our company nor its suppliers and licensors, makes any warranty that our services will be error free or that access thereto will be continuous or uninterrupted.
              </p>

              <h2>10. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable, 
                the remaining provisions of these Terms will remain in effect.
              </p>

              <h2>11. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use our services will immediately cease. If you wish to terminate your account, you may simply discontinue using our services or contact us.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul>
                <li>By email: legal@eventcompany.com</li>
                <li>By phone: +1 (555) 123-4567</li>
                <li>By mail: 123 Event Ave, Suite 200, San Francisco, CA 94107</li>
              </ul>
            </div>
          </div>
        </div>

        
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

export default TermsOfServicePage;

