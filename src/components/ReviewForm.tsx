'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  interface FormData {
    comment: string;
  }

  interface ApiResponse {
    ok: boolean;
  }

  const onSubmit = async (data: FormData) => {
    const response: ApiResponse = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        rating,
        ...data,
      }),
    })

    if (response.ok) {
      reset()
      setRating(0)
      onReviewSubmitted()
    } else {
      console.error('Failed to submit review')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block mb-1">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              title={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star className="h-6 w-6" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block mb-1">Review</label>
        <textarea
          {...register('comment', { required: 'Comment is required' })}
          id="comment"
          rows={4}
          className="w-full border rounded px-3 py-2"
        ></textarea>
        {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit Review
      </button>
    </form>
  )
}

