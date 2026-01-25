import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Should be true if auth is enforced
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  optionTitle: String,
  
  guestDetails: {
    adults: { type: Number, default: 0 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
    guests: { type: Number, default: 0 }, // Added for group bookings
    totalGuests: { type: Number } 
  },
  
  extraServices: [{
      name: String,
      price: Number,
      quantity: Number,
      total: Number
  }],
  
  pricing: {
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'AED' }
  },

  contactInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    countryCode: String,
    pickupLocation: String,
    specialRequests: String
  },

  paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
  },
  paymentIntentId: String,
  paymentMethod: {
      type: String,
      enum: ['stripe', 'cash', 'pay_later'], // 'cash' and 'pay_later' can be treated similarly
      default: 'stripe'
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Prevent Mongoose Recompilation Error in Development
if (process.env.NODE_ENV === 'development') {
  if (mongoose.models.Booking) {
    delete mongoose.models.Booking;
  }
}

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
