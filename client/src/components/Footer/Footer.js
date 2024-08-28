import React from 'react';

export default function Footer() {
  const socialMedia = [
    { name: 'YouTube', url: 'https://youtube.com', icon: '/path-to-youtube-icon.png' },
    { name: 'Instagram', url: 'https://instagram.com', icon: '/path-to-instagram-icon.png' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '/path-to-twitter-icon.png' }
  ];

  const pages = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'All Courses', url: '/courses' },
    { name: 'Blog', url: '/blog' },
    { name: 'FAQ', url: '/faq' }
  ];

  const contactInfo = [
    '123 LMS Street, City, Country',
    'Email: support@lms.com',
    'Phone: +1 234 567 890'
  ];

  return (
    <footer className="bg-black4 text-white p-5 py-8 mt-[100px]">
      <div className="container mx-auto w-11/12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Logo & Social Media */}
        <div className="flex flex-col items-center">
          <img src="/path-to-your-logo.png" alt="Company Logo" className="mb-4 w-24 h-24" />
          <div className="flex space-x-4">
            {socialMedia.map((media) => (
              <a key={media.name} href={media.url} target="_blank" rel="noopener noreferrer">
                <img src={media.icon} alt={media.name} className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Pages</h4>
          <ul className="space-y-2">
            {pages.map((page) => (
              <li key={page.name}>
                <a href={page.url} className="hover:underline">
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2">
            {contactInfo.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </div>

        {/* Additional Column - Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
          <p className="mb-4">Subscribe to our newsletter to get the latest updates and offers.</p>
          <form>
            <input type="email" placeholder="Your email" className="p-2 rounded mb-2 w-full" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="text-center mt-8 text-sm">
        © 2024 Your Company Name. All rights reserved.
      </div>
    </footer>
  );
}
