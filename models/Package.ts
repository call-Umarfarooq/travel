import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPackage extends Document {
  title: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  image: string;
  price: number;
  discountedPrice?: number;
  
  duration: string;
  durationDays?: number;
  durationHours?: number;
  
  minAge?: number;
  maxAge?: number;

  peopleGoing: number;
  rating: number;
  location: string;
  description: string;
  
  tourOptions: {
    title: string;
    duration: string;
    time: string;
    
    pricingType?: 'person' | 'group';
    minPax?: number;
    maxPax?: number;
    
    adultPrice?: number;
    childPrice?: number;
    infantPrice?: number;
    groupPrice?: number;
    
    penalty: string;
    currency: string;
    features: { icon: string; label: string }[];
    inclusions?: string[];
    pricePerPerson?: number; 
  }[];

  features: { icon: string; title: string; description: string }[];
  itinerary?: { day: number; title: string; description: string }[];
  extraServices?: { name: string; price: number; type: 'person' | 'group' | 'fixed' }[];

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
    // Simple display string
    duration: {
      type: String,
      required: [true, 'Please provide duration string'],
    },
    // Structured duration
    durationDays: { type: Number, default: 0 },
    durationHours: { type: Number, default: 0 },
    
    // Age Limits
    minAge: { type: Number },
    maxAge: { type: Number },

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
    // Detailed content
    tourOptions: [{
      title: String,
      duration: String, // Keep for backward compat or specific option duration
      time: String,
      
      // Pricing
      pricingType: { type: String, enum: ['person', 'group'], default: 'person' },
      minPax: { type: Number, default: 1 },
      maxPax: Number,
      
      adultPrice: Number,
      childPrice: Number,
      infantPrice: Number,
      
      // Group Pricing
      groupPrice: Number,
      
      penalty: String,
      currency: { type: String, default: 'AED' },
      features: [{ icon: String, label: String }],
      inclusions: [String],
    }],
    
    features: [{
      icon: String,
      title: String,
      description: String,
    }],
    
    // New: Itinerary
    itinerary: [{
      day: Number,
      title: String,
      description: String,
    }],

    // New: Extra Services
    extraServices: [{
      name: String,
      price: Number,
      type: { type: String, enum: ['person', 'group', 'fixed'], default: 'person' },
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
