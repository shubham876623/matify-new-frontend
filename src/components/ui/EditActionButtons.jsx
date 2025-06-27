import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { uploadToGallery } from "../../features/Gallery/uploadToGallery";
import { deleteFromGallery } from "../../features/Gallery/deleteFromGallery";
import { toast } from "react-toastify";
import {deleteFromGenrared} from '../../features/GenratedImages/deletefromgenratedimages';
import Button from "../../features/edit/Color-correction/ui/Button"; // Adjust path if needed

const EditActionButtons = ({ outputImageUrl, imageId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase().replace(/\/$/, "");
  const [clickedButton, setClickedButton] = useState("");
    console.log(outputImageUrl)
  const handleAddToGallery = async () => {
    if (!outputImageUrl) {
      toast.error("No image to upload.");
      return;
    }

    try {
      const uploadedUrl = await uploadToGallery(outputImageUrl);
      toast.success("Image added to gallery!");
      console.log("Uploaded URL:", uploadedUrl);
    } catch (err) {
      toast.error("❌ Failed to upload image to gallery.");
    }
  };

  const handleDeleteFromGallery = async () => {
    if (!imageId) {
      toast.error("❌ No image to delete.");
      return;
    }

    try {
      const success = await deleteFromGallery(imageId);
      if (success) {
        toast.success("🗑️ Image deleted from gallery.");
        window.location.reload();
      }
    } catch (err) {
      toast.error("❌ Failed to delete image from gallery.");
    }
  };
const handleDeleteFromGenrated = async () => {
    if (!imageId) {
      toast.error("❌ No image to delete.");
      return;
    }

    try {
      const success = await deleteFromGenrared(imageId);
      if (success) {
        toast.success("🗑️ Image deleted from gallery.");
        window.location.reload();
      }
    } catch (err) {
      toast.error("❌ Failed to delete image from gallery.");
    }
  };
  const goToEditor = (path, label) => {
    if (!outputImageUrl) {
      toast.error("No image to edit");
      return;
    }

    setClickedButton(label);
    setTimeout(() => {
      navigate(path, {
        state: {
          inputImage: outputImageUrl,
        },
      });
    }, 100);
  };

  const toolButtons = [
    {
      label: "Obj Removal",
      path: "/edit/object-removal",
      icon: "/color-correction/img_label_1.png",
    },
    {
      label: "Add Accessories",
      path: "/edit/add-accessories",
      icon: "/color-correction/img_label_2.png",
    },
    {
      label: "Outfit Swap",
      path: "/edit/outfit-swap",
      icon: "/color-correction/img_label_3.png",
    },
    {
      label: "BG Swap",
      path: "/edit/background-replace",
      icon: "/color-correction/img_label_4.png",
    },
    {
      label: "Color Correction",
      path: "/edit/color-correction",
      icon: "/color-correction/img_label_6.png",
    },
    {
      label: "Upscale",
      path: "/edit/upscale",
      icon: "/color-correction/img_label_5.png",
    },
  ];

  return (
    <div className="bg-[#f0f0f0] rounded-2xl p-2.5">
      {/* Editing Tools Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
        {toolButtons.slice(0, 3).map(({ label, path, icon }, index) => (
          currentPath !== path && (
            <Button
              key={index}
              variant="secondary"
              size="medium"
              icon={icon}
              onClick={() => goToEditor(path, label)}
            >
              {label}
            </Button>
          )
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        {toolButtons.slice(3).map(({ label, path, icon }, index) => (
          currentPath !== path && (
            <Button
              key={index}
              variant="secondary"
              size="medium"
              icon={icon}
              onClick={() => goToEditor(path, label)}
            >
              {label}
            </Button>
          )
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          variant="secondary"
          size="medium"
          icon="/color-correction/img_label_7.png"
          onClick={handleAddToGallery}
        >
          Add to Gallery
        </Button>
       <Button
  variant="secondary"
  size="medium"
  icon="/color-correction/img_.png"
  onClick={() => {
    if (currentPath.includes("gallery")) {
      handleDeleteFromGallery();
    } else {
      handleDeleteFromGenrated();
    }
  }}
>
  Delete Image
</Button>

      </div>
    </div>
  );
};

export default EditActionButtons;
