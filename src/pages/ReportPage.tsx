import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFindIt } from '../context';
import { storageService } from '../services/storageService';
import type { ReportType, ItemCategory, ImageAnalysisResult } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { CampusLocationPicker } from '../components/common/CampusLocationPicker';
import {
  Tag,
  Package,
  X,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowLeftRight,
  ShieldAlert,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addReport, reports } = useFindIt();

  const [reportType, setReportType] = useState<ReportType>(() =>
    searchParams.get('mode') === 'found' ? 'found' : 'lost'
  );

  // Required Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [color, setColor] = useState('Black');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Block IV: Administrative Block');
  const [latitude, setLatitude] = useState<number | undefined>(18.0522);
  const [longitude, setLongitude] = useState<number | undefined>(79.5361);
  const [incidentDate, setIncidentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Optional Fields
  const [distinguishingFeatures, setDistinguishingFeatures] = useState('');
  const [privateDetail, setPrivateDetail] = useState('');

  // Image Upload & Integrity State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [imageError, setImageError] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: ItemCategory[] = [
    'Electronics',
    'ID Cards',
    'Bags',
    'Keys',
    'Books',
    'Accessories',
    'Clothing',
    'Other',
  ];

  const commonColors = [
    'Black',
    'Silver / Grey',
    'White',
    'Blue',
    'Purple',
    'Red',
    'Green',
    'Brown',
    'Gold / Yellow',
    'Multi-color',
  ];

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    setIsProcessingImage(true);

    try {
      const result = await storageService.processImageFile(file, category, reports);
      setImagePreview(result.dataUrl);
      setImageAnalysis(result.analysis);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process image file.';
      setImageError(msg);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageAnalysis(null);
    setImageError('');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Item name is required (e.g. "Casio Scientific Calculator").';
    if (!category) errs.category = 'Please select a category.';
    if (!color.trim()) errs.color = 'Primary color is required.';
    if (!description.trim() || description.trim().length < 10) {
      errs.description = 'Please describe the item in detail (at least 10 characters).';
    }
    if (!location.trim()) errs.location = 'Please select the campus location.';
    if (!incidentDate) errs.incidentDate = 'Date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = await addReport({
        type: reportType,
        title: title.trim(),
        category,
        color: color.trim(),
        description: description.trim(),
        distinguishingFeatures: distinguishingFeatures.trim() || undefined,
        location: location.trim(),
        latitude,
        longitude,
        incidentDate,
        image: imagePreview || undefined,
        imageAnalysis: imageAnalysis || undefined,
        privateDetail: privateDetail.trim() || undefined,
      });

      if (created) {
        navigate(`/item/${created.id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-bold text-[#242923]">
          {reportType === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
        </h1>
        <p className="text-xs sm:text-sm text-[#72766F]">
          {reportType === 'lost'
            ? 'Describe what you lost. A photograph is strictly optional—detailed descriptions work seamlessly with SmartMatch.'
            : 'Help a student recover their item by logging what you found.'}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1.5 bg-[#FAF8F2] border border-[#E5E2D9] rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setReportType('lost');
            setErrors({});
          }}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            reportType === 'lost'
              ? 'bg-[#174B3A] text-[#FFFEFA] shadow-xs'
              : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>I Lost Something</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setReportType('found');
            setErrors({});
          }}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            reportType === 'found'
              ? 'bg-[#174B3A] text-[#FFFEFA] shadow-xs'
              : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>I Found Something</span>
        </button>
      </div>

      {/* Photo-Optional Guidance Notice */}
      <div className="p-3.5 rounded-xl bg-[#EBF2ED] border border-[#174B3A]/20 flex items-start gap-2.5 text-xs text-[#174B3A] leading-relaxed">
        <ArrowLeftRight className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>Photo-Optional SmartMatch:</strong> Do not worry if you do not have a photo of your
          belonging. Enter color, description, and distinguishing marks below—our engine compares text
          attributes directly.
        </div>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
        {/* Optional Image Upload Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-[#242923] uppercase">
              Item Photograph <span className="text-[#72766F] font-normal">(Optional)</span>
            </label>
            <span className="text-[11px] text-[#72766F]">JPG, PNG, WebP</span>
          </div>

          {imagePreview ? (
            <div className="space-y-2">
              <div className="relative w-full h-52 rounded-xl overflow-hidden border border-[#E5E2D9] bg-[#F2EFE7] group">
                <img
                  src={imagePreview}
                  alt="Uploaded item"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  title="Remove photo"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs">
                  Photo Attached
                </div>
              </div>

              {/* Integrity & Duplicate Detection Feedback */}
              {imageAnalysis?.isFlaggedForReview && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Review Advisory:</strong>{' '}
                    {imageAnalysis.riskReasons[0]} This report will remain open while coordinators verify it.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#D9D5C9] hover:border-[#174B3A] rounded-xl cursor-pointer bg-[#FAF8F2] hover:bg-[#F2EFE7] transition-all p-4 text-center">
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-[#EBF2ED] text-[#174B3A] flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-[#242923]">
                  {isProcessingImage ? 'Analyzing image...' : 'Click or tap to attach a photo (Optional)'}
                </p>
                <p className="text-[11px] text-[#72766F]">
                  Upload only if you have an actual photo of the item
                </p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageFileChange}
                disabled={isProcessingImage}
                className="hidden"
              />
            </label>
          )}

          {imageError && <p className="text-xs text-[#C62828]">{imageError}</p>}
        </div>

        {/* Item Title */}
        <Input
          label="Item Name *"
          placeholder='e.g. "Casio fx-991ES Calculator", "Black Bifold Wallet", "Purple ID Card"'
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={errors.title}
        />

        {/* Category & Color Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category *"
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            options={categories.map((c) => ({ value: c, label: c }))}
          />

          <Select
            label="Primary Color *"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            options={commonColors.map((col) => ({ value: col, label: col }))}
          />
        </div>

        {/* Campus Location Map & Interactive Picker */}
        <CampusLocationPicker
          location={location}
          latitude={latitude}
          longitude={longitude}
          onChange={(loc, lat, lng) => {
            setLocation(loc);
            setLatitude(lat);
            setLongitude(lng);
            if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
          }}
          error={errors.location}
        />

        {/* Incident Date */}
        <div className="space-y-1.5">
          <label htmlFor="incident-date" className="block text-xs font-semibold text-[#242923] uppercase">
            Date {reportType === 'lost' ? 'Lost' : 'Found'} *
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#72766F] pointer-events-none">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="incident-date"
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-[#242923] focus:outline-none focus:ring-2 focus:ring-[#174B3A]/20 focus:border-[#174B3A]"
            />
          </div>
          {errors.incidentDate && <p className="text-xs text-[#C62828]">{errors.incidentDate}</p>}
        </div>

        {/* Detailed Description */}
        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-xs font-semibold text-[#242923] uppercase">
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            placeholder='Provide color, brand, condition, where it was situated (e.g. "Natural display calculator with sliding cover left on row 4...")'
            className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg p-3 text-sm text-[#242923] placeholder-[#9CA099] focus:outline-none focus:ring-2 focus:ring-[#174B3A]/20 focus:border-[#174B3A]"
          />
          {errors.description && <p className="text-xs text-[#C62828]">{errors.description}</p>}
        </div>

        {/* Distinguishing Features (Optional) */}
        <div className="space-y-1.5">
          <label htmlFor="distinguishing-features" className="block text-xs font-semibold text-[#242923] uppercase">
            Distinguishing Features <span className="text-[#72766F] font-normal">(Optional)</span>
          </label>
          <input
            id="distinguishing-features"
            type="text"
            value={distinguishingFeatures}
            onChange={(e) => setDistinguishingFeatures(e.target.value)}
            placeholder='e.g. Stickers, scratches, initials, case type, specific lanyard print'
            className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg px-3.5 py-2.5 text-sm text-[#242923] focus:outline-none focus:ring-2 focus:ring-[#174B3A]/20 focus:border-[#174B3A]"
          />
          <p className="text-[11px] text-[#72766F]">
            Helps SmartMatch differentiate similar items (e.g., standard calculators or black bottles).
          </p>
        </div>

        {/* Private Identifying Details for Ownership Verification */}
        <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#174B3A]" />
            <label htmlFor="private-detail" className="text-xs font-bold text-[#242923] uppercase">
              Confidential Ownership Mark (Kept Secret)
            </label>
          </div>
          <p className="text-[11px] text-[#72766F]">
            Secret detail not displayed in public listings. Used to verify the rightful owner during return.
          </p>
          <input
            id="private-detail"
            type="text"
            value={privateDetail}
            onChange={(e) => setPrivateDetail(e.target.value)}
            placeholder='e.g. "Piece of tape under solar cell", "Father number inside card holder"'
            className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg px-3 py-2 text-xs text-[#242923] focus:outline-none focus:ring-1 focus:ring-[#174B3A]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E2D9]">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<CheckCircle2 className="w-5 h-5" />}
          >
            Submit {reportType === 'lost' ? 'Lost Report' : 'Found Report'}
          </Button>
        </div>
      </form>
    </div>
  );
};
