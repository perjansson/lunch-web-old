import React, { useState } from "react"
import Dialog from "@reach/dialog"
import VisuallyHidden from "@reach/visually-hidden"
import dialogStyles from "@reach/dialog/styles.css"

import { saveRating } from "~/utils/supabase"
import type { RatingValue, Recommendation } from "~/types"
import { maxRatingValue } from "~/types"
import styles from "~/styles/add-rating.css"
import { ratingTexts } from "~/utils/ratings"

export function links() {
  return [
    { rel: "stylesheet", href: dialogStyles },
    { rel: "stylesheet", href: styles },
  ]
}

export const AddRating: React.FC<{
  recommendation: Recommendation
  triggerText: string
  triggerIcon?: React.ReactNode
  onRatingSaved: () => void
}> = ({ recommendation, triggerText, triggerIcon, onRatingSaved }) => {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const [starHovered, setStarHovered] = useState<RatingValue | undefined>(
    undefined
  )
  const [rating, setRating] = useState<RatingValue | undefined>(undefined)
  const [saved, setSaved] = useState(false)

  const handleOnSave = async () => {
    if (!rating) {
      return
    }

    await saveRating(recommendation, rating)
    onRatingSaved()
    setSaved(true)
    close()
  }

  const handleCancel = () => {
    setStarHovered(undefined)
    setRating(undefined)
    close()
  }

  return (
    <div>
      {!saved ? (
        <button className="trigger" onClick={open}>
          {triggerIcon}
          {triggerText}
        </button>
      ) : (
        <div>Thanks!</div>
      )}

      <Dialog
        isOpen={showDialog}
        onDismiss={close}
        className="dialog"
        aria-label="Add rating"
      >
        <div className="dialog-header">
          <h2>
            Add rating for the visit on {recommendation.when} to{" "}
            {recommendation.Restaurant!.name}
          </h2>
          <button className="close-button" onClick={close}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </button>
        </div>
        <div className="dialog-body">
          <div className="rating-stars">
            {[...Array(maxRatingValue)].map((_, i) => {
              const ratingValue = (i + 1) as RatingValue

              return (
                <img
                  key={i}
                  src={
                    (rating && rating > i) || (starHovered && starHovered > i)
                      ? "/icons/star-gold.png"
                      : "/icons/star.png"
                  }
                  width={60}
                  height={60}
                  alt={`Star ${i + 1}`}
                  onMouseOver={() => setStarHovered(ratingValue)}
                  onMouseOut={() => setStarHovered(undefined)}
                  onClick={() => setRating(ratingValue)}
                />
              )
            })}
          </div>
          <div className="rating-text">
            {starHovered || rating
              ? ratingTexts[starHovered! || rating!]
              : "Select stars to rate"}
          </div>
        </div>
        <div className="dialog-footer">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleOnSave} disabled={!rating}>
            Save
          </button>
        </div>
      </Dialog>
    </div>
  )
}
