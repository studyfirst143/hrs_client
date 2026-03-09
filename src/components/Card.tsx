// components/Card.tsx
import React from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  image?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, image, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover"
        />
      )}

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}

        <div className="mt-4 text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
