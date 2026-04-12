import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <nav aria-label="breadcrumb" dir="rtl">
    <ol className="flex items-center gap-1 flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <li className={isLast ? 'min-w-0' : undefined}>
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="min-h-[44px] inline-flex items-center gap-1 text-sm text-choco/55 hover:text-choco active:text-choco focus-visible:text-choco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-choco/30 focus-visible:rounded transition-colors px-1"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span className="min-h-[44px] inline-flex items-center text-sm text-choco font-medium px-1 truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </li>
            {!isLast && (
              <li aria-hidden="true" className="text-choco/25 text-sm select-none shrink-0">/</li>
            )}
          </React.Fragment>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumb;
