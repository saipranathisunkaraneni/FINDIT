import React, { useState } from 'react';
import {
  Search,
  Tag,
  Package,
  ShieldCheck,
  ArrowLeftRight,
  MapPin,
  Clock,
  Heart,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';

export const DesignSystemPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const colorSwatches = [
    { name: 'Warm Ivory', hex: '#F7F5EF', token: '--color-bg-ivory', role: 'Page background' },
    { name: 'Cream Surface', hex: '#FFFEFA', token: '--color-surface-card', role: 'Cards & containers' },
    { name: 'Forest Green', hex: '#174B3A', token: '--color-forest-primary', role: 'Primary actions & brand' },
    { name: 'Dark Green', hex: '#10372D', token: '--color-forest-dark', role: 'Hover & deep accents' },
    { name: 'Charcoal Text', hex: '#242923', token: '--color-charcoal-text', role: 'Primary typography' },
    { name: 'Muted Secondary', hex: '#72766F', token: '--color-muted-text', role: 'Subtitles & metadata' },
    { name: 'Subtle Border', hex: '#E5E2D9', token: '--color-border-subtle', role: 'Separators & strokes' },
    { name: 'Soft Sage', hex: '#DCE7D8', token: '--color-sage-accent', role: 'Accent highlights & tags' },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Editorial Header Section */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-[#174B3A] bg-[#DCE7D8]/60 border border-[#DCE7D8]">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>TRI-CITY AI HACKATHON FOUNDATION</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#242923] tracking-tight leading-tight">
          Findit Design System & Tokens
        </h1>
        <p className="text-base sm:text-lg text-[#72766F] max-w-2xl font-sans leading-relaxed">
          Centralized foundation engineered for a refined campus lost-and-found experience.
          Combining warm ivory surfaces, forest-green accents, and editorial serif typography.
        </p>
      </section>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="border-b border-[#E5E2D9] pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#242923]">1. Color Palette Tokens</h2>
          <p className="text-sm text-[#72766F]">
            Cohesive, restrained palette replacing cold greys and purple gradients with warm paper-like tones.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colorSwatches.map((color) => (
            <div
              key={color.name}
              className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-3 shadow-xs space-y-3"
            >
              <div
                className="w-full h-16 rounded-lg border border-[#E5E2D9]/70 flex items-end p-2"
                style={{ backgroundColor: color.hex }}
              >
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    ['#174B3A', '#10372D', '#242923'].includes(color.hex)
                      ? 'bg-black/30 text-white'
                      : 'bg-white/80 text-[#242923]'
                  }`}
                >
                  {color.hex}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#242923]">{color.name}</p>
                <p className="text-xs text-[#72766F] font-mono mt-0.5">{color.token}</p>
                <p className="text-xs text-[#72766F] mt-1">{color.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Hierarchy */}
      <section className="space-y-6">
        <div className="border-b border-[#E5E2D9] pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#242923]">2. Typography Hierarchy</h2>
          <p className="text-sm text-[#72766F]">
            Editorial serif headings paired with clean, crisp sans-serif body typography.
          </p>
        </div>

        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-[#E5E2D9]/60 pb-6">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#72766F]">
              Display Heading (Serif — Newsreader / Playfair)
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#242923] leading-snug">
              Lost something on campus? Let's bring it back.
            </h2>
          </div>

          <div className="space-y-2 border-b border-[#E5E2D9]/60 pb-6">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#72766F]">
              Section Heading (Serif)
            </span>
            <h3 className="text-2xl font-serif font-semibold text-[#242923]">
              Recently Reported Across Campus
            </h3>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#72766F]">
              Body Text & Metadata (Sans-Serif — Plus Jakarta Sans)
            </span>
            <p className="text-sm sm:text-base text-[#242923] leading-relaxed max-w-3xl">
              Findit connects lost and found reports using intelligent photo and attribute matching.
              Students can report items in less than two minutes with privacy safeguards protecting sensitive marks.
            </p>
            <p className="text-xs text-[#72766F]">
              Metadata label: Academic Block A • Reported 2 hours ago • 85% match confidence
            </p>
          </div>
        </div>
      </section>

      {/* 3. Interactive Buttons & Controls */}
      <section className="space-y-6">
        <div className="border-b border-[#E5E2D9] pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#242923]">3. Buttons & Action Controls</h2>
          <p className="text-sm text-[#72766F]">
            Purpose-built button variants adhering strictly to the forest-green and cream aesthetic.
          </p>
        </div>

        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#72766F] uppercase tracking-wide block mb-3">
              Variants
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={<Search className="w-4 h-4" />}>
                Primary Button
              </Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="sage">Sage Highlight</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#72766F] uppercase tracking-wide block mb-3">
              Sizes
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small (32px)</Button>
              <Button size="md">Medium (40px)</Button>
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Large CTA (48px)
              </Button>
              <Button isLoading size="md">
                Loading State
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Badges & Status Indicators */}
      <section className="space-y-6">
        <div className="border-b border-[#E5E2D9] pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#242923]">4. Status Badges & Pills</h2>
          <p className="text-sm text-[#72766F]">
            Clear semantic signals without loud, saturated neon tones.
          </p>
        </div>

        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-6 sm:p-8 flex flex-wrap gap-4 items-center">
          <Badge variant="found" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Found
          </Badge>
          <Badge variant="lost">Lost</Badge>
          <Badge variant="pending">Searching</Badge>
          <Badge variant="match">85% Match</Badge>
          <Badge variant="campus">KITSW</Badge>
          <Badge variant="category">Electronics</Badge>
          <Badge variant="category">Bags</Badge>
        </div>
      </section>

      {/* 5. Inputs & Form Fields */}
      <section className="space-y-6">
        <div className="border-b border-[#E5E2D9] pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#242923]">5. Form Inputs & Selects</h2>
          <p className="text-sm text-[#72766F]">
            High-contrast, accessible input elements with focus rings and clear labels.
          </p>
        </div>

        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Search Items"
            placeholder='e.g. "black bottle", "ID card"'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Select
            label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'bags', label: 'Bags & Backpacks' },
              { value: 'electronics', label: 'Electronics & Audio' },
              { value: 'cards', label: 'ID Cards & Wallets' },
              { value: 'keys', label: 'Keys & Keychains' },
            ]}
          />

          <Input
            label="Input with Error State"
            placeholder="Item name"
            error="Please provide a valid item name"
            defaultValue="Missing item"
          />
        </div>
      </section>

      {/* 6. Editorial Component Cards (Previewing Reference Look) */}
      <section className="space-y-6">
        <div className="border-b border-[#E5E2D9] pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#242923]">
            6. Editorial Component Cards (Reference Alignment)
          </h2>
          <p className="text-sm text-[#72766F]">
            Direct preview of the reference UI cards: Quick action banners and lost-and-found items.
          </p>
        </div>

        {/* Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#174B3A] text-[#FFFEFA] rounded-xl p-6 flex items-center justify-between cursor-pointer hover:bg-[#10372D] transition-colors shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#FFFEFA]/10 flex items-center justify-center text-[#FFFEFA]">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#FFFEFA]">Report Lost</h3>
                <p className="text-xs text-[#FFFEFA]/80">Find your missing belonging across campus</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#FFFEFA]/70" />
          </div>

          <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-6 flex items-center justify-between cursor-pointer hover:bg-[#F6F4EC] transition-colors shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#EBF2ED] flex items-center justify-center text-[#174B3A]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#242923]">Report Found</h3>
                <p className="text-xs text-[#72766F]">Help a student get their item back</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#72766F]" />
          </div>
        </div>

        {/* Item Cards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Item 1 */}
          <Card interactive padding="none" className="overflow-hidden flex flex-col">
            <div className="h-44 bg-[#F2EFE7] relative flex items-center justify-center text-[#72766F]">
              <Package className="w-12 h-12 stroke-1 text-[#9CA099]" />
              <div className="absolute top-3 left-3">
                <Badge variant="found">Found</Badge>
              </div>
              <button
                type="button"
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#72766F] hover:text-[#C62828] transition-colors"
                aria-label="Save item"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#242923]">Black Backpack</h4>
                <div className="flex items-center gap-1.5 text-xs text-[#72766F] mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Central Library</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E2D9]/60 text-xs text-[#72766F]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 2 hours ago
                </span>
                <span className="font-medium text-[#174B3A]">View Details →</span>
              </div>
            </div>
          </Card>

          {/* Item 2 */}
          <Card interactive padding="none" className="overflow-hidden flex flex-col">
            <div className="h-44 bg-[#F2EFE7] relative flex items-center justify-center text-[#72766F]">
              <Tag className="w-12 h-12 stroke-1 text-[#9CA099]" />
              <div className="absolute top-3 left-3">
                <Badge variant="lost">Lost</Badge>
              </div>
              <button
                type="button"
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#72766F] hover:text-[#C62828] transition-colors"
                aria-label="Save item"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#242923]">Water Bottle (Green)</h4>
                <div className="flex items-center gap-1.5 text-xs text-[#72766F] mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Academic Block A</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E2D9]/60 text-xs text-[#72766F]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 5 hours ago
                </span>
                <span className="font-medium text-[#174B3A]">View Details →</span>
              </div>
            </div>
          </Card>

          {/* Item 3 */}
          <Card interactive padding="none" className="overflow-hidden flex flex-col">
            <div className="h-44 bg-[#F2EFE7] relative flex items-center justify-center text-[#72766F]">
              <ShieldCheck className="w-12 h-12 stroke-1 text-[#9CA099]" />
              <div className="absolute top-3 left-3">
                <Badge variant="match">82% Match</Badge>
              </div>
              <button
                type="button"
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#72766F] hover:text-[#C62828] transition-colors"
                aria-label="Save item"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#242923]">Student ID Card</h4>
                <div className="flex items-center gap-1.5 text-xs text-[#72766F] mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Main Entrance</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E2D9]/60 text-xs text-[#72766F]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 1 day ago
                </span>
                <span className="font-medium text-[#174B3A]">View Details →</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
