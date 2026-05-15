import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PRODUCTS } from '@/data';

const C = {
  bg: '#0c0a09',
  surface: '#1a1612',
  line: '#2a2420',
  accent: '#E63946',
  text: '#f0ebe5',
  dim: '#8a7d74',
  mute: '#4a4038',
  white: '#ffffff',
};

const s = StyleSheet.create({
  page: { backgroundColor: C.bg, padding: 48, fontFamily: 'Helvetica', color: C.text },
  // header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 },
  brandMark: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { fontFamily: 'Helvetica-Bold', fontSize: 22, color: C.white },
  brandName: { fontFamily: 'Helvetica-Bold', fontSize: 18, color: C.text, marginBottom: 2 },
  brandSub: { fontSize: 8, color: C.dim, letterSpacing: 1.5 },
  docTitle: { fontSize: 9, color: C.dim, letterSpacing: 1.5, textAlign: 'right', marginTop: 4 },
  docDate: { fontSize: 9, color: C.mute, textAlign: 'right', marginTop: 2 },
  // divider
  divider: { borderBottom: `1px solid ${C.line}`, marginBottom: 28 },
  // section
  section: { marginBottom: 28 },
  sectionLabel: { fontSize: 8, color: C.dim, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  // contact
  contactName: { fontFamily: 'Helvetica-Bold', fontSize: 20, color: C.text, marginBottom: 4 },
  contactRow: { fontSize: 11, color: C.dim, marginBottom: 2 },
  // pills row
  pillsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 2 },
  pill: { borderRadius: 20, border: `1px solid ${C.line}`, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { fontSize: 10, color: C.dim },
  // table
  tableHeader: { flexDirection: 'row', paddingVertical: 8, borderBottom: `1px solid ${C.line}`, marginBottom: 4 },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottom: `1px solid ${C.line}` },
  colName: { flex: 3 },
  colCode: { flex: 2 },
  colSeries: { flex: 2 },
  colQty: { flex: 1, alignItems: 'flex-end' },
  thText: { fontSize: 8, color: C.mute, letterSpacing: 1.5, textTransform: 'uppercase' },
  tdMain: { fontSize: 12, color: C.text, marginBottom: 2 },
  tdSub: { fontSize: 9, color: C.dim },
  tdCode: { fontSize: 10, color: C.dim },
  tdQty: { fontFamily: 'Helvetica-Bold', fontSize: 14, color: C.text },
  // summary bar
  summaryBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, padding: 18, marginTop: 8 },
  summaryLabel: { fontSize: 8, color: C.dim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  summaryValue: { fontFamily: 'Helvetica-Bold', fontSize: 22, color: C.text },
  summaryModels: { fontSize: 9, color: C.dim },
  accentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent },
  // footer
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: 8, color: C.mute },
  footerAccent: { fontSize: 8, color: C.accent },
  // message
  messagebox: { backgroundColor: C.surface, borderRadius: 8, padding: 14, marginTop: 14 },
  messageText: { fontSize: 11, color: C.dim, lineHeight: 1.6 },
});

const ORG_TYPES: Record<string, string> = {
  'commercial-gym': 'Commercial Gym / Fitness Center',
  'hotel': 'Hotel & Resort',
  'corporate': 'Corporate Wellness',
  'school': 'School / University',
  'sports': 'Sports Academy',
  'home': 'Home Setup',
  'other': 'Other',
};

interface QuotePDFProps {
  form: {
    name: string; email: string; phone: string;
    orgType: string; timeline: string; city: string; message: string;
  };
  catalogItems: Record<string, number>;
}

export default function QuotePDF({ form, catalogItems }: QuotePDFProps) {
  const items = Object.entries(catalogItems)
    .map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id === id)!, qty }))
    .filter(x => x.p);

  const totalUnits = items.reduce((s, i) => s + i.qty, 0);
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Document title={`Rai Fitness Quote — ${form.name || 'Request'}`} author="Rai Fitness">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <View style={s.brandMark}>
              <Text style={s.brandMarkText}>R</Text>
            </View>
            <View>
              <Text style={s.brandName}>Rai Fitness</Text>
              <Text style={s.brandSub}>EST · 1986 · INDIA</Text>
            </View>
          </View>
          <View>
            <Text style={s.docTitle}>QUOTATION REQUEST</Text>
            <Text style={s.docDate}>{date}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Contact */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Prepared for</Text>
          <Text style={s.contactName}>{form.name || '—'}</Text>
          {form.email ? <Text style={s.contactRow}>{form.email}</Text> : null}
          {form.phone ? <Text style={s.contactRow}>{form.phone}</Text> : null}
          <View style={s.pillsRow}>
            {form.orgType ? (
              <View style={s.pill}><Text style={s.pillText}>{ORG_TYPES[form.orgType] || form.orgType}</Text></View>
            ) : null}
            {form.city ? (
              <View style={s.pill}><Text style={s.pillText}>{form.city}</Text></View>
            ) : null}
            {form.timeline ? (
              <View style={s.pill}><Text style={s.pillText}>Timeline: {form.timeline}</Text></View>
            ) : null}
          </View>
        </View>

        <View style={s.divider} />

        {/* Catalog table */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Equipment catalog</Text>

          {/* Table header */}
          <View style={s.tableHeader}>
            <View style={s.colName}><Text style={s.thText}>Product</Text></View>
            <View style={s.colCode}><Text style={s.thText}>Code</Text></View>
            <View style={s.colSeries}><Text style={s.thText}>Series</Text></View>
            <View style={s.colQty}><Text style={s.thText}>Qty</Text></View>
          </View>

          {items.length === 0 ? (
            <Text style={{ fontSize: 11, color: C.dim, paddingVertical: 16 }}>
              No items selected — requirements to be discussed directly.
            </Text>
          ) : (
            items.map(({ p, qty }) => (
              <View key={p.id} style={s.tableRow}>
                <View style={s.colName}>
                  <Text style={s.tdMain}>{p.name}</Text>
                  <Text style={s.tdSub}>{p.muscles.join(', ')}</Text>
                </View>
                <View style={s.colCode}>
                  <Text style={s.tdCode}>{p.code}</Text>
                </View>
                <View style={s.colSeries}>
                  <Text style={s.tdCode}>{p.series}</Text>
                </View>
                <View style={s.colQty}>
                  <Text style={s.tdQty}>{qty}</Text>
                </View>
              </View>
            ))
          )}

          {/* Summary bar */}
          {items.length > 0 && (
            <View style={s.summaryBar}>
              <View>
                <Text style={s.summaryLabel}>Total units</Text>
                <Text style={s.summaryValue}>{totalUnits}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={s.summaryLabel}>Models</Text>
                <Text style={[s.summaryValue, { fontSize: 16 }]}>{items.length}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={s.accentDot} />
              </View>
            </View>
          )}
        </View>

        {/* Message */}
        {form.message ? (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Additional notes</Text>
            <View style={s.messagebox}>
              <Text style={s.messageText}>{form.message}</Text>
            </View>
          </View>
        ) : null}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>This document is a quotation request, not a confirmed order.</Text>
          <Text style={s.footerAccent}>raifitness.in</Text>
        </View>

      </Page>
    </Document>
  );
}
