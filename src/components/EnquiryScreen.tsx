'use client';

import { useState } from 'react';
import { PRODUCTS, USE_CASES } from '@/data';
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
  org: string;
  useCase: string;
  timeline: string;
  city: string;
  message: string;
}

export default function EnquiryScreen({ onBack, catalog }: EnquiryScreenProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    name: '', email: '', phone: '', org: '',
    useCase: 'commercial', timeline: '1-3 mo', city: '',
    message: '',
  });

  const update = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const items = Object.entries(catalog.items)
    .map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id === id)!, qty }))
    .filter(x => x.p);

  const submitted = step === 3;

  return (
    <div className="detail">
      <div className="detail-topbar" style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 6 }}>
        <button className="icon-btn" onClick={onBack}><Icon name="arrow-left" size={18} /></button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>Talk to a Specialist</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase' }}>
            {submitted ? 'Request sent' : `Step ${step + 1} of 3`}
          </div>
        </div>
        <button className="icon-btn" onClick={onBack}><Icon name="x" size={18} /></button>
      </div>

      <div className="cat-page" style={{ paddingTop: 20 }}>
        {!submitted && (
          <div className="steps">
            <div className={cls('step', step >= 0 && (step > 0 ? 'done' : 'active'))} />
            <div className={cls('step', step >= 1 && (step > 1 ? 'done' : 'active'))} />
            <div className={cls('step', step >= 2 && 'active')} />
          </div>
        )}

        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600, margin: '0 0 8px' }}>
              Who should we call?
            </h2>
            <p style={{ color: 'var(--text-dim)', margin: '0 0 22px' }}>One of our floor specialists will reach out within 24 hours.</p>
            <div className="form-field">
              <label>Full name</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@gym.com" />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 …" />
              </div>
            </div>
            <div className="form-field">
              <label>Gym / Organization</label>
              <input value={form.org} onChange={e => update('org', e.target.value)} placeholder="e.g. Pulse Gym, Bengaluru" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600, margin: '0 0 8px' }}>
              Tell us about the project.
            </h2>
            <p style={{ color: 'var(--text-dim)', margin: '0 0 22px' }}>Helps us match you with the right specialist.</p>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 8 }}>Use case</label>
            <div className="tile-row" style={{ marginBottom: 18 }}>
              {USE_CASES.map(u => (
                <button key={u.id} className={cls('tile', form.useCase === u.id && 'selected')} onClick={() => update('useCase', u.id)}>
                  {u.label}
                </button>
              ))}
            </div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 8 }}>Timeline</label>
            <div className="tile-row" style={{ marginBottom: 18 }}>
              {['Immediate', '1-3 mo', '3-6 mo', '6+ mo', 'Just exploring'].map(t => (
                <button key={t} className={cls('tile', form.timeline === t && 'selected')} onClick={() => update('timeline', t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="form-field">
              <label>City</label>
              <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Mumbai" />
            </div>
            <div className="form-field">
              <label>Anything else?</label>
              <textarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="Floor area, specific concerns, brand mix..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600, margin: '0 0 8px' }}>
              Review &amp; send
            </h2>
            <p style={{ color: 'var(--text-dim)', margin: '0 0 22px' }}>We&apos;ll attach your catalog as a PDF and forward to the right specialist.</p>
            <div style={{ padding: 18, background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', marginBottom: 14 }}>
              <div className="section-h" style={{ margin: '0 0 10px' }}>Contact</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>{form.name || '—'}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>{form.email || '—'} · {form.phone || '—'}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>{form.org || '—'}{form.city ? ` · ${form.city}` : ''}</div>
            </div>
            <div style={{ padding: 18, background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', marginBottom: 14 }}>
              <div className="section-h" style={{ margin: '0 0 10px' }}>Project</div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase' }}>Use case</div>
                  <div style={{ marginTop: 2, fontWeight: 500 }}>{USE_CASES.find(u => u.id === form.useCase)?.label}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase' }}>Timeline</div>
                  <div style={{ marginTop: 2, fontWeight: 500 }}>{form.timeline}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: 18, background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
              <div className="section-h" style={{ margin: '0 0 10px' }}>Catalog · {items.length} items</div>
              {items.length === 0 ? (
                <div style={{ color: 'var(--text-dim)' }}>No items yet — we&apos;ll discuss requirements directly.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {items.slice(0, 5).map(it => (
                    <div key={it.p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span>{it.p.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>× {it.qty}</span>
                    </div>
                  ))}
                  {items.length > 5 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)' }}>+ {items.length - 5} more</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {submitted && (
          <div className="cat-empty" style={{ paddingTop: 50 }}>
            <div className="ico" style={{ background: 'var(--accent)', border: 'none' }}>
              <Icon name="check" size={36} stroke="#fff" sw={2.2} />
            </div>
            <h2>Request received.</h2>
            <p>A specialist will reach out within 24 hours. We&apos;ve sent a confirmation to <strong style={{ color: 'var(--text)' }}>{form.email || 'your email'}</strong>.</p>
            <button className="btn-primary" onClick={onBack}>Back to catalog</button>
          </div>
        )}
      </div>

      {!submitted && (
        <div className="detail-actionbar">
          {step > 0 && <button className="btn-ghost" onClick={() => setStep(s => s - 1)}><Icon name="arrow-left" size={18} /></button>}
          <button
            className="btn-primary"
            onClick={() => {
              if (step === 0 && !form.name) return;
              setStep(s => s + 1);
            }}
          >
            {step === 2 ? 'Send request' : 'Continue'}
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
