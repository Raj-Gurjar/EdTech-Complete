import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface SocialMedia {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

export default function Footer() {
  const [email, setEmail] = useState<string>("");

  const socialMedia: SocialMedia[] = [
    {
      name: "YouTube",
      url: "https://youtube.com",
      icon: <FaYoutube />,
      color: "hover:text-red-500",
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: <FaInstagram />,
      color: "hover:text-pink-500",
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: <FaTwitter />,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: <FaLinkedin />,
      color: "hover:text-blue-600",
    },
    {
      name: "Facebook",
      url: "https://facebook.com",
      icon: <FaFacebook />,
      color: "hover:text-blue-500",
    },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/allCourses" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const resources = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/support" },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (email) {
      // TODO: Implement newsletter subscription
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  return (
    <footer className="bg-black2 border-t border-black5 mt-16 sm:mt-20">
      <div className="w-11/12 max-w-7xl mx-auto py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                <span className="text-yellow8">Ed</span>Tech
              </h2>
              <p className="text-white4 text-sm sm:text-base leading-relaxed">
                Empowering learners worldwide with quality online education. 
                Learn, grow, and achieve your goals with our comprehensive courses.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-white4 text-sm font-medium">Follow us:</span>
              <div className="flex items-center gap-3">
                {socialMedia.map((media) => (
                  <a
                    key={media.name}
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white6 ${media.color} transition-all duration-300 text-xl hover:scale-110`}
                    aria-label={media.name}
                  >
                    {media.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white4 hover:text-yellow8 transition-colors duration-200 text-sm sm:text-base flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-yellow8 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    to={resource.path}
                    className="text-white4 hover:text-yellow8 transition-colors duration-200 text-sm sm:text-base flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-yellow8 transition-all duration-200"></span>
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">
              Contact Us
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-white4 text-sm sm:text-base">
                <FaMapMarkerAlt className="text-yellow8 mt-1 flex-shrink-0" />
                <span>123 Education Street, Learning City, LC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-white4 text-sm sm:text-base">
                <FaEnvelope className="text-yellow8 flex-shrink-0" />
                <a
                  href="mailto:info@edtech.com"
                  className="hover:text-yellow8 transition-colors duration-200"
                >
                  info@edtech.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-white4 text-sm sm:text-base">
                <FaPhone className="text-yellow8 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-yellow8 transition-colors duration-200"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="text-base font-semibold text-white mb-3">
                Newsletter
              </h4>
              <p className="text-white4 text-xs sm:text-sm mb-4">
                Subscribe to get updates on new courses and offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-black3 border border-black5 rounded-lg px-4 py-2.5 text-white placeholder:text-white6 focus:outline-none focus:border-yellow8 transition-colors text-sm sm:text-base"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow8 hover:bg-yellow9 text-black font-semibold rounded-lg px-4 py-2.5 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black5 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white6 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} EdTech. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-white6 text-xs sm:text-sm">
              <Link
                to="/privacy"
                className="hover:text-yellow8 transition-colors duration-200"
              >
                Privacy
              </Link>
              <span>•</span>
              <Link
                to="/terms"
                className="hover:text-yellow8 transition-colors duration-200"
              >
                Terms
              </Link>
              <span>•</span>
              <Link
                to="/cookies"
                className="hover:text-yellow8 transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
