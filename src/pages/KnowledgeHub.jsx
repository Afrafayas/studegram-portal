import React, { useState } from 'react';

export default function KnowledgeHub() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('visa'); // visa, living, work, psw

  const countryGuides = [
    {
      id: 'uk',
      name: 'United Kingdom',
      flag: '🇬🇧',
      capital: 'London',
      currency: 'GBP (£)',
      standardPsw: '2 Years',
      processingTime: '3 - 4 Weeks',
      avgCost: '£1,000/mo',
      rating: '4.8',
      accentColor: 'from-blue-600 to-indigo-800',
      description: 'One of the most prestigious education systems globally, offering fast-track degree options and high employability.',
      visa: {
        name: 'Student Visa (Subclass formerly Tier 4)',
        fee: '£490 (for applications outside UK)',
        ihsFee: '£776 per year (Healthcare Surcharge)',
        proofOfFunds: 'Inside London: £1,334/month • Outside London: £1,023/month (for up to 9 months)',
        minIelts: '5.5 - 6.5 (varies by level and university)',
        documents: [
          'Valid Passport & Immigration history',
          'Confirmation of Acceptance for Studies (CAS) Letter',
          'Tuberculosis (TB) test certificate (if applicable)',
          'Financial statements showing funds held for 28 consecutive days',
          'Academic certificates referenced in the CAS'
        ]
      },
      living: {
        rent: '£450 - £900 per month (Depends on city & shared/studio)',
        food: '£150 - £250 per month',
        travel: '£50 - £120 per month (Student discounts available)',
        utilities: '£60 - £100 per month',
        insurance: 'Free NHS access covered under IHS fee'
      },
      work: {
        hours: 'Up to 20 hours per week during term-time; Full-time during official vacation periods',
        wage: '£11.44 per hour (National Living Wage for ages 21+)',
        rules: 'On-campus and off-campus roles permitted. Cannot be self-employed or work as professional athlete/entertainer.',
        jobs: ['Retail Sales Assistant', 'Hospitality / Barista', 'University Campus Ambassador', 'Administrative Assistant']
      },
      psw: {
        name: 'Graduate Route Visa (PSW)',
        duration: '2 Years for Bachelors & Masters graduates • 3 Years for PhD graduates',
        fee: '£822 application fee + £1,035/year IHS health surcharge',
        rules: 'No sponsorship or job offer required. Allows grads to work in any job/role, switch to Skilled Worker visa when sponsored.'
      }
    },
    {
      id: 'ireland',
      name: 'Ireland',
      flag: '🇮🇪',
      capital: 'Dublin',
      currency: 'Euro (€)',
      standardPsw: '1 - 2 Years',
      processingTime: '4 - 8 Weeks',
      avgCost: '€1,100/mo',
      rating: '4.7',
      accentColor: 'from-emerald-500 to-green-700',
      description: 'The European tech hub hosting headquarters of top multinationals, providing exceptional graduate opportunities.',
      visa: {
        name: 'Study Visa (Stamp 2)',
        fee: '€60 (Single entry) • €100 (Multi-entry)',
        ihsFee: 'N/A (Private medical insurance is mandatory, ~€150 - €350/yr)',
        proofOfFunds: '€10,000 per year of study (or €7,000 for courses under 1 year)',
        minIelts: '6.0 - 6.5',
        documents: [
          'Official Letter of Acceptance from Irish university',
          'Evidence of tuition fees paid (min €6,000 or full fee if under €6,000)',
          'Detailed financial statements showing access to mandatory funds',
          'Sponsor letter and details (if funded by third party)',
          'Medical insurance policy certificate'
        ]
      },
      living: {
        rent: '€500 - €1,100 per month (Accommodation in Dublin is highly competitive)',
        food: '€200 - €300 per month',
        travel: '€60 - €100 per month (Student Leap card discounts)',
        utilities: '€70 - €120 per month',
        insurance: '€15 - €30 per month (Private student policies)'
      },
      work: {
        hours: 'Up to 20 hours per week during term-time; Up to 40 hours per week during specific holiday periods (June-Sept & Dec 15-Jan 15)',
        wage: '€12.70 per hour (National Minimum Wage)',
        rules: 'Must be enrolled on a course listed on the Interim List of Eligible Programmes (ILEP).',
        jobs: ['Food Service / Catering', 'Supermarket Associate', 'Sales and Customer Support', 'Data Entry Clerk']
      },
      psw: {
        name: 'Third Level Graduate Scheme (Stamp 1G)',
        duration: '1 Year for Honours Bachelors (Level 8) • 2 Years for Masters/PhD (Level 9+)',
        fee: '€300 registration fee for Irish Residence Permit (IRP) renewal',
        rules: 'Allows graduates to work full-time (40 hrs/week) without work permit. Can be transitioned to Critical Skills Employment Permit.'
      }
    },
    {
      id: 'canada',
      name: 'Canada',
      flag: '🇨🇦',
      capital: 'Ottawa',
      currency: 'CAD ($)',
      standardPsw: '1 - 3 Years',
      processingTime: '8 - 12 Weeks',
      avgCost: '$1,400 CAD/mo',
      rating: '4.6',
      accentColor: 'from-red-500 to-rose-700',
      description: 'Renowned for its friendly atmosphere, high standards of living, and robust pathways to permanent residency (PR).',
      visa: {
        name: 'Study Permit',
        fee: '$150 CAD (+ $85 CAD Biometrics fee)',
        ihsFee: 'N/A (Provincial or mandatory university plan, ~$500 - $900 CAD/yr)',
        proofOfFunds: '$20,635 CAD per year (single applicant, outside Quebec) + tuition fee coverage',
        minIelts: '6.0 - 6.5 (SDS pathway requires minimum 6.0 in each band)',
        documents: [
          'Letter of Acceptance (LOA) from a Designated Learning Institution (DLI)',
          'Provincial Attestation Letter (PAL) (mandatory since 2024)',
          'Guaranteed Investment Certificate (GIC) of $20,635 CAD',
          'Proof of tuition payment for the first year',
          'Medical examination report'
        ]
      },
      living: {
        rent: '$600 - $1,300 CAD per month (Varies drastically between Toronto/Vancouver and smaller towns)',
        food: '$250 - $400 CAD per month',
        travel: '$80 - $150 CAD per month',
        utilities: '$80 - $130 CAD per month',
        insurance: 'Included in university fees (mandatory health insurance)'
      },
      work: {
        hours: 'Up to 20 hours per week off-campus during academic sessions; Full-time during scheduled breaks',
        wage: '$15.00 - $17.30 CAD per hour (Varies by province, e.g. Ontario: $16.55 CAD)',
        rules: 'Must hold a valid Study Permit and be enrolled full-time at a DLI. Cannot work before the program starts.',
        jobs: ['Customer Service Representative', 'Barista / Kitchen Helper', 'Warehouse General Labourer', 'Online Tutor']
      },
      psw: {
        name: 'Post-Graduation Work Permit (PGWP)',
        duration: 'Varies from 1 to 3 Years (Matches program length if under 2 years; 3 years for programs 2 years or longer)',
        fee: '$255 CAD application fee',
        rules: 'Graduates must apply within 180 days of receiving final marks. Vitals points scored towards Express Entry PR system.'
      }
    },
    {
      id: 'australia',
      name: 'Australia',
      flag: '🇦🇺',
      capital: 'Canberra',
      currency: 'AUD ($)',
      standardPsw: '2 - 4 Years',
      processingTime: '4 - 6 Weeks',
      avgCost: '$1,600 AUD/mo',
      rating: '4.7',
      accentColor: 'from-[#0ea5e9] to-[#1e40af]',
      description: 'Sunny climate, top-tier research universities, and post-study opportunities in major economic centers.',
      visa: {
        name: 'Student Visa (Subclass 500)',
        fee: '$1,600 AUD',
        ihsFee: 'N/A (OSHC is mandatory, ~$550 - $800 AUD/yr)',
        proofOfFunds: '$29,710 AUD per year + travel cost (~$2,000 AUD) + tuition fees',
        minIelts: '6.0 - 6.5',
        documents: [
          'Confirmation of Enrolment (CoE) issued by university',
          'Genuine Student (GS) requirement essay (replaced GTE in 2024)',
          'OSHC (Overseas Student Health Cover) receipt for full visa duration',
          'Financial declarations & bank proofs meeting the $29,710 AUD limit',
          'English language test results (IELTS/PTE)'
        ]
      },
      living: {
        rent: '$700 - $1,500 AUD per month (On-campus housing is popular but limited)',
        food: '$300 - $500 AUD per month',
        travel: '$100 - $180 AUD per month (Concession fares in select states)',
        utilities: '$90 - $150 AUD per month',
        insurance: 'OSHC cover included in visa requirements'
      },
      work: {
        hours: 'Up to 48 hours per fortnight (2 weeks) during study terms; Uncapped hours during holidays',
        wage: '$24.10 AUD per hour (National Minimum Wage since July 2024)',
        rules: 'Allowed to work off-campus. Work rights commence only after the academic course has officially started.',
        jobs: ['Retail Sales / Supermarkets', 'Barista / Café Assistant', 'Delivery Driver', 'Administrative Support']
      },
      psw: {
        name: 'Temporary Graduate Visa (Subclass 485)',
        duration: '2 Years for Bachelors & Masters by coursework • 3 Years for Masters by research • 4 Years for PhD',
        fee: '$1,895 AUD application fee',
        rules: 'Must apply within 6 months of course completion. Allows graduates unlimited work rights.'
      }
    },
    {
      id: 'usa',
      name: 'United States',
      flag: '🇺🇸',
      capital: 'Washington D.C.',
      currency: 'USD ($)',
      standardPsw: '1 - 3 Years (OPT)',
      processingTime: '3 - 6 Weeks',
      avgCost: '$1,500/mo',
      rating: '4.8',
      accentColor: 'from-[#8B5CF6] to-[#4c1d95]',
      description: 'The world leader in academic prestige, technology innovation, and funding resources for global research.',
      visa: {
        name: 'F-1 Student Visa',
        fee: '$185 USD visa application fee + $350 USD SEVIS fee',
        ihsFee: 'N/A (Mandatory university plans required, ~$1,500 - $3,500/yr)',
        proofOfFunds: 'Must demonstrate immediate liquid funds for first 12 months (Tuition + Living: ~$45,000 - $65,000 USD)',
        minIelts: '6.5 - 7.0 (PTE and TOEFL are widely accepted)',
        documents: [
          'Form I-20 issued by the accepted SEVP-approved school',
          'SEVIS I-901 fee payment receipt',
          'DS-160 visa application confirmation barcode page',
          'Sponsor financial backing documents (liquid balances, tax returns)',
          'Academic transcripts, test scores (GRE/GMAT/SAT)'
        ]
      },
      living: {
        rent: '$600 - $1,400 per month (High variance between campus dorms and city apartments)',
        food: '$300 - $450 per month',
        travel: '$60 - $120 per month (Campus shuttles usually free)',
        utilities: '$80 - $140 per month',
        insurance: '$120 - $250 per month (Required university health insurance plans)'
      },
      work: {
        hours: 'Up to 20 hours per week during school semesters; Up to 40 hours per week during vacations',
        wage: '$7.25 - $16.00 per hour (Federal minimum is $7.25, but state/university averages are higher, e.g. $12-$15)',
        rules: 'F-1 students can ONLY work on-campus during the first academic year. Off-campus allowed under CPT/OPT in later years.',
        jobs: ['Campus Library Assistant', 'Student Dining Services', 'Peer Tutor / Teaching Assistant', 'Campus Tour Guide']
      },
      psw: {
        name: 'Optional Practical Training (OPT)',
        duration: '12 Months standard OPT • Extra 24-Month extension available for STEM graduates (Total 36 Months)',
        fee: '$410 USD application fee',
        rules: 'Must be directly related to the field of study. Requires authorization from the school DSO and USCIS EAD card.'
      }
    }
  ];

  // Filter countries by search query
  const filteredCountries = countryGuides.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.capital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setActiveTab('visa');
  };

  return (
    <div className="flex-1 p-8 space-y-8 bg-[#F0F2F5] animate-fade-in-up">
      
      {/* Dynamic View Header */}
      {!selectedCountry ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Knowledge Hub</h1>
            <p className="text-xs text-[#64748B] font-semibold mt-1">
              Basic country information, study guide portals, visa criteria, and living expenses.
            </p>
          </div>
          
          {/* Country Search */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] shadow-xs font-medium"
              placeholder="Search country or capital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <button
            onClick={() => setSelectedCountry(null)}
            className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] font-bold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Countries</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedCountry.flag}</span>
            <span className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">{selectedCountry.name} Guide</span>
          </div>
        </div>
      )}

      {/* Grid of Country Cards (List View) */}
      {!selectedCountry ? (
        filteredCountries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map((c, idx) => {
              const isBlueTheme = idx % 2 === 0;
              const topBorderClass = isBlueTheme ? 'border-t-[#2563EB]' : 'border-t-[#D99A1C]';
              const starColorClass = isBlueTheme ? 'text-[#2563EB]' : 'text-[#D99A1C]';

              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectCountry(c)}
                  className={`bg-white border border-[#E2E8F0] border-t-4 ${topBorderClass} rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group hover:shadow-md hover:border-slate-300 hover:scale-[1.01] cursor-pointer transition-all duration-200`}
                >
                  {/* Header Panel */}
                  <div className="h-24 bg-slate-950 p-4 flex flex-col justify-between relative border-b border-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl bg-white/10 px-2.5 py-0.5 rounded-full select-none">{c.flag}</span>
                      <div className="flex items-center gap-1 bg-white/10 text-white px-2 py-0.5 rounded-lg text-xs font-bold border border-white/10">
                        <svg className={`w-3.5 h-3.5 fill-current ${starColorClass}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{c.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-extrabold text-sm text-white leading-tight">{c.name}</h3>
                  </div>

                  {/* Card Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-[11px] text-[#64748B] font-semibold leading-relaxed line-clamp-2">
                      {c.description}
                    </p>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-3.5 text-center">
                      <div>
                        <span className="block text-[8px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-0.5">Capital</span>
                        <span className="text-[10px] font-bold text-[#334155] truncate block">{c.capital}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-0.5">Currency</span>
                        <span className="text-[10px] font-bold text-[#334155] truncate block">{c.currency}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-0.5">Post-Work</span>
                        <span className="text-[10px] font-bold text-[#334155] truncate block">{c.standardPsw}</span>
                      </div>
                    </div>

                    {/* Explore Button */}
                    <button
                      onClick={() => handleSelectCountry(c)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 py-2.5 rounded-xl text-center transition-all duration-150"
                    >
                      Explore Guide
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty search state */
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-[#64748B] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">No Country Guides Found</h3>
            <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
              We couldn't find any country guides matching "{searchQuery}". Try a different search term.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md inline-flex items-center gap-1.5"
            >
              Reset Search
            </button>
          </div>
        )
      ) : (
        /* Detailed Country Guide Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Quick Profile Panel */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className={`bg-gradient-to-tr ${selectedCountry.accentColor} p-6 text-white text-center space-y-3`}>
              <span className="text-5xl block select-none drop-shadow-md">{selectedCountry.flag}</span>
              <div>
                <h2 className="text-xl font-extrabold tracking-wide">{selectedCountry.name}</h2>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider mt-0.5">Destination Guide</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed text-center">
                "{selectedCountry.description}"
              </p>

              {/* Country Key Details Table */}
              <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs font-semibold">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Capital City</span>
                  <span className="text-[#0F172A] font-bold">{selectedCountry.capital}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Official Currency</span>
                  <span className="text-[#0F172A] font-bold">{selectedCountry.currency}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Average Living Costs</span>
                  <span className="text-[#0F172A] font-bold">{selectedCountry.avgCost}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Visa Processing</span>
                  <span className="text-[#0F172A] font-bold">{selectedCountry.processingTime}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#64748B]">Overall Score</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                    {selectedCountry.rating} / 5.0 ★
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Guide Tab details */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Tab Bar buttons */}
            <div className="flex border-b border-[#E2E8F0] bg-slate-50/50">
              {[
                { id: 'visa', label: 'Visa & Entry' },
                { id: 'living', label: 'Cost of Living' },
                { id: 'work', label: 'Part-Time Work' },
                { id: 'psw', label: 'Post-Study Rights' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-center py-3.5 text-xs font-bold transition-all border-b-2 select-none ${
                      isActive
                        ? 'border-[#D99A1C] text-[#D99A1C] bg-white'
                        : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            <div className="p-6 min-h-[300px]">
              
              {/* VISA TAB */}
              {activeTab === 'visa' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Visa Requirements</h4>
                    <p className="text-[11px] text-[#64748B] font-semibold">Key guidelines and documentation checklist for student visa application.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-semibold">
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Visa Category</span>
                      <span className="text-[#0F172A] font-bold">{selectedCountry.visa.name}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Visa Application Fee</span>
                      <span className="text-[#0F172A] font-bold">{selectedCountry.visa.fee}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Proof of Financial Sufficiency</span>
                      <span className="text-[#0F172A] font-bold leading-relaxed">{selectedCountry.visa.proofOfFunds}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">English Proficiency Benchmark</span>
                      <span className="text-[#0F172A] font-bold">IELTS/PTE avg score of {selectedCountry.visa.minIelts}</span>
                    </div>
                  </div>

                  {selectedCountry.visa.ihsFee && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex gap-3 text-xs">
                      <svg className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="space-y-0.5">
                        <p className="font-extrabold uppercase tracking-wider text-[9px] text-[#F59E0B]">Health Insurance Note:</p>
                        <p className="leading-relaxed font-semibold">Includes health insurance surcharge fee of **{selectedCountry.visa.ihsFee}** per year for NHS medical access.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3.5">
                    <h5 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider border-b border-slate-50 pb-1.5">Required Document Checklists</h5>
                    <div className="space-y-2">
                      {selectedCountry.visa.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#475569] font-semibold">
                          <svg className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LIVING EXPENSES TAB */}
              {activeTab === 'living' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Cost of Living</h4>
                    <p className="text-[11px] text-[#64748B] font-semibold">Estimated monthly budget breakdowns for average student expenses.</p>
                  </div>

                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-semibold text-[#475569]">
                      <thead className="bg-slate-50/50 border-b border-slate-100 text-[#0F172A] text-[9px] font-extrabold uppercase tracking-wider">
                        <tr>
                          <th className="p-3.5">Expense Category</th>
                          <th className="p-3.5 text-right">Estimated Cost / Month</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3.5 flex items-center gap-2">
                            <span>🏠</span>
                            <span>Rent & Accommodation</span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-[#0F172A]">{selectedCountry.living.rent}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 flex items-center gap-2">
                            <span>🛒</span>
                            <span>Food & Groceries</span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-[#0F172A]">{selectedCountry.living.food}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 flex items-center gap-2">
                            <span>🚌</span>
                            <span>Local Travel & Commuting</span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-[#0F172A]">{selectedCountry.living.travel}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 flex items-center gap-2">
                            <span>⚡</span>
                            <span>Utilities (Power, Wi-Fi)</span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-[#0F172A]">{selectedCountry.living.utilities}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 flex items-center gap-2">
                            <span>🏥</span>
                            <span>Medical & Health Insurance</span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-[#0F172A]">{selectedCountry.living.insurance}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex gap-3 text-xs font-semibold">
                    <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Pro-tip: Commuter students can obtain regional rail/bus cards (like the Oyster Card in UK or Leap Card in Ireland) to save up to 40% on monthly travel expenses.</span>
                  </div>
                </div>
              )}

              {/* PART-TIME WORK TAB */}
              {activeTab === 'work' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Part-Time Jobs</h4>
                    <p className="text-[11px] text-[#64748B] font-semibold">Regulations, minimum wages, and typical campus/retail student jobs.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-semibold">
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Permitted Work Hours</span>
                      <span className="text-[#0F172A] font-bold leading-relaxed">{selectedCountry.work.hours}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Average Minimum Wage</span>
                      <span className="text-emerald-600 font-bold">{selectedCountry.work.wage}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-semibold">
                    <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Employment Rules</span>
                    <p className="text-[#475569] leading-relaxed">{selectedCountry.work.rules}</p>
                  </div>

                  <div className="space-y-3">
                    <span className="block text-[9px] font-extrabold text-[#0F172A] uppercase tracking-wider border-b border-slate-50 pb-1.5">Common Student Jobs</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-[#475569]">
                      {selectedCountry.work.jobs.map((job, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D99A1C] shrink-0" />
                          <span>{job}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* POST STUDY WORK RIGHTS (PSW) */}
              {activeTab === 'psw' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Post-Study Work Rights</h4>
                    <p className="text-[11px] text-[#64748B] font-semibold">Graduate visas and immigration opportunities after course completion.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-semibold">
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Post-Study Visa Name</span>
                      <span className="text-[#0F172A] font-bold">{selectedCountry.psw.name}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Visa Duration</span>
                      <span className="text-indigo-600 font-bold">{selectedCountry.psw.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <span className="block text-[9px] font-extrabold text-[#0F172A] uppercase tracking-wider border-b border-slate-50 pb-1.5">Eligibility & Guidelines</span>
                    <div className="space-y-3.5 text-xs font-semibold text-[#475569] leading-relaxed">
                      <p>
                        {selectedCountry.psw.rules}
                      </p>
                      {selectedCountry.psw.fee && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] text-[#64748B]">
                          **Application Cost:** {selectedCountry.psw.fee}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
