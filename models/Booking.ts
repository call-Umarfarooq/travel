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
    totalGuests: { type: Number, required: true }
  },
  
  pricing: {
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'AED' }
  },

  contactInfo: {
    fullName: String,
    email: String,
    phone: String,
    specialRequests: String
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
