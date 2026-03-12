import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg mb-4">
          Helping Hands NGO is dedicated to making a positive impact in our community by connecting volunteers with those in need. Our mission is to create a platform where compassionate individuals can come together to support various causes and help improve the lives of people facing challenges.
        </p>
        <p className="text-lg mb-4">
          We believe that everyone has the power to make a difference, no matter how small. Through our volunteer network, we organize events, provide support services, and work on initiatives that address pressing social issues.
        </p>
        <p className="text-lg">
          Join us in our efforts to build a more compassionate and supportive community. Together, we can create lasting change and help those who need it most.
        </p>
      </div>
    </div>
  );
};

export default About;
