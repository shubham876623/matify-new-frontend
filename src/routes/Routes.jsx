// src/routes/Routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import TrainedModels from '../features/Generate/trainedmodels';
import GenerateImage from '@/features/Generate/imagegenerate/GenrateImages';
import SignInPage from '../pages/Login';
import SignUpPage from '../pages/Signup';
import PrivateRoute from './PrivateRoute';
import Training from '@/features/Generate/training';
import Upscale from '@/features/edit/upscale/Upscale';
import BackgroundSwap from "../features/edit/BackgroundReplace/BackgroundSwap";
import ColorCorrectionPage from '@/features/edit/Color-correction/ColorCorrection';
import GeneratedImage from "../features/GenratedImages/Genratedimages";
import Gallery from "../features/Gallery/Gallery";
import OutfitSwap from "../features/edit/outfitswap/OutfitSwap";
import ObjectRemovalPage from "../features/edit/object-removal/object-removal";
import AddAccessoriesPage from "../features/edit/AddAccessories/AddAccessories";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <TrainedModels />
          </PrivateRoute>
        }
      />
       <Route
        path="/training"
        element={
          <PrivateRoute>
            <Training />
          </PrivateRoute>
        }
      />
      <Route
        path="edit/upscale"
        element={
          <PrivateRoute>
            <Upscale />
          </PrivateRoute>
        }
      />
       <Route
        path="edit/color-correction"
        element={
          <PrivateRoute>
            <ColorCorrectionPage />
          </PrivateRoute>
        }
      />
       <Route
        path="edit/background-replace"
        element={
          <PrivateRoute>
            <BackgroundSwap />
          </PrivateRoute>
        }
      />
       <Route
        path="/generate"
        element={
          <PrivateRoute>
            <GenerateImage />
          </PrivateRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <PrivateRoute>
            <Gallery />
          </PrivateRoute>
        }
      />
<Route
        path="/generated-images"
        element={
          <PrivateRoute>
            <GeneratedImage />
          </PrivateRoute>
        }
      />
      <Route
        path="edit/outfit-swap"
        element={
          <PrivateRoute>
            <OutfitSwap />
          </PrivateRoute>
        }
      />

       <Route
        path="edit/object-removal"
        element={
          <PrivateRoute>
            <ObjectRemovalPage />
          </PrivateRoute>
        }
      />
       <Route
        path="edit/add-accessories"
        element={
          <PrivateRoute>
            <AddAccessoriesPage />
          </PrivateRoute>
        }
      />
      
    </Routes>
  );
};

export default AppRoutes;
