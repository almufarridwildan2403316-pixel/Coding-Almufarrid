import { useState } from "react";
import type { FC, ReactNode } from "react";
import {
  Atom,
  BookOpen,
  FlaskConical,
  Zap,
  Lightbulb,
  ChevronRight,
  CheckCircle2,
  Info,
  Droplets,
  Sparkles,
  ArrowRight,
  Microscope,
} from "lucide-react";

// ================================
// TYPESCRIPT INTERFACES
// ================================

interface MateriProps {
  onStartLab?: () => void;
}

type TabId =
  | "dasar"
  | "kuat"
  | "lemah"
  | "non"
  | "perbandingan";

interface TabItem {
  id: TabId;
  label: string;
}

// ================================
// DATA NAVIGASI
// ================================

const tabs: TabItem[] = [
  { id: "dasar", label: "Konsep Dasar" },
  { id: "kuat", label: "Elektrolit Kuat" },
  { id: "lemah", label: "Elektrolit Lemah" },
  { id: "non", label: "Non-Elektrolit" },
  { id: "perbandingan", label: "Perbandingan" },
];

// ================================
// KOMPONEN PENDUKUNG
// ================================

const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <div className="mb-7">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
      {eyebrow}
    </p>

    <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
      {title}
    </h2>

    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
      {description}
    </p>
  </div>
);

const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
      {icon}
    </div>

    <h3 className="mb-2 font-bold text-slate-900">{title}</h3>

    <div className="text-sm leading-7 text-slate-600">
      {children}
    </div>
  </div>
);

const EquationCard = ({
  label,
  equation,
  explanation,
}: {
  label: string;
  equation: ReactNode;
  explanation: string;
}) => (
  <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-sky-700">
      {label}
    </p>

    <div className="mb-3 overflow-x-auto text-center text-xl font-semibold text-slate-900 md:text-2xl">
      {equation}
    </div>

    <p className="text-sm leading-6 text-slate-600">
      {explanation}
    </p>
  </div>
);

// ================================
// KOMPONEN UTAMA MATERI
// ================================

