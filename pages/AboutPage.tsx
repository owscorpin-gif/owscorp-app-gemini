import React from 'react';

// Icons for the "Why Choose Us?" section
const QualityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const MarketplaceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" /></svg>;
const DeveloperIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;


interface AboutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: <QualityIcon />,
      title: 'Quality & Trust',
      description: "Every developer is vetted, and every product is reviewed. Purchase with confidence knowing you're getting top-tier, reliable solutions.",
    },
    {
      icon: <AIIcon />,
      title: 'AI-Powered Guidance',
      description: "Our intelligent AI consultant is available 24/7 to help you navigate our vast catalog, answer your questions, and find the perfect tool for your needs.",
    },
    {
      icon: <MarketplaceIcon />,
      title: 'Cross-Platform Marketplace',
      description: "From web and mobile apps to desktop software and agentic AI, find solutions for every platform in one centralized hub.",
    },
    {
      icon: <DeveloperIcon />,
      title: 'Developer Focused',
      description: "We provide developers with the tools they need to succeed: seamless uploads, powerful analytics, and direct access to a global market.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-secondary py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-gray-900">
            Empowering Digital Innovation
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
            OWSCORP is the premier AI-powered marketplace where brilliant developers meet visionary businesses.
          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To democratize access to high-quality digital solutions, making it simple for businesses to find and deploy cutting-edge software and for developers to monetize their creations. We believe in fostering a community built on trust, quality, and innovation.
              </p>
            </div>
            <div className="hidden md:block">
              <img src="https://picsum.photos/seed/owscorp-mission/600/400" alt="Our Mission" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900">Why Choose OWSCORP?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section Placeholder */}
       <section className="py-20 text-center">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">The Minds Behind the Marketplace</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              OWSCORP is powered by a dedicated team of engineers, designers, and strategists passionate about technology and entrepreneurship. (Full team bios coming soon!)
            </p>
         </div>
       </section>

      {/* CTA Section */}
      <section className="bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Get Started?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Whether you're looking to enhance your business with a new tool or sell your latest creation, your journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button onClick={() => onNavigate('home')} className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors shadow-lg">
                Explore Services
              </button>
              <button onClick={() => onNavigate('auth', { initialForm: 'signup' })} className="inline-block bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-600 transition-colors shadow-lg">
                Become a Seller
              </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;