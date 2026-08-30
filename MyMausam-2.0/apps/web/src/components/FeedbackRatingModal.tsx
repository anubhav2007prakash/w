"use client";

import React, { useEffect, useState } from "react";
import { Star, X } from "lucide-react";

const STORAGE_KEY = "mausam_app_feedback";

export interface AppFeedback {
  rating: number;
  comment: string;
  submittedAt: string;
}

function loadSavedFeedback(): AppFeedback | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppFeedback;
  } catch {
    return null;
  }
}

export function saveAppFeedback(feedback: AppFeedback): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
}

interface FeedbackRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (feedback: AppFeedback) => void;
}

export const FeedbackRatingModal: React.FC<FeedbackRatingModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const saved = loadSavedFeedback();
    if (saved) {
      setRating(saved.rating);
      setComment(saved.comment);
      setAlreadySubmitted(true);
    } else {
      setRating(0);
      setComment("");
      setAlreadySubmitted(false);
    }
    setHoverRating(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const displayStars = hoverRating || rating;
  const canSubmit = rating >= 1;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const feedback: AppFeedback = {
      rating,
      comment: comment.trim(),
      submittedAt: new Date().toISOString(),
    };
    saveAppFeedback(feedback);
    onSubmitted?.(feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="bg-white text-gray-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-scale-up"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 id="feedback-title" className="text-lg font-bold text-[#0055A6]">
              Rate IMD Mausam 2.0
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              How would you rate your weather forecast experience?
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close feedback"
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 my-4" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = star <= displayStars;
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} star${star === 1 ? "" : "s"}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-yellow-400 hover:scale-110 transition active:scale-95"
              >
                <Star className={`w-8 h-8 ${filled ? "fill-yellow-400" : "text-gray-300"}`} />
              </button>
            );
          })}
        </div>

        <label htmlFor="feedback-comment" className="block text-xs font-semibold text-gray-700 mb-1.5">
          Comments {alreadySubmitted ? "(update your notes)" : "(optional)"}
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="What worked well? What should we improve?"
          className="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#0055A6] focus:ring-2 focus:ring-[#0055A6]/20 resize-none"
        />
        <p className="text-[10px] text-gray-400 text-right mt-1">{comment.length}/500</p>

        <div className="flex gap-2 justify-end mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="px-4 py-1.5 text-xs bg-[#0055A6] text-white font-medium rounded-lg hover:bg-[#004586] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {alreadySubmitted ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
