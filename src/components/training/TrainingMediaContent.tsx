import { useState } from "react";
import { Play, Image, AlertCircle } from "lucide-react";

interface TrainingMediaContentProps {
  imageUrl?: string;
  videoUrl?: string;
  altText?: string;
}

const TrainingMediaContent = ({ imageUrl, videoUrl, altText = "Training visual" }: TrainingMediaContentProps) => {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  if (!imageUrl && !videoUrl) {
    return null;
  }

  return (
    <div className="my-4 space-y-4">
      {/* Image Display */}
      {imageUrl && !imageError && (
        <div className="rounded-lg overflow-hidden border border-cyber-green/20 bg-black/30">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-auto max-h-80 object-contain"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {imageUrl && imageError && (
        <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <Image className="w-5 h-5 text-gray-500" />
          <span className="text-gray-400 text-sm font-mono">Unable to load image</span>
        </div>
      )}

      {/* Video Display */}
      {videoUrl && !videoError && (
        <div className="rounded-lg overflow-hidden border border-cyber-green/20 bg-black/30">
          <video
            controls
            className="w-full max-h-96"
            onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {videoUrl && videoError && (
        <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <Play className="w-5 h-5 text-gray-500" />
          <span className="text-gray-400 text-sm font-mono">Unable to load video</span>
        </div>
      )}
    </div>
  );
};

export default TrainingMediaContent;
