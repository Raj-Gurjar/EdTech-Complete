export default function avgRating(ratingArr) {
  // Handle null, undefined, or empty arrays
  if (!ratingArr || !Array.isArray(ratingArr) || ratingArr.length === 0) {
    return 0;
  }

  // Filter out invalid entries and extract valid ratings
  const validRatings = ratingArr
    .filter((item) => {
      // Handle both object format {rating: X} and direct number
      if (typeof item === 'number') return !isNaN(item) && item > 0;
      if (typeof item === 'object' && item !== null) {
        const rating = item.rating;
        return rating !== undefined && rating !== null && !isNaN(rating) && rating > 0;
      }
      return false;
    })
    .map((item) => {
      // Extract rating value
      return typeof item === 'number' ? item : (item.rating || 0);
    });

  if (validRatings.length === 0) {
    return 0;
  }

  const totalReviewCount = validRatings.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  const multiplier = Math.pow(10, 1);
  const avgReviewCount =
    Math.round((totalReviewCount / validRatings.length) * multiplier) /
    multiplier;
  
  return isNaN(avgReviewCount) ? 0 : avgReviewCount;
}
