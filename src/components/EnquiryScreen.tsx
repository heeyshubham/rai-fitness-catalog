'use client';

import { useState } from 'react';
import { PRODUCTS } from '@/data';
import type { CatalogState } from '@/types';
import Icon from './Icon';

function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

interface EnquiryScreenProps {
  onBack: () => void;
  catalog: CatalogState;
  fromProduct?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  orgType: string;
  timeline: string;
  city: string;
  message: string;
}

const ORG_TYPES = [
  { value: 'commercial-gym', label: 'Commercial Gym / Fitness Center' },
  { value: 'hotel', label: 'Hotel & Resort' },
  { value: 'corporate', label: 'Corporate Wellness' },
  { value: 'school', label: 'School / University' },
  { value: 'sports', label: 'Sports Academy' },
  { value: 'home', label: 'Home Setup' },
  { value: 'other', label: 'Other' },
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ludhiana',
  'Coimbatore', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot',
  'Varanasi', 'Chandigarh', 'Gurgaon', 'Noida', 'Other',
];

async function downloadQuote(form: FormState, catalogItems: Record<string, number>) {
  const { pdf } = await import('@react-pdf/renderer');
  const { default: QuotePDFComp } = await import('./QuotePDF');
  const blob = await pdf(<QuotePDFComp form={form} catalogItems={catalogItems} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rai-fitness-quote-${Date.now()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

const inputClass =
  'w-full px-4 py-[14px] rounded-md bg-surface border border-line text-text text-[16px] transition-[border-color] duration-150 appearance-none outline-none focus:border-accent';

const labelClass =
  'block font-mono text-[10px] tracking-[0.1em] uppercase text-text-mute mb-[6px]';

export default function EnquiryScreen({ onBack, catalog }: EnquiryScreenProps) {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '', email: '', phone: '', orgType: '',
    timeline: '1-3 mo', city: '',
    message: '',
  });

  const update = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = async () => {
    setGenerating(true);
    try {
      await downloadQuote(form, catalog.items);
    } finally {
      setGenerating(false);
    }
    setStep(3);
  };

  const items = Object.entries(catalog.items)
    .map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id === id)!, qty }))
    .filter(x => x.p);

  const submitted = step === 3;

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto overflow-x-hidden overscroll-contain animate-rise">
      {/* topbar */}
      <div className="sticky top-0 bg-bg z-[6] flex items-center justify-between px-5 py-[18px]">
        <button
          className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95"
          onClick={onBack}
        >
          <Icon name="arrow-left" size={18} />
        </button>
        <div className="text-center flex-1">
          <div className="font-display text-[18px] font-semibold">Talk to a Specialist</div>
          <div className="font-mono text-[10px] tracking-[0.1em] text-text-mute uppercase">
            {submitted ? 'Request sent' : `Step ${step + 1} of 3`}
          </div>
        </div>
        <button
          className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95"
          onClick={onBack}
        >
          <Icon name="x" size={18} />
        </button>
      </div>

      <div className="px-5 pt-5 cat-page-pad">
        {/* steps indicator */}
        {!submitted && (
          <div className="flex gap-[6px] mb-[22px]">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={cls(
                  'flex-1 h-[3px] rounded-[2px]',
                  step > i ? 'bg-accent' : step === i ? 'bg-text' : 'bg-line'
                )}
              />
            ))}
          </div>
        )}

        {/* step 0 */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-[28px] tracking-[-0.02em] font-semibold m-0 mb-2">
              Who should we call?
            </h2>
            <p className="text-text-dim m-0 mb-[22px]">One of our floor specialists will reach out within 24 hours.</p>
            <div className="mb-[14px]">
              <label className={labelClass}>Full name</label>
              <input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
            </div>
            <div className="mb-[14px]">
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 …" />
            </div>
            <div className="mb-[14px]">
              <label className={labelClass}>Organization type</label>
              <select
                className={cls(inputClass, 'select-chevron pr-[42px] cursor-pointer')}
                value={form.orgType}
                onChange={e => update('orgType', e.target.value)}
              >
                <option value="">Select type…</option>
                {ORG_TYPES.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* step 1 */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-[28px] tracking-[-0.02em] font-semibold m-0 mb-2">
              Tell us about the project.
            </h2>
            <p className="text-text-dim m-0 mb-[22px]">Helps us match you with the right specialist.</p>
            <div className="mb-[14px]">
              <label className={labelClass}>City</label>
              <select
                className={cls(inputClass, 'select-chevron pr-[42px] cursor-pointer')}
                value={form.city}
                onChange={e => update('city', e.target.value)}
              >
                <option value="">Select your city…</option>
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <label className={labelClass}>Timeline</label>
            <div className="flex gap-2 flex-wrap mb-[18px]">
              {['Immediate', '1-3 mo', '3-6 mo', '6+ mo', 'Just exploring'].map(t => (
                <button
                  key={t}
                  className={cls(
                    'px-4 py-3 rounded-md border text-[14px] font-medium cursor-pointer',
                    form.timeline === t
                      ? 'bg-text text-bg border-text'
                      : 'bg-surface border-line text-text'
                  )}
                  onClick={() => update('timeline', t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mb-[14px]">
              <label className={labelClass}>Anything else?</label>
              <textarea
                className={cls(inputClass, 'min-h-[110px] resize-y')}
                value={form.message}
                onChange={e => update('message', e.target.value)}
                placeholder="Floor area, specific concerns, brand mix..."
              />
            </div>
          </div>
        )}

        {/* step 2 */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-[28px] tracking-[-0.02em] font-semibold m-0 mb-2">
              Review &amp; send
            </h2>
            <p className="text-text-dim m-0 mb-[22px]">We&apos;ll attach your catalog as a PDF and forward to the right specialist.</p>
            <div className="mb-[14px]">
              <label className={labelClass}>Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  className={cls(inputClass, 'flex-1')}
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@gym.com"
                />
                <button
                  className="inline-flex items-center justify-center gap-[10px] px-[18px] py-[14px] rounded-full bg-accent text-white font-semibold text-[13px] whitespace-nowrap transition-[transform,background] duration-150 hover:bg-[#d12e3c] active:scale-[0.985] disabled:opacity-60"
                  disabled={generating}
                  onClick={handleSend}
                >
                  {generating ? 'Generating…' : 'Send & Download'}
                </button>
              </div>
            </div>

            {/* review cards */}
            <div className="p-[18px] bg-surface rounded-lg border border-line mb-[14px]">
              <div className="section-h font-mono text-[11px] tracking-[0.12em] uppercase text-text-mute mb-[10px] flex items-center gap-2">Contact</div>
              <div className="font-display text-[18px] font-semibold">{form.name || '—'}</div>
              <div className="text-text-dim text-[13px]">{form.email || '—'} · {form.phone || '—'}</div>
              <div className="text-text-dim text-[13px] mt-1">
                {form.orgType ? ORG_TYPES.find(o => o.value === form.orgType)?.label : '—'}
                {form.city ? ` · ${form.city}` : ''}
              </div>
            </div>
            <div className="p-[18px] bg-surface rounded-lg border border-line mb-[14px]">
              <div className="section-h font-mono text-[11px] tracking-[0.12em] uppercase text-text-mute mb-[10px] flex items-center gap-2">Project</div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.1em] text-text-mute uppercase">Timeline</div>
                <div className="mt-[2px] font-medium">{form.timeline}</div>
              </div>
            </div>
            <div className="p-[18px] bg-surface rounded-lg border border-line">
              <div className="section-h font-mono text-[11px] tracking-[0.12em] uppercase text-text-mute mb-[10px] flex items-center gap-2">
                Catalog · {items.length} items
              </div>
              {items.length === 0 ? (
                <div className="text-text-dim">No items yet — we&apos;ll discuss requirements directly.</div>
              ) : (
                <div className="flex flex-col gap-[6px]">
                  {items.slice(0, 5).map(it => (
                    <div key={it.p.id} className="flex justify-between text-[14px]">
                      <span>{it.p.name}</span>
                      <span className="font-mono text-text-dim">× {it.qty}</span>
                    </div>
                  ))}
                  {items.length > 5 && (
                    <div className="font-mono text-[12px] text-text-mute">+ {items.length - 5} more</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* submitted */}
        {submitted && (
          <div className="py-[50px] text-center px-5">
            <div className="w-[80px] h-[80px] mx-auto mb-[18px] rounded-[24px] bg-accent border-none grid place-items-center">
              <Icon name="check" size={36} stroke="#fff" sw={2.2} />
            </div>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em] m-0 mb-2">Request received.</h2>
            <p className="text-text-dim m-0 mb-[22px] max-w-[28ch] mx-auto">
              Your quote PDF has downloaded. A specialist will reach out within 24 hours at{' '}
              <strong className="text-text">{form.email || 'your email'}</strong>.
            </p>
            <button
              className="inline-flex items-center justify-center gap-[10px] px-[22px] py-4 rounded-full bg-accent text-white font-semibold text-[15px] transition-[transform,background] duration-150 hover:bg-[#d12e3c] active:scale-[0.985]"
              onClick={onBack}
            >
              Back to catalog
            </button>
          </div>
        )}
      </div>

      {/* action bar */}
      {!submitted && (
        <div className="fixed bottom-0 left-0 right-0 px-5 pt-[14px] bg-gradient-to-b from-transparent to-bg/[1] z-[60] flex gap-[10px] items-center detail-bar-pad">
          {step > 0 && (
            <button
              className="w-[54px] h-[54px] rounded-full bg-surface border border-line grid place-items-center flex-shrink-0"
              onClick={() => setStep(s => s - 1)}
            >
              <Icon name="arrow-left" size={18} />
            </button>
          )}
          <button
            className="flex-1 inline-flex items-center justify-center gap-[10px] px-[22px] py-4 rounded-full bg-accent text-white font-semibold text-[15px] transition-[transform,background] duration-150 hover:bg-[#d12e3c] active:scale-[0.985] disabled:opacity-60"
            disabled={generating}
            onClick={() => {
              if (step === 0 && !form.name) return;
              if (step === 2) { handleSend(); } else { setStep(s => s + 1); }
            }}
          >
            {generating ? 'Generating…' : step === 2 ? 'Send & Download PDF' : 'Continue'}
            {!generating && <Icon name="arrow-right" size={18} />}
          </button>
        </div>
      )}
    </div>
  );
}
