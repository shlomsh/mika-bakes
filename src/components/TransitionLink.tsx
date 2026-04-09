import React from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';

const TransitionLink: React.FC<LinkProps> = ({ to, onClick, children, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;
    if (!('startViewTransition' in document)) return;

    e.preventDefault();
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
      navigate(to as string);
    });
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
