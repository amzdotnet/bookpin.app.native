import React, { createContext, useContext, useState } from 'react';

const ShareContext = createContext();

export const useShare = () => {
  return useContext(ShareContext);
};

export const ShareProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState(null);

  const updateSharedData = (data) => {
    setSharedData(data);
  };

  const clearSharedData = () => {
    setSharedData(null);
  };

  const value = {
    sharedData,
    updateSharedData,
    clearSharedData
  };

  return (
    <ShareContext.Provider value={value}>
      {children}
    </ShareContext.Provider>
  );
};