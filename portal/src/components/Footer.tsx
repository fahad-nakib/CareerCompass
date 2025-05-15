import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-bold text-studyportal-blue mb-4">About StudyPortals</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-studyportal-blue">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-studyportal-blue">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-studyportal-blue">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-600 hover:text-studyportal-blue">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-studyportal-blue mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/universities" className="text-gray-600 hover:text-studyportal-blue">
                  For Universities
                </Link>
              </li>
              <li>
                <Link to="/students" className="text-gray-600 hover:text-studyportal-blue">
                  For Students
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-600 hover:text-studyportal-blue">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/marketing" className="text-gray-600 hover:text-studyportal-blue">
                  Marketing Solutions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-studyportal-blue mb-4">Study Levels</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bachelors" className="text-gray-600 hover:text-studyportal-blue">
                  Bachelors
                </Link>
              </li>
              <li>
                <Link to="/masters" className="text-gray-600 hover:text-studyportal-blue">
                  Masters
                </Link>
              </li>
              <li>
                <Link to="/phd" className="text-gray-600 hover:text-studyportal-blue">
                  PhD
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-600 hover:text-studyportal-blue">
                  Short Courses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-studyportal-blue mb-4">Connect with Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-studyportal-blue hover:text-studyportal-orange"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-studyportal-blue hover:text-studyportal-orange"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-studyportal-blue hover:text-studyportal-orange"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-studyportal-blue hover:text-studyportal-orange"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-studyportal-blue hover:text-studyportal-orange"
              >
                <Youtube size={24} />
              </a>
            </div>
            <p className="text-gray-600">
              Subscribe to our newsletter to stay updated with the latest study opportunities.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">© 2023 StudyPortals B.V. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-600 hover:text-studyportal-blue">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-gray-600 hover:text-studyportal-blue">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-gray-600 hover:text-studyportal-blue">
                Cookie Statement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
