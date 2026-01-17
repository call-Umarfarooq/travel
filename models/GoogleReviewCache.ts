
import mongoose from 'mongoose';

const GoogleReviewCacheSchema = new mongoose.Schema({
  reviews: [{
    author_name: String,
    profile_photo_url: String,
    rating: Number,
    relative_time_description: String,
    text: String,
    time: Number,
    author_url: String 
  }],
  placeId: {
    type: String,
    required: true,
    unique: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.GoogleReviewCache || mongoose.model('GoogleReviewCache', GoogleReviewCacheSchema);
