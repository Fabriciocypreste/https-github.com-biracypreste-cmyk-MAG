

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-gray-400 mb-6">
      <a href="/admin/dashboard" className="hover:text-white transition-colors">
        <Home className="w-4 h-4" />
      </a>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-600" />
          {item.href ? (
            <a href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};