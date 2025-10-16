import React, { useEffect } from 'react';
import ShareMenu from 'react-native-share-menu';
import { useShare } from '../context/ShareContext';
import { View } from 'react-native'; // ✅ Import View

const ShareHandler = () => {
  const { updateSharedData } = useShare();

  useEffect(() => {
    const handleShare = (item) => {
      if (!item) {
        return;
      }

      let sharedData = null;
      let mimeType = null;

      // Handle different share types
      if (item.data) {
        // Standard share (text, URL)
        sharedData = item.data;
        mimeType = item.mimeType;
      } else if (item.images && item.images.length > 0) {
        // Image share
        sharedData = item.images[0];
        mimeType = 'image/*';
      } else if (item.urls && item.urls.length > 0) {
        // URL share
        sharedData = item.urls[0];
        mimeType = 'text/plain';
      }

      if (sharedData) {
        updateSharedData({ mimeType, data: sharedData });
      }
    };

    // Get initial share if app was launched from share menu
    ShareMenu.getInitialShare(handleShare);
    
    // Listen for new shares
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, [updateSharedData]);

  return null;
};

export default ShareHandler;