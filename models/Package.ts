import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPackage extends Document {
  title: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  image: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  peopleGoing: number;
  rating: number;
  location: string;
  description: string;
  tourOptions: {
    title: string;
    duration: string;
    features: { icon: string; label: string }[];
    penalty: string;
    time: string;
    adultPrice?: number;
    childPrice?: number;
    infantPrice?: number;
    pricePerPerson?: number; // Backward compatibility
    currency: string;
    inclusions?: string[];
  }[];
  features: { icon: string; title: string; description: string }[];
  highlights: string;
  includes: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema<IPackage> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a package title'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    image: {
      type: String,
      required: [true, 'Please provide a main image URL'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    discountedPrice: {
      type: Number,
    },
    duration: {
      type: String,
      required: [true, 'Please provide duration (e.g., 4 Hours)'],
    },
    peopleGoing: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    // Adding optional arrays for detailed content
    tourOptions: [{
      title: String,
      duration: String,
      features: [{ icon: String, label: String }],
      penalty: String,
      time: String,
      adultPrice: Number,
      childPrice: Number,
      infantPrice: Number,
      pricePerPerson: Number, // Backward compatibility
      currency: String,
      inclusions: [String],
    }],
    features: [{
      icon: String,
      title: String,
      description: String,
    }],
    highlights: String,
    includes: String,
    gallery: [String],
  },
  {
    timestamps: true,
  }
);

const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
