export interface JurisdictionSource {
  code: string;
  name: string;
  sourceName: string;
  sourceUrl: string;
  effectiveDate: string;
  taxYear: number;
}

export const SALES_TAX_SOURCES_2026: Record<string, JurisdictionSource> = {
  AL: { code: 'AL', name: 'Alabama', sourceName: 'Alabama Department of Revenue', sourceUrl: 'https://revenue.alabama.gov/sales-use/', effectiveDate: '2026-01-01', taxYear: 2026 },
  AK: { code: 'AK', name: 'Alaska', sourceName: 'Alaska Department of Revenue (No state tax; local taxes apply)', sourceUrl: 'https://tax.alaska.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  AZ: { code: 'AZ', name: 'Arizona', sourceName: 'Arizona Department of Revenue (TPT)', sourceUrl: 'https://azdor.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  AR: { code: 'AR', name: 'Arkansas', sourceName: 'Arkansas Department of Finance and Administration', sourceUrl: 'https://www.dfa.arkansas.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  CA: { code: 'CA', name: 'California', sourceName: 'California Department of Tax and Fee Administration (CDTFA)', sourceUrl: 'https://www.cdtfa.ca.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  CO: { code: 'CO', name: 'Colorado', sourceName: 'Colorado Department of Revenue', sourceUrl: 'https://tax.colorado.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  CT: { code: 'CT', name: 'Connecticut', sourceName: 'Connecticut Department of Revenue Services', sourceUrl: 'https://portal.ct.gov/DRS', effectiveDate: '2026-01-01', taxYear: 2026 },
  DE: { code: 'DE', name: 'Delaware', sourceName: 'Delaware Division of Revenue (No sales tax; gross receipts tax)', sourceUrl: 'https://revenue.delaware.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  DC: { code: 'DC', name: 'District of Columbia', sourceName: 'DC Office of Tax and Revenue', sourceUrl: 'https://otr.cfo.dc.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  FL: { code: 'FL', name: 'Florida', sourceName: 'Florida Department of Revenue', sourceUrl: 'https://floridarevenue.com/', effectiveDate: '2026-01-01', taxYear: 2026 },
  GA: { code: 'GA', name: 'Georgia', sourceName: 'Georgia Department of Revenue', sourceUrl: 'https://dor.georgia.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  HI: { code: 'HI', name: 'Hawaii', sourceName: 'Hawaii Department of Taxation (GET)', sourceUrl: 'https://tax.hawaii.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  ID: { code: 'ID', name: 'Idaho', sourceName: 'Idaho State Tax Commission', sourceUrl: 'https://tax.idaho.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  IL: { code: 'IL', name: 'Illinois', sourceName: 'Illinois Department of Revenue', sourceUrl: 'https://tax.illinois.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  IN: { code: 'IN', name: 'Indiana', sourceName: 'Indiana Department of Revenue', sourceUrl: 'https://www.in.gov/dor/', effectiveDate: '2026-01-01', taxYear: 2026 },
  IA: { code: 'IA', name: 'Iowa', sourceName: 'Iowa Department of Revenue', sourceUrl: 'https://tax.iowa.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  KS: { code: 'KS', name: 'Kansas', sourceName: 'Kansas Department of Revenue', sourceUrl: 'https://www.ksrevenue.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  KY: { code: 'KY', name: 'Kentucky', sourceName: 'Kentucky Department of Revenue', sourceUrl: 'https://revenue.ky.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  LA: { code: 'LA', name: 'Louisiana', sourceName: 'Louisiana Department of Revenue', sourceUrl: 'https://revenue.louisiana.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  ME: { code: 'ME', name: 'Maine', sourceName: 'Maine Revenue Services', sourceUrl: 'https://www.maine.gov/revenue/', effectiveDate: '2026-01-01', taxYear: 2026 },
  MD: { code: 'MD', name: 'Maryland', sourceName: 'Comptroller of Maryland', sourceUrl: 'https://www.marylandtaxes.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  MA: { code: 'MA', name: 'Massachusetts', sourceName: 'Massachusetts Department of Revenue', sourceUrl: 'https://www.mass.gov/orgs/massachusetts-department-of-revenue', effectiveDate: '2026-01-01', taxYear: 2026 },
  MI: { code: 'MI', name: 'Michigan', sourceName: 'Michigan Department of Treasury', sourceUrl: 'https://www.michigan.gov/treasury', effectiveDate: '2026-01-01', taxYear: 2026 },
  MN: { code: 'MN', name: 'Minnesota', sourceName: 'Minnesota Department of Revenue', sourceUrl: 'https://www.revenue.state.mn.us/', effectiveDate: '2026-01-01', taxYear: 2026 },
  MS: { code: 'MS', name: 'Mississippi', sourceName: 'Mississippi Department of Revenue', sourceUrl: 'https://www.dor.ms.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  MO: { code: 'MO', name: 'Missouri', sourceName: 'Missouri Department of Revenue', sourceUrl: 'https://dor.mo.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  MT: { code: 'MT', name: 'Montana', sourceName: 'Montana Department of Revenue (No statewide retail sales tax)', sourceUrl: 'https://mtrevenue.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  NE: { code: 'NE', name: 'Nebraska', sourceName: 'Nebraska Department of Revenue', sourceUrl: 'https://revenue.nebraska.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  NV: { code: 'NV', name: 'Nevada', sourceName: 'Nevada Department of Taxation', sourceUrl: 'https://tax.nv.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  NH: { code: 'NH', name: 'New Hampshire', sourceName: 'New Hampshire Department of Revenue Administration (No general sales tax)', sourceUrl: 'https://www.revenue.nh.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  NJ: { code: 'NJ', name: 'New Jersey', sourceName: 'New Jersey Division of Taxation', sourceUrl: 'https://www.state.nj.us/treasury/taxation/', effectiveDate: '2026-01-01', taxYear: 2026 },
  NM: { code: 'NM', name: 'New Mexico', sourceName: 'New Mexico Taxation and Revenue Department (GRT)', sourceUrl: 'https://www.tax.newmexico.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  NY: { code: 'NY', name: 'New York', sourceName: 'New York State Department of Taxation and Finance', sourceUrl: 'https://www.tax.ny.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  NC: { code: 'NC', name: 'North Carolina', sourceName: 'North Carolina Department of Revenue', sourceUrl: 'https://www.ncdor.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  ND: { code: 'ND', name: 'North Dakota', sourceName: 'North Dakota Office of State Tax Commissioner', sourceUrl: 'https://www.tax.nd.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  OH: { code: 'OH', name: 'Ohio', sourceName: 'Ohio Department of Taxation', sourceUrl: 'https://tax.ohio.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  OK: { code: 'OK', name: 'Oklahoma', sourceName: 'Oklahoma Tax Commission', sourceUrl: 'https://oklahoma.gov/tax.html', effectiveDate: '2026-01-01', taxYear: 2026 },
  OR: { code: 'OR', name: 'Oregon', sourceName: 'Oregon Department of Revenue (No general retail sales tax; transit tax applies)', sourceUrl: 'https://www.oregon.gov/dor/', effectiveDate: '2026-01-01', taxYear: 2026 },
  PA: { code: 'PA', name: 'Pennsylvania', sourceName: 'Pennsylvania Department of Revenue', sourceUrl: 'https://www.revenue.pa.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  RI: { code: 'RI', name: 'Rhode Island', sourceName: 'Rhode Island Division of Taxation', sourceUrl: 'https://tax.ri.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  SC: { code: 'SC', name: 'South Carolina', sourceName: 'South Carolina Department of Revenue', sourceUrl: 'https://dor.sc.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  SD: { code: 'SD', name: 'South Dakota', sourceName: 'South Dakota Department of Revenue', sourceUrl: 'https://dor.sd.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  TN: { code: 'TN', name: 'Tennessee', sourceName: 'Tennessee Department of Revenue', sourceUrl: 'https://www.tn.gov/revenue/', effectiveDate: '2026-01-01', taxYear: 2026 },
  TX: { code: 'TX', name: 'Texas', sourceName: 'Texas Comptroller of Public Accounts', sourceUrl: 'https://comptroller.texas.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  UT: { code: 'UT', name: 'Utah', sourceName: 'Utah State Tax Commission', sourceUrl: 'https://tax.utah.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  VT: { code: 'VT', name: 'Vermont', sourceName: 'Vermont Department of Taxes', sourceUrl: 'https://tax.vermont.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  VA: { code: 'VA', name: 'Virginia', sourceName: 'Virginia Department of Taxation', sourceUrl: 'https://www.tax.virginia.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  WA: { code: 'WA', name: 'Washington', sourceName: 'Washington State Department of Revenue', sourceUrl: 'https://dor.wa.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  WV: { code: 'WV', name: 'West Virginia', sourceName: 'West Virginia State Tax Division', sourceUrl: 'https://tax.wv.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  WI: { code: 'WI', name: 'Wisconsin', sourceName: 'Wisconsin Department of Revenue', sourceUrl: 'https://www.revenue.wi.gov/', effectiveDate: '2026-01-01', taxYear: 2026 },
  WY: { code: 'WY', name: 'Wyoming', sourceName: 'Wyoming Department of Revenue', sourceUrl: 'https://revenue.state.wy.us/', effectiveDate: '2026-01-01', taxYear: 2026 }
};
