import React from 'react';
import '../../../styles/loader.css';

interface LoaderProps {
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loader-wrapper">
        <div className="loader">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    );
  }

  return (
    <span className="loader-inline">
      <div className="loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </span>
  );
};
