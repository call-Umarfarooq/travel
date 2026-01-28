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
  tags?: string[];
  
  tourOptions: {
    title: string;
    duration: string;
    description?: string;
    tourDurationType?: 'hours' | 'days'; // New field
    timeSlots?: string[]; 
    
    pricingType?: 'person' | 'group';
    minPax?: number;
    maxPax?: number;
    
    adultPrice?: number;
    adultAgeRange?: string;
    childPrice?: number;
    childAgeRange?: string;
    infantPrice?: number;
    infantAgeRange?: string;
    groupPrice?: number;
    
    penalty: string;
    currency: string;
    features: { icon: string; label: string }[];
    inclusions?: string[];
    extraServices?: { name: string; price: string }[];
    pricePerPerson?: number; 
  }[];

  features: { icon: string; title: string; description: string }[];
  itinerary?: any; // Changed to any to support string (new) or array (legacy) during migration
  extraServices?: { name: string; price: number; type: 'person' | 'group' | 'fixed' }[];

  highlights: string;
  includes: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Tour Option Schema
const TourOptionSchema = new mongoose.Schema({
  title: String,
  duration: String,
  tourDurationType: { type: String, enum: ['hours', 'days'], default: 'hours' }, // New
  isPickupIncluded: { type: Boolean, default: false }, // New
  timeSlots: [String], // User selects from available time slots
  description: String,
  
  // Pricing
  pricingType: { type: String, enum: ['person', 'group'], default: 'person' },
  minPax: { type: Number, default: 1 },
  maxPax: Number,
  
  adultPrice: Number,
  adultAgeRange: String,
  childPrice: Number,
  childAgeRange: String,
  infantPrice: Number,
  infantAgeRange: String,
  
  // Group Pricing
  groupPrice: Number,
  
  penalty: String,
  currency: { type: String, default: 'AED' },
  features: [{ icon: String, label: String }],
  inclusions: [String],
  extraServices: [{ 
    name: String, 
    price: String 
  }],
});

const PackageSchema: Schema<IPackage> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide an image'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
    },
    discountedPrice: {
      type: Number,
    },
    // Simple display string
    duration: {
      type: String, // "4 Hours" or "2 Days" (Display string)
      required: true, 
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
      default: 0,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    tags: [String],
    // Detailed content
    tourOptions: [TourOptionSchema],
    
    features: [{
      icon: String,
      title: String,
      description: String,
    }],
    
    // New: Itinerary
    itinerary: {
      type: String,
      required: false
    },

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

// Prevent Mongoose Recompilation Error in Development
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Package;
}

const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
