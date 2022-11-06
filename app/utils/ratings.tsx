import type { RatingValue, Recommendation, Restaurant } from "~/types"

export const ratingTexts: { [key in RatingValue]: string } = {
  5: "Top notch, would go here every day of the week",
  4: "Great, will come back for sure",
  3: "Good, may or may not come back again",
  2: "Not impressed, could maybe consider coming here again if Sauli pays",
  1: "Really bad, wild horses can't drag me here ever again",
}

export function calculateRatingForRecommendation(
  recommendation: Recommendation
) {
  const numberOfRatings = recommendation.Rating?.length ?? 0
  const hasAnyRatings = numberOfRatings > 0

  const ratingForSpecificRecommendation = recommendation.Rating
    ? recommendation.Rating.reduce<number | undefined>(
        (totalRatingForRecommendation, { rating }) =>
          rating + (totalRatingForRecommendation ?? 0),
        undefined
      )
    : undefined

  const averageRating = hasAnyRatings
    ? ratingForSpecificRecommendation! / numberOfRatings
    : undefined
  const roundedAverageRating =
    averageRating && Math.round(averageRating * 10) / 10

  return {
    numberOfRatings,
    totalRating: ratingForSpecificRecommendation,
    averageRating: roundedAverageRating,
    ...ratingToText(roundedAverageRating),
  }
}

export function calculateTotalRating(restaurant: Restaurant) {
  const numberOfRatings = restaurant.Recommendation
    ? restaurant.Recommendation.reduce<number>(
        (totalNumberOfRatings, { Rating }) =>
          totalNumberOfRatings + (Rating ? Rating?.length : 0),
        0
      )
    : 0

  const hasAnyRatings = numberOfRatings > 0

  const totalRating = hasAnyRatings
    ? restaurant.Recommendation?.reduce<number | undefined>(
        (ratingForAllRecommendations, { Rating }) => {
          if (!Rating) {
            return undefined
          }

          const ratingForSpecificRecommendation = Rating.reduce<
            number | undefined
          >(
            (totalRatingForRecommendation, { rating }) =>
              rating + (totalRatingForRecommendation ?? 0),
            undefined
          )

          return ratingForSpecificRecommendation
            ? ratingForSpecificRecommendation +
                (ratingForAllRecommendations ?? 0)
            : undefined
        },
        undefined
      )
    : undefined

  const averageRating = hasAnyRatings
    ? totalRating! / numberOfRatings
    : undefined

  return {
    numberOfRatings,
    totalRating,
    averageRating,
    ...ratingToText(averageRating),
  }
}

function ratingToText(rating: number | undefined) {
  if (!rating) {
    return {
      text: "Not yet any ratings",
      starsComponent: null,
    }
  }

  if (rating >= 4.75) {
    return {
      text: ratingTexts[5],
      starsComponent: (
        <div style={{ display: "flex", gap: "8px" }}>
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
        </div>
      ),
    }
  }

  if (rating >= 4.5) {
    return {
      text: ratingTexts[5],
      starsComponent: (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img
            src="/icons/star-half-gold.png"
            width={30}
            height={30}
            alt="Star"
          />
        </div>
      ),
    }
  }

  if (rating >= 4) {
    return {
      text: ratingTexts[4],
      starsComponent: (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
        </div>
      ),
    }
  }

  if (rating >= 3.5) {
    return {
      text: ratingTexts[3],
      starsComponent: (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img
            src="/icons/star-half-gold.png"
            width={30}
            height={30}
            alt="Star"
          />
        </div>
      ),
    }
  }

  if (rating >= 3) {
    return {
      text: ratingTexts[3],
      starsComponent: (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
        </div>
      ),
    }
  }

  if (rating >= 2.5) {
    return {
      text: ratingTexts[2],
      starsComponent: (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img
            src="/icons/star-half-gold.png"
            width={30}
            height={30}
            alt="Star"
          />
        </div>
      ),
    }
  }

  if (rating >= 2) {
    return {
      text: ratingTexts[2],
      starsComponent: (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
        </div>
      ),
    }
  }

  if (rating >= 1.5) {
    return {
      text: ratingTexts[1],
      starsComponent: (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
          <img
            src="/icons/star-half-gold.png"
            width={30}
            height={30}
            alt="Star"
          />
        </div>
      ),
    }
  }

  if (rating >= 1) {
    return {
      text: ratingTexts[1],
      starsComponent: (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <img src="/icons/star-gold.png" width={30} height={30} alt="Star" />
        </div>
      ),
    }
  }

  return {
    text: ratingTexts[1],
    starsComponent: <></>,
  }
}
