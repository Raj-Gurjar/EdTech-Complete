
import RatingStars from "../../utils/RatingStars";
import { formateDate } from "../../utils/formatDate";

interface ReviewUser {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

interface ReviewData {
  user?: ReviewUser;
  rating?: number;
  review?: string;
  createdAt?: string;
}

interface ReviewCardProps {
  data: ReviewData | null;
}

export default function ReviewCard({ data }: ReviewCardProps) {
  if (!data) return null;

  const user = data?.user || {};
  const userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Anonymous";
  const userImage = user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
  
  return (
    <div className="bg-black1 border border-black5 rounded-lg p-4 sm:p-6 hover:border-yellow8/30 transition-colors">
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <img
            src={userImage}
            alt={userName}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-black5"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
            }}
          />
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          {/* User Info & Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <h4 className="font-semibold text-white text-sm sm:text-base">
                {userName}
              </h4>
              {data?.createdAt && (
                <p className="text-xs sm:text-sm text-black7">
                  {formateDate(data.createdAt)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <RatingStars Review_Count={data?.rating || 0} Star_Size={16} />
              <span className="text-sm font-semibold text-white ml-1">
                {data?.rating?.toFixed(1) || "0.0"}
              </span>
            </div>
          </div>

          {/* Review Text */}
          {data?.review && (
            <p className="text-sm sm:text-base text-black8 leading-relaxed whitespace-pre-wrap">
              {data.review}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