export const Materi: FC<MateriProps> = ({ onStartLab }) => {
  const [activeTab, setActiveTab] = useState<TabId>("dasar");

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER MATERI */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50 px-5 py-12 md:px-10 md:py-16">

        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 shadow-sm">
            <BookOpen size={15} />
            MODUL PEMBELAJARAN KIMIA KELAS X
          </div>

          <div className="grid items-center gap-10 md:grid-cols-2">

            <div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
                Larutan Elektrolit
                <span className="block text-sky-600">
                  dan Non-Elektrolit
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-8 text-slate-600 md:text-base">
                Mengapa air garam dapat menghantarkan listrik,
                sedangkan air gula tidak? Mari jelajahi dunia ion
                dan temukan rahasia di balik kemampuan larutan
                menghantarkan arus listrik!
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                  <FlaskConical size={17} className="text-sky-600" />
                  Materi Interaktif
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                  <Atom size={17} className="text-sky-600" />
                  Konsep Ion
                </div>

              </div>
            </div>

            {/* ILUSTRASI HERO */}
            <div className="flex justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-sky-100/70 md:h-80 md:w-80">

                <div className="absolute inset-5 rounded-full border border-sky-200" />

                <div className="absolute left-8 top-12 flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-sky-600 shadow-md">
                  Na⁺
                </div>

                <div className="absolute bottom-12 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-blue-600 shadow-md">
                  Cl⁻
                </div>

                <div className="absolute right-10 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-sky-600 shadow-sm">
                  H⁺
                </div>

                <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-sky-400 bg-white shadow-xl md:h-40 md:w-40">
                  <FlaskConical
                    size={85}
                    strokeWidth={1.3}
                    className="text-sky-500"
                  />
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-bold text-sky-700 shadow-md">
                  Let's Explore Chemistry!
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* KONTEN UTAMA */}
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-10">

        {/* NAVIGASI TAB */}
        <div className="mb-9 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

          <div className="flex min-w-max gap-2">

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                    ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}

          </div>
        </div>

        {/* ======================== */}
        {/* TAB 1: KONSEP DASAR */}
        {/* ======================== */}

        {activeTab === "dasar" && (

          <section className="space-y-8">

            <SectionHeading
              eyebrow="01 — Fundamental Chemistry"
              title="Mengenal Larutan Elektrolit"
              description="Sebelum memahami bagaimana listrik dapat mengalir melalui larutan, kita perlu mengenal konsep larutan, ion, dan teori ionisasi Arrhenius."
            />

            <div className="grid gap-5 md:grid-cols-2">

              <InfoCard
                icon={<Droplets size={22} />}
                title="Apa Itu Larutan?"
              >
                Larutan merupakan campuran homogen yang terdiri
                atas zat terlarut (solute) dan pelarut (solvent).
                Contohnya adalah air garam, air gula, dan air cuka.
              </InfoCard>

              <InfoCard
                icon={<Zap size={22} />}
                title="Larutan Elektrolit"
              >
                Larutan yang dapat menghantarkan arus listrik
                karena mengandung ion-ion yang dapat bergerak
                bebas di dalam larutan.
              </InfoCard>

              <InfoCard
                icon={<Atom size={22} />}
                title="Larutan Non-Elektrolit"
              >
                Larutan yang tidak menghantarkan arus listrik
                secara berarti karena tidak menghasilkan ion
                bergerak dalam jumlah berarti.
              </InfoCard>

              <InfoCard
                icon={<Microscope size={22} />}
                title="Apa Itu Ion?"
              >
                Ion adalah atom atau kelompok atom yang
                memiliki muatan listrik. Ion positif disebut
                kation, sedangkan ion negatif disebut anion.
              </InfoCard>

            </div>

            {/* TEORI ARRHENIUS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">

              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Atom size={24} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Konsep Penting
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    Teori Ionisasi Arrhenius
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-8 text-slate-600">
                Menurut teori Arrhenius, elektrolit menghasilkan
                ion-ion ketika berada dalam larutan. Asam Arrhenius
                menghasilkan ion H⁺ dalam air, sedangkan basa
                Arrhenius menghasilkan ion OH⁻ dalam air.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <EquationCard
                  label="Contoh Asam Arrhenius"
                  equation={
                    <>
                      HCl + H<sub>2</sub>O →
                      H<sub>3</sub>O<sup>+</sup> + Cl<sup>-</sup>
                    </>
                  }
                  explanation="HCl bereaksi dengan air menghasilkan ion hidronium dan ion klorida."
                />

                <EquationCard
                  label="Contoh Basa Arrhenius"
                  equation={
                    <>
                      NaOH → Na<sup>+</sup> + OH<sup>-</sup>
                    </>
                  }
                  explanation="NaOH terdisosiasi dalam air menghasilkan ion natrium dan ion hidroksida."
                />

              </div>
            </div>

            {/* IONISASI DAN DISOSIASI */}
            <div className="grid gap-5 md:grid-cols-2">

              <EquationCard
                label="Proses Ionisasi"
                equation={
                  <>
                    HCl + H<sub>2</sub>O →
                    H<sub>3</sub>O<sup>+</sup> + Cl<sup>-</sup>
                  </>
                }
                explanation="Ionisasi merupakan proses terbentuknya ion dari molekul suatu zat ketika bereaksi dengan air."
              />

              <EquationCard
                label="Proses Disosiasi"
                equation={
                  <>
                    NaCl → Na<sup>+</sup> + Cl<sup>-</sup>
                  </>
                }
                explanation="Disosiasi merupakan proses pemisahan ion-ion penyusun senyawa ionik ketika dilarutkan dalam air."
              />

            </div>

            {/* DERAJAT IONISASI */}
            <div className="rounded-3xl bg-slate-900 p-6 text-white md:p-8">

              <div className="flex items-center gap-3">
                <Lightbulb className="text-yellow-400" size={25} />

                <h3 className="text-xl font-bold">
                  Mengenal Derajat Ionisasi (α)
                </h3>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Derajat ionisasi merupakan perbandingan jumlah
                molekul yang mengalami ionisasi terhadap jumlah
                molekul mula-mula.
              </p>

              <div className="my-6 rounded-2xl bg-white/10 p-5 text-center">
                <p className="text-sm text-slate-300">
                  Rumus Derajat Ionisasi
                </p>

                <p className="mt-3 text-xl font-bold md:text-2xl">
                  α = Jumlah zat terionisasi / Jumlah zat mula-mula
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">

                {[
                  {
                    title: "Elektrolit Kuat",
                    value: "α = 1",
                    color: "text-green-400",
                  },
                  {
                    title: "Elektrolit Lemah",
                    value: "0 < α < 1",
                    color: "text-yellow-400",
                  },
                  {
                    title: "Non-Elektrolit",
                    value: "α = 0",
                    color: "text-red-400",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl bg-white/10 p-4 text-center"
                  >
                    <p className="text-xs text-slate-300">
                      {item.title}
                    </p>

                    <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}

              </div>

            </div>

            <button
              onClick={() => setActiveTab("kuat" as TabId)}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Pelajari Elektrolit Kuat
              <ArrowRight size={18} />
            </button>

          </section>
        )}

        {/* ======================== */}
        {/* TAB 2: ELEKTROLIT KUAT */}
        {/* ======================== */}

        {activeTab === "kuat" && (

          <section className="space-y-8">

            <SectionHeading
              eyebrow="02 — Strong Electrolyte"
              title="Larutan Elektrolit Kuat"
              description="Mengapa beberapa larutan dapat menghantarkan listrik dengan sangat baik? Mari pahami karakteristik elektrolit kuat."
            />

            <div className="rounded-3xl border border-green-200 bg-green-50 p-6 md:p-8">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Zap size={25} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-green-700">
                    Strong Electrolyte
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    Apa Itu Elektrolit Kuat?
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-8 text-slate-700">
                Elektrolit kuat merupakan zat yang mengalami
                ionisasi atau disosiasi hampir sempurna ketika
                dilarutkan dalam air. Akibatnya, larutan
                mengandung banyak ion bergerak yang dapat
                membawa muatan listrik.
              </p>

              <div className="mt-5 inline-flex rounded-xl bg-green-600 px-5 py-3 text-lg font-bold text-white">
                α = 1
              </div>

            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Karakteristik Elektrolit Kuat
            </h3>

            <div className="grid gap-5 md:grid-cols-3">

              <InfoCard
                icon={<Lightbulb size={22} />}
                title="Lampu Terang"
              >
                Lampu umumnya menyala terang karena banyaknya
                ion bergerak yang membawa muatan listrik.
              </InfoCard>

              <InfoCard
                icon={<Droplets size={22} />}
                title="Banyak Gelembung"
              >
                Gelembung gas umumnya mudah diamati pada
                elektroda akibat reaksi elektrolisis.
              </InfoCard>

              <InfoCard
                icon={<Atom size={22} />}
                title="Banyak Ion"
              >
                Sebagian besar zat terlarut menghasilkan
                ion melalui ionisasi atau disosiasi
                yang hampir sempurna.
              </InfoCard>

            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Contoh Elektrolit Kuat
            </h3>

            <div className="grid gap-5 md:grid-cols-3">

              <InfoCard
                icon={<FlaskConical size={22} />}
                title="Asam Kuat"
              >
                <ul className="space-y-2">
                  <li>• HCl — Asam klorida</li>
                  <li>• HNO₃ — Asam nitrat</li>
                  <li>• H₂SO₄ — Asam sulfat</li>
                </ul>
              </InfoCard>

              <InfoCard
                icon={<Droplets size={22} />}
                title="Basa Kuat"
              >
                <ul className="space-y-2">
                  <li>• NaOH — Natrium hidroksida</li>
                  <li>• KOH — Kalium hidroksida</li>
                  <li>• Ba(OH)₂ — Barium hidroksida</li>
                </ul>
              </InfoCard>

              <InfoCard
                icon={<Atom size={22} />}
                title="Garam"
              >
                <ul className="space-y-2">
                  <li>• NaCl — Natrium klorida</li>
                  <li>• KCl — Kalium klorida</li>
                  <li>• KNO₃ — Kalium nitrat</li>
                </ul>
              </InfoCard>

            </div>

            <EquationCard
              label="Contoh Disosiasi NaCl"
              equation={
                <>
                  NaCl(s) → Na<sup>+</sup>(aq) +
                  Cl<sup>-</sup>(aq)
                </>
              }
              explanation="Natrium klorida terdisosiasi menjadi ion natrium dan ion klorida ketika dilarutkan dalam air."
            />

            <div className="rounded-2xl border border-green-200 bg-white p-5">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={21} />

                <h3 className="font-bold">
                  Kesimpulan
                </h3>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Elektrolit kuat mampu menghantarkan arus listrik
                dengan baik karena menghasilkan banyak ion
                bergerak melalui proses ionisasi atau disosiasi
                yang hampir sempurna.
              </p>
            </div>

          </section>
        )}

        {/* ======================== */}
        {/* TAB 3: ELEKTROLIT LEMAH */}
        {/* ======================== */}

        {activeTab === "lemah" && (

          <section className="space-y-8">

            <SectionHeading
              eyebrow="03 — Weak Electrolyte"
              title="Larutan Elektrolit Lemah"
              description="Tidak semua larutan elektrolit menghasilkan ion dalam jumlah besar. Beberapa zat hanya mengalami ionisasi sebagian."
            />

            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 md:p-8">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <Zap size={25} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-yellow-700">
                    Weak Electrolyte
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    Apa Itu Elektrolit Lemah?
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-8 text-slate-700">
                Elektrolit lemah merupakan zat yang hanya
                mengalami ionisasi sebagian ketika dilarutkan
                dalam air. Sebagian partikel membentuk ion,
                sedangkan sebagian lainnya tetap sebagai
                molekul netral.
              </p>

              <div className="mt-5 inline-flex rounded-xl bg-yellow-500 px-5 py-3 text-lg font-bold text-white">
                0 &lt; α &lt; 1
              </div>

            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Karakteristik Elektrolit Lemah
            </h3>

            <div className="grid gap-5 md:grid-cols-3">

              <InfoCard
                icon={<Lightbulb size={22} />}
                title="Lampu Redup"
              >
                Lampu umumnya menyala redup karena jumlah
                ion bergerak lebih sedikit dibandingkan
                elektrolit kuat pada kondisi sebanding.
              </InfoCard>

              <InfoCard
                icon={<Droplets size={22} />}
                title="Sedikit Gelembung"
              >
                Gelembung gas dapat terbentuk dalam jumlah
                lebih sedikit atau sulit diamati.
              </InfoCard>

              <InfoCard
                icon={<Atom size={22} />}
                title="Ion dan Molekul"
              >
                Larutan mengandung ion hasil ionisasi
                sebagian dan molekul yang belum terionisasi.
              </InfoCard>

            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Contoh Elektrolit Lemah
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <InfoCard
                icon={<FlaskConical size={22} />}
                title="Asam Lemah"
              >
                <ul className="space-y-2">
                  <li>• CH₃COOH — Asam asetat</li>
                  <li>• HF — Asam fluorida</li>
                  <li>• H₂CO₃ — Asam karbonat</li>
                </ul>
              </InfoCard>

              <InfoCard
                icon={<Droplets size={22} />}
                title="Basa Lemah"
              >
                <ul className="space-y-2">
                  <li>• NH₃ — Amonia</li>
                  <li>• CH₃NH₂ — Metilamina</li>
                </ul>
              </InfoCard>

            </div>

            <EquationCard
              label="Contoh Ionisasi Asam Asetat"
              equation={
                <>
                  CH<sub>3</sub>COOH + H<sub>2</sub>O ⇌
                  H<sub>3</sub>O<sup>+</sup> +
                  CH<sub>3</sub>COO<sup>-</sup>
                </>
              }
              explanation="Asam asetat hanya mengalami ionisasi sebagian. Tanda panah bolak-balik menunjukkan bahwa reaksi mencapai kesetimbangan."
            />

            <EquationCard
              label="Contoh Ionisasi Amonia"
              equation={
                <>
                  NH<sub>3</sub> + H<sub>2</sub>O ⇌
                  NH<sub>4</sub><sup>+</sup> +
                  OH<sup>-</sup>
                </>
              }
              explanation="Amonia bereaksi dengan air menghasilkan ion amonium dan hidroksida melalui proses kesetimbangan."
            />

            <div className="rounded-2xl border border-yellow-200 bg-white p-5">
              <div className="flex items-center gap-2 text-yellow-700">
                <CheckCircle2 size={21} />

                <h3 className="font-bold">
                  Kesimpulan
                </h3>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Elektrolit lemah tetap dapat menghantarkan
                arus listrik karena menghasilkan ion, tetapi
                jumlah ionnya relatif lebih sedikit akibat
                proses ionisasi yang hanya berlangsung sebagian.
              </p>
            </div>

          </section>
        )}

        {/* ======================== */}
        {/* TAB 4: NON ELEKTROLIT */}
        {/* ======================== */}

        {activeTab === "non" && (

          <section className="space-y-8">

            <SectionHeading
              eyebrow="04 — Non-Electrolyte"
              title="Larutan Non-Elektrolit"
              description="Beberapa zat dapat larut dalam air tanpa menghasilkan ion. Inilah alasan mengapa tidak semua larutan mampu menghantarkan listrik."
            />

            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 md:p-8">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Info size={25} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-red-600">
                    Non-Electrolyte
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    Apa Itu Non-Elektrolit?
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-8 text-slate-700">
                Non-elektrolit merupakan zat yang ketika
                dilarutkan dalam air tidak menghasilkan
                ion dalam jumlah berarti. Partikel zat
                terlarut tetap berupa molekul netral.
              </p>

              <div className="mt-5 inline-flex rounded-xl bg-red-500 px-5 py-3 text-lg font-bold text-white">
                α = 0
              </div>

            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Karakteristik Non-Elektrolit
            </h3>

            <div className="grid gap-5 md:grid-cols-3">

              <InfoCard
                icon={<Lightbulb size={22} />}
                title="Lampu Mati"
              >
                Lampu tidak menyala karena tidak terdapat
                ion bergerak dalam jumlah berarti untuk
                menghantarkan arus listrik.
              </InfoCard>

              <InfoCard
                icon={<Droplets size={22} />}
                title="Tidak Ada Gelembung"
              >
                Tidak terlihat gelembung gas akibat
                elektrolisis larutan dalam kondisi
                pengujian biasa.
              </InfoCard>

              <InfoCard
                icon={<Atom size={22} />}
                title="Molekul Netral"
              >
                Zat terlarut tetap dalam bentuk molekul
                netral meskipun telah larut dalam air.
              </InfoCard>

            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Contoh Non-Elektrolit
            </h3>

            <div className="grid gap-5 md:grid-cols-3">

              <InfoCard
                icon={<Droplets size={22} />}
                title="Larutan Gula"
              >
                Gula seperti sukrosa dan glukosa larut
                dalam air sebagai molekul netral.
                Gula tidak menghasilkan ion dalam
                jumlah berarti.
              </InfoCard>

              <InfoCard
                icon={<FlaskConical size={22} />}
                title="Etanol"
              >
                Etanol (C₂H₅OH) merupakan senyawa kovalen
                yang tidak mengalami ionisasi secara
                berarti ketika bercampur dengan air.
              </InfoCard>

              <InfoCard
                icon={<Atom size={22} />}
                title="Urea"
              >
                Urea [CO(NH₂)₂] dapat larut dalam air,
                tetapi tetap berada dalam bentuk
                molekul netral.
              </InfoCard>

            </div>

            <EquationCard
              label="Contoh Pelarutan Gula"
              equation={
                <>
                  C<sub>12</sub>H<sub>22</sub>O<sub>11</sub>(s)
                  → C<sub>12</sub>H<sub>22</sub>O<sub>11</sub>(aq)
                </>
              }
              explanation="Gula larut dalam air, tetapi molekulnya tidak terurai menjadi ion. Proses ini merupakan pelarutan, bukan ionisasi."
            />

            <div className="rounded-2xl border border-red-200 bg-white p-5">
              <div className="flex items-center gap-2 text-red-600">
                <CheckCircle2 size={21} />

                <h3 className="font-bold">
                  Kesimpulan
                </h3>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Non-elektrolit dapat larut dalam air, tetapi
                tidak menghasilkan ion bergerak dalam jumlah
                berarti. Oleh sebab itu, larutannya tidak
                menghantarkan listrik secara berarti.
              </p>
            </div>

          </section>
        )}

        {/* ======================== */}
        {/* TAB 5: PERBANDINGAN */}
        {/* ======================== */}

        {activeTab === "perbandingan" && (

          <section className="space-y-8">

            <SectionHeading
              eyebrow="05 — Chemistry Comparison"
              title="Perbandingan Ketiga Jenis Larutan"
              description="Setelah mempelajari ketiga jenis larutan, sekarang mari bandingkan karakteristiknya untuk memahami perbedaan masing-masing."
            />

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px] border-collapse text-left">

                  <thead>
                    <tr className="bg-slate-900 text-white">

                      <th className="p-5 text-sm font-bold">
                        Aspek
                      </th>

                      <th className="p-5 text-sm font-bold">
                        Elektrolit Kuat
                      </th>

                      <th className="p-5 text-sm font-bold">
                        Elektrolit Lemah
                      </th>

                      <th className="p-5 text-sm font-bold">
                        Non-Elektrolit
                      </th>

                    </tr>
                  </thead>

                  <tbody className="text-sm text-slate-600">

                    {[
                      [
                        "Sifat ionisasi",
                        "Hampir sempurna",
                        "Sebagian",
                        "Tidak menghasilkan ion berarti",
                      ],
                      [
                        "Derajat ionisasi",
                        "α = 1",
                        "0 < α < 1",
                        "α = 0",
                      ],
                      [
                        "Jumlah ion",
                        "Banyak",
                        "Relatif sedikit",
                        "Tidak ada dalam jumlah berarti",
                      ],
                      [
                        "Gejala lampu",
                        "Terang",
                        "Redup atau tidak menyala",
                        "Mati",
                      ],
                      [
                        "Gejala gelembung",
                        "Umumnya banyak",
                        "Sedikit atau sulit diamati",
                        "Tidak terlihat",
                      ],
                      [
                        "Contoh zat",
                        "NaCl, HCl, NaOH",
                        "CH₃COOH, NH₃, HF",
                        "Gula, etanol, urea",
                      ],
                    ].map((row, index) => (

                      <tr
                        key={index}
                        className="border-b border-slate-100 transition hover:bg-sky-50/50"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`p-5 leading-6 ${cellIndex === 0
                                ? "font-bold text-slate-900"
                                : ""
                              }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              <div className="border-t border-slate-100 bg-slate-50 p-4 text-xs leading-6 text-slate-500">
                Catatan: Gejala lampu dan gelembung merupakan
                indikator kualitatif. Hasil percobaan dipengaruhi
                konsentrasi, suhu, elektroda, dan sensitivitas alat.
              </div>

            </div>

            {/* RANGKUMAN */}
            <div className="rounded-3xl bg-sky-600 p-6 text-white md:p-8">

              <div className="flex items-center gap-3">
                <Sparkles size={25} />

                <h3 className="text-xl font-bold">
                  Rangkuman Pembelajaran
                </h3>
              </div>

              <div className="mt-6 space-y-4">

                {[
                  "Elektrolit kuat menghasilkan ion melalui proses ionisasi atau disosiasi yang hampir sempurna.",
                  "Elektrolit lemah hanya menghasilkan ion melalui proses ionisasi sebagian.",
                  "Non-elektrolit tidak menghasilkan ion dalam jumlah berarti ketika dilarutkan dalam air.",
                  "Kemampuan larutan menghantarkan listrik bergantung pada keberadaan dan pergerakan ion.",
                ].map((item, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl bg-white/10 p-4"
                  >
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-sky-200"
                    />

                    <p className="text-sm leading-7 text-white">
                      {item}
                    </p>
                  </div>

                ))}

              </div>

            </div>

          </section>
        )}

        {/* ======================== */}
        {/* CTA SIMULASI LAB */}
        {/* ======================== */}

        <section className="mt-14 overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-100 p-6 md:p-9">

          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

            <div className="max-w-xl">

              <div className="mb-3 flex items-center gap-2 text-sky-700">
                <FlaskConical size={22} />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Virtual Laboratory
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                Siap Menguji Pengetahuanmu?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Sekarang saatnya melihat bagaimana larutan
                elektrolit kuat, elektrolit lemah, dan
                non-elektrolit berperilaku dalam eksperimen
                uji daya hantar listrik.
              </p>

            </div>

            <button
              onClick={onStartLab}
              disabled={!onStartLab}
              className="flex shrink-0 items-center gap-3 rounded-xl bg-sky-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-1 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mulai Simulasi Lab
              <ChevronRight size={20} />
            </button>

          </div>

        </section>

        {/* FOOTNOTE */}
        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">

          <Info
            size={20}
            className="mt-0.5 shrink-0 text-sky-600"
          />

          <p className="text-xs leading-6 text-slate-500">
            Materi ini disusun sebagai media pembelajaran
            Kimia Kelas X SMA. Simulasi dan ilustrasi yang
            digunakan merupakan representasi konseptual
            untuk membantu memahami fenomena daya hantar
            listrik larutan.
          </p>

        </div>

      </main>

    </div>
  );
};

export default Materi;