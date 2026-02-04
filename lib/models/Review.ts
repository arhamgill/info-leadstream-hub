import mongoose, { Schema, model, models } from "mongoose";

export interface IReview {
  url: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    url: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
