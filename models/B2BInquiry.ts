import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IB2BInquiry extends Document {
  fullName: string;
  companyName: string;
  businessEmail: string;
  phone: string;
  country: string;
  message: string;
  createdAt: Date;
}

const B2BInquirySchema: Schema<IB2BInquiry> = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    businessEmail: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const B2BInquiry: Model<IB2BInquiry> =
  mongoose.models.B2BInquiry || mongoose.model<IB2BInquiry>('B2BInquiry', B2BInquirySchema);

export default B2BInquiry;
