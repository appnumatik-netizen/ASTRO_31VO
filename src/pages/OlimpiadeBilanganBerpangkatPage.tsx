import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Helper function to render text with LaTeX
const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - BILANGAN BERPANGKAT",
  sections: [
    {
      heading: "A. Definisi Bilangan Berpangkat",
      content: `Secara simbol definisi bilangan berpangkat (eksponen) dapat kita tuliskan seperti berikut ini:

$a^n = \\underbrace{a \\times a \\times a \\times ... \\times a}_{n}$

n: Bilangan pangkat (eksponen), dimana n adalah bilangan bulat positif
a: Bilangan Pokok (basis)

Contoh:
$3^4 = 3 \\times 3 \\times 3 \\times 3 = 81$`
    },
    {
      heading: "B. Sifat-Sifat Bilangan Berpangkat (Eksponen)",
      content: `1. $a^m \\times a^n = a^{m+n}$

2. $a^m : a^n = a^{m-n}$

3. $(a^m)^n = a^{m \\times n}$

4. $(a \\times b)^n = a^n \\times b^n$

5. $\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$

6. $a^0 = 1$, dengan $a \\neq 0$

7. $a^{-n} = \\frac{1}{a^n}$

8. $\\sqrt[n]{a} = a^{\\frac{1}{n}}$

9. $\\sqrt[n]{a^m} = a^{\\frac{m}{n}}$`
    },
    {
      heading: "C. Persamaan Eksponen",
      content: `$a^{f(x)} = a^p$ maka $f(x) = p$`
    },
    {
      heading: "D. Bentuk $(a+b)^2$ dan $(a+b)^3$",
      content: `1. $(a+b)^2 = a^2 + 2ab + b^2$

2. $(a-b)^2 = a^2 - 2ab + b^2$

3. $(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3 = a^3 + b^3 + 3ab(a+b)$

4. $(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3 = a^3 - b^3 - 3ab(a-b)$`
    },
  ]
};

const latihanDasar = [
  { no: 1, soal: "Nilai dari $(-4)^3 + (-4)^2 + (-4)^1 + (-4)^0$ adalah ...", options: ["A. 75", "B. 66", "C. -51", "D. -52"] },
  { no: 2, soal: "Hasil dari $(-1)^1 + (-1)^2 + (-1)^3 + ... + (-1)^{100}$ adalah...", options: ["A. 0", "B. -100", "C. 100", "D. 1"] },
  { no: 3, soal: "Hasil dari $3^{-3} + 2^{-2}$ adalah......", options: ["A. 31", "B. $\\frac{23}{108}$", "C. $-\\frac{31}{108}$", "D. $\\frac{31}{108}$"] },
  { no: 4, soal: "Hasil dari penjumlahan bilangan $(-2)^{-3} + (-2)^{-2} + (-2)^{-1} + (-2)^0 + (-2)^1 + (-2)^2$ adalah ...", options: ["A. -9", "B. 1", "C. $-5\\frac{1}{4}$", "D. $-4\\frac{1}{4}$"] },
  { no: 5, soal: "Hasil dari ekspresi $\\frac{5^2 - (-3)}{(-2)^4}$ adalah ...", options: ["A. 45", "B. 43", "C. $\\frac{43}{4}$", "D. $\\frac{37}{4}$"] },
  { no: 6, soal: "$(x^3 \\cdot x^5)^4 \\cdot x^{-3} = ...$", options: ["A. $x^{10}$", "B. $x^{11}$", "C. $x^{15}$", "D. $x^{18}$"] },
  { no: 7, soal: "$\\frac{\\left(\\frac{1}{2}\\right)^{-1} \\cdot \\left(\\frac{1}{3}\\right)^{-1} - (0,6)^0}{\\left(\\frac{3}{2}\\right)^{-1} \\cdot (0,1)^{-1}} = ...$", options: ["A. $-\\frac{3}{2}$", "B. $-\\frac{1}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{3}{2}$"] },
  { no: 8, soal: "Hasil dari $81^{\\frac{3}{4}}$ adalah ...", options: ["A. 16", "B. 8", "C. 27", "D. 81"] },
  { no: 9, soal: "Hasil dari $243^{\\frac{3}{5}} : 3^{-1}$ adalah ...", options: ["A. 9", "B. 3", "C. 2", "D. 1"] },
  { no: 10, soal: "Hasil dari $(64^{\\frac{1}{3}})^{-\\frac{3}{2}}$ adalah ...", options: ["A. 8", "B. $\\frac{1}{8}$", "C. $-\\frac{1}{8}$", "D. -8"] },
  { no: 11, soal: "Nilai dari $\\left(\\frac{1}{32}\\right)^{-\\frac{3}{5}} \\times 9^{-\\frac{1}{2}} \\times \\left(\\frac{1}{3}\\right)^{-3}$ adalah ...", options: ["A. -6", "B. $\\frac{3}{4}$", "C. $-\\frac{3}{4}$", "D. $\\frac{1}{6}$"] },
  { no: 12, soal: "Bentuk sederhana dari $\\frac{27a^{-2}b^3}{3^{-2}a^2b^{-3}}$ adalah ...", options: ["A. $\\frac{9}{a^2b}$", "B. $\\frac{81}{a^2b^2}$", "C. $\\frac{81b^{10}}{a^2}$", "D. $\\frac{1}{81a^2b^{10}}$"] },
  { no: 13, soal: "Bentuk sederhana dari $\\left(\\frac{24^{\\frac{5}{6}} a^{\\frac{7}{3}} b^{-5} c^{-\\frac{7}{6}}}{54^{\\frac{5}{6}} a^{\\frac{1}{3}} b^{-7} c^{\\frac{1}{6}}}\\right)^6$ adalah ....", options: ["A. $\\frac{9a^{6}b^{2}}{25c}$", "B. $\\frac{9a^{12}b^{4}}{25c^2}$", "C. $\\frac{9a^{12}c^{2}}{25b^4}$", "D. $\\frac{a^{6}b^{2}}{c}\\left(\\frac{3}{5}\\right)$"] },
  { no: 14, soal: "$\\frac{36(x^2 \\cdot 2y)^2 \\cdot 12x^2 \\cdot (3y)^2}{3x^2 \\cdot 9xy \\cdot x^2y} = ...$", options: ["A. $2^8 \\cdot 3 \\cdot \\frac{x^5}{y^2}$", "B. $2^3 \\cdot 3^8 \\cdot \\frac{x^5}{y^2}$", "C. $2^8 \\cdot 3^3 \\cdot \\frac{y^5}{x^2}$", "D. $2^3 \\cdot 3^8 \\cdot \\frac{y^5}{x^2}$"] },
  { no: 15, soal: "Manakah bilangan berpangkat berikut yang paling besar?", options: ["A. $2^{5555}$", "B. $3^{4444}$", "C. $4^{3333}$", "D. $5^{2222}$"] },
  { no: 16, soal: "$\\frac{5^{4022} - 5^{4018}}{5^{4020} - 5^{4016}} = ...$", options: ["A. 3", "B. $\\frac{25}{4}$", "C. $\\frac{25}{2}$", "D. 25"] },
  { no: 17, soal: "Hasil dari $\\frac{3^{50} + 3^{48}}{3^{49} + 3^{47}}$ adalah ...", options: ["A. 3", "B. 9", "C. 27", "D. 81"] },
  { no: 18, soal: "Jika a dan b adalah bilangan bulat positif yang memenuhi $a^{2019} = 2 - b$, maka nilai $a + b$ adalah ...", options: ["A. 3", "B. 7", "C. 19", "D. 21"] },
  { no: 19, soal: "Diketahui $3 + 3^2 + 3^3 + ... + 3^n = 120$. Nilai $3n$ yang memenuhi adalah ...", options: ["A. 3", "B. 6", "C. 12", "D. 15"] },
  { no: 20, soal: "Jika nilai $(x+y)^2 = 324$ dan $(x-y)^2 = 16$, maka nilai dari $xy$ adalah ...", options: ["A. 33", "B. 55", "C. 77", "D. 99"] },
  { no: 21, soal: "Jika $n + \\frac{1}{n} = 3$ maka nilai $n^2 + \\frac{1}{n^2}$ adalah ...", options: ["A. 11", "B. 9", "C. 7", "D. 5"] },
  { no: 22, soal: "Jika $x^{\\frac{3}{5}} = 3^{\\frac{3}{5}} + 3^{\\frac{6}{5}} + 3^x$ maka nilai $x^2$ adalah ...", options: ["A. 4", "B. 5", "C. 6", "D. 7"] },
  { no: 23, soal: "Jika $\\frac{9^5 \\cdot 3^3 \\cdot 27^4}{3 \\cdot 81^n} = 27$, maka nilai $n = ...$", options: ["A. 0", "B. 2", "C. 3", "D. 4"] },
  { no: 24, soal: "Nilai $x$ yang memenuhi persamaan $3^{x^2+3} \\cdot 5^{x^2+3} = 27$ adalah ...", options: ["A. -2", "B. 0", "C. 1", "D. 2"] },
  { no: 25, soal: "Nilai $x$ yang memenuhi $16 \\cdot 4^x \\cdot 2^{x^2} = 4^{x+x^2}$ adalah ...", options: ["A. $-\\frac{8}{3}$", "B. -2", "C. $-\\frac{4}{3}$", "D. $-\\frac{2}{3}$"] },
  { no: 26, soal: "If $x^{\\frac{1}{3}} + x^{-\\frac{1}{3}} = 90$ then $x + \\frac{1}{x} = ...$", options: ["A. $\\frac{4}{3}$", "B. $\\frac{10}{3}$", "C. $\\frac{28}{3}$", "D. $\\frac{82}{3}$"] },
  { no: 27, soal: "If $2^{2^{x-1}} = 2^{2^x} - 8$, then $x = ...$", options: ["A. 5", "B. 6", "C. 7", "D. 8"] },
  { no: 28, soal: "Jika $n$ memenuhi $\\sqrt[0,25]{\\sqrt[0,25]{\\sqrt[0,25]{\\sqrt[0,25]{25^{25}...25^{25}}}}} = 125$, maka $(n-3)(n+2) = ...$", options: ["A. 24", "B. 26", "C. 28", "D. 32"] },
  { no: 29, soal: "Jika $9^{4x} : 3^{2x} = 2.187$, maka nilai dari $x$ adalah ...", options: ["A. $\\frac{6}{7}$", "B. $\\frac{7}{6}$", "C. $-\\frac{6}{7}$", "D. $-\\frac{7}{6}$"] },
  { no: 30, soal: "Nilai dari $\\frac{(2018^2 - 2017^2) + (2018^2 + 2017^2)}{2017 + 2018}$ adalah ...", options: ["A. 1", "B. 2", "C. 4", "D. 6"] },
  { no: 31, soal: "Jika $n^2 + \\frac{1}{n^2} = 11$, maka nilai $n - \\frac{1}{n}$ adalah ...", options: ["A. 3", "B. $\\sqrt{11}$", "C. $\\sqrt{15}$", "D. 4"] },
  { no: 32, soal: "Jika $x^4 + x^{-4} = 7$, maka nilai $x^8 + x^{-8} = ...$", options: ["A. 18", "B. 27", "C. 49", "D. 81"] },
  { no: 33, soal: "Jika $\\frac{2^{\\frac{1}{2}} + 2^{-\\frac{1}{2}}}{2^{\\frac{1}{3}} + 2^{-\\frac{1}{3}}} = 4^x$, maka $x = ...$", options: ["A. $\\frac{1}{3}$", "B. $\\frac{5}{12}$", "C. $\\frac{1}{2}$", "D. $\\frac{2}{3}$"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2004 Tingkat Kota\n$4 + 4^4 + 4^{44} + 4^{444} = ...$", options: ["A. $2^7$", "B. $2^{10}$", "C. $10^{34}$", "D. $4^5$", "E. $5^{12}$"] },
  { no: 2, soal: "OSN Matematika 2007 Tingkat Kota\nUrutan bilangan-bilangan $2^{5555}$, $5^{2222}$ dan $3^{3333}$ yang terkecil sampai terbesar adalah ...", options: ["A. $2^{5555}$, $5^{2222}$ dan $3^{3333}$", "B. $5^{2222}$, $3^{3333}$ dan $2^{5555}$", "C. $3^{3333}$, $2^{5555}$ dan $5^{2222}$", "D. $5^{2222}$, $2^{5555}$ dan $3^{3333}$", "E. $5^{2222}$, $3^{3333}$ dan $2^{5555}$"] },
  { no: 3, soal: "OSN Matematika 2007 Tingkat Kota\nJumlah semua angka pada bilangan $2^{2004} \\cdot 5^{2003}$ adalah ...", options: [] },
  { no: 4, soal: "OSN Matematika 2009 Tingkat Kota\nNilai $x$ yang memenuhi persamaan $\\left(\\frac{24}{39}\\right)^{x^2-1} \\cdot \\left(\\frac{13}{8}\\right)^{3x} = \\frac{3}{2}$ adalah ...", options: ["A. $-5\\frac{1}{2}$", "B. $-1\\frac{7}{9}$", "C. $1\\frac{7}{9}$", "D. $5\\frac{1}{3}$"] },
  { no: 5, soal: "OSN Matematika 2010 Tingkat Provinsi\nJika $3996 = p^s \\cdot q^t \\cdot r^u$ dengan $p$, $q$, $r$ adalah bilangan prima. Maka nilai $p + q + r + s + t + u$ adalah ...", options: [] },
  { no: 6, soal: "OSN Matematika 2011 Tingkat Kota\nUrutan bilangan-bilangan $2^{4444}$, $3^{3333}$ dan $4^{2222}$ yang terkecil sampai terbesar adalah ...", options: ["A. $2^{4444}$, $4^{2222}$ dan $3^{3333}$", "B. $2^{4444}$, $3^{3333}$ dan $4^{2222}$", "C. $3^{3333}$, $4^{2222}$ dan $2^{4444}$", "D. $4^{2222}$, $3^{3333}$ dan $2^{4444}$", "E. $3^{3333}$, $2^{4444}$ dan $4^{2222}$"] },
  { no: 7, soal: "OSN Matematika 2011 Tingkat Kota\nDiketahui $\\sqrt{2+\\sqrt{2+\\sqrt{2+x}}} = x$. Nilai $x = ...$", options: ["A. 1", "B. 2", "C. $\\sqrt{2}$", "D. 3", "E. $\\sqrt{3}$"] },
  { no: 8, soal: "OSN Matematika 2011 Tingkat Kota\nJika $(3+4^2)(3^2+4^4)(3^4+4^8)(3^8+4^{16})(3^{16}+4^{32}) = 4^x - 3^y$. Maka $x - y = ...$", options: [] },
  { no: 9, soal: "OSN Matematika 2014 Tingkat Kota\nJika $3^n$ adalah faktor dari $18^{10}$, maka bilangan bulat terbesar $n$ yang mungkin adalah ...", options: ["A. 10", "B. 15", "C. 18", "D. 20"] },
  { no: 10, soal: "OSN Matematika 2014 Tingkat Kota\nBanyak pasangan $(x, y)$ dengan $x$ dan $y$ bilangan asli memenuhi $2^x = y^2 + 100$ adalah ...", options: ["A. 0", "B. 1", "C. 2", "D. 3"] },
  { no: 11, soal: "OSN Matematika 2014 Tingkat Kota\nBentuk paling sederhana dari $\\frac{3^{2014} - 3^{2011} + 130}{3^{2011} + 35}$ adalah ...", options: [] },
  { no: 12, soal: "OSN Matematika 2015 Tingkat Kota\nNilai $n$ yang memungkinkan agar $2^{10} + 2^{13} + 2^n$ merupakan kuadrat sempurna adalah ...", options: ["A. 5", "B. 7", "C. 12", "D. 14"] },
  { no: 13, soal: "OSN Matematika 2016 Tingkat Kota\nNilai dari $\\sqrt{(2017^2 - 2016^2)(2020^2 - 2015^2)} - 16^2$ adalah ...", options: ["A. 2012", "B. 2013", "C. 2014", "D. 2015"] },
  { no: 14, soal: "OSN Matematika 2016 Tingkat Kota\nBilangan bulat terbesar $n$ agar $2 \\times 6 \\times 10 \\times 14 \\times ... \\times 199$ dapat dibagi oleh $6^n$ adalah ...", options: [] },
  { no: 15, soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui $x$, $y$ dan $z$ adalah tiga bilangan bulat positif. Tiga bilangan terurut $(x, y, z)$ yang memenuhi $(x+y)^z = 256^2$ ada sebanyak ...", options: ["A. 6", "B. 90", "C. 91", "D. 128"] },
  { no: 16, soal: "OSN Matematika 2020 Tingkat Kota\nJika $x_1$ dan $x_2$ dengan $x_1 < x_2$ adalah solusi yang memenuhi persamaan $x^{(x^x)} = (x^x)^x$, maka $\\frac{x_1^2 + x_2^2}{4} - \\frac{x_1 x_2}{10} + 25$ adalah ...", options: ["A. 1", "B. 4", "C. 64", "D. 19"] },
  { no: 17, soal: "OSN Matematika 2020 Tingkat Kota\nDiketahui tiga bilangan terurut $(x, y, z)$ dengan $x$, $y$ dan $z$ adalah bilangan bulat positif yang memenuhi $(xy+1)^{y+z} = 729^{z-1}$. Jika himpunan selesainya adalah $\\{(x_1, y_1, z_1), (x_2, y_2, z_2), ..., (x_n, y_n, z_n)\\}$, maka nilai dari $(x_1 + x_2 + ... + x_n) + (y_1 + y_2 + ... + y_n) + (z_1 + z_2 + ... + z_n)$ adalah ...", options: ["A. 17", "B. 18", "C. 24", "D. 29"] },
  { no: 18, soal: "OSN Matematika 2022 Tingkat Kota\nJika $a$, $b$, $c$, $d$ bilangan-bilangan asli sehingga $a^5 = b^2$, $c^4 = d^3$, dan $c - a = 19$\nMaka nilai dari $d - b$ adalah ...", options: ["A. 757", "B. 243", "C. 1000", "D. 81"] },
  { no: 19, soal: "OSN Matematika 2024 Tingkat Kota\nJika $x^3 + \\frac{1}{x^3} = 18$ dan $x > 0$, maka nilai dari $x^7 + \\frac{1}{x^7} + 7$ adalah ...", options: ["A. 845", "B. 850", "C. 855", "D. 860"] },
];

const OlimpiadeBilanganBerpangkatPage = () => {
  const navigate = useNavigate();
  const [expandedMateri, setExpandedMateri] = useState(true);
  const [expandedLatihan, setExpandedLatihan] = useState(false);
  const [expandedOlimpiade, setExpandedOlimpiade] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          BILANGAN BERPANGKAT
        </h1>
        <p className="text-white/60 text-sm text-center mb-4 font-body">
          Olimpiade Matematika - Intensif 3
        </p>
        <p className="text-white/40 text-xs text-center mb-8 font-body italic">
          Irawan Sutiawan, M.Pd
        </p>

        {/* MATERI SECTION */}
        <div className="mb-6 bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => { playPopSound(); setExpandedMateri(!expandedMateri); }}
          >
            <span className="font-display text-lg text-accent">{materiSection.title}</span>
            {expandedMateri ? <ChevronUp className="w-5 h-5 text-accent" /> : <ChevronDown className="w-5 h-5 text-accent" />}
          </button>
          {expandedMateri && (
            <div className="px-5 pb-5 space-y-6">
              {materiSection.sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-display text-primary mb-3">{section.heading}</h3>
                  <div className="text-white/80 font-body text-sm whitespace-pre-line leading-relaxed">
                    {section.content.split('\n').map((line, lineIdx) => (
                      <div key={lineIdx} className="mb-1">
                        {renderWithLatex(line)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LATIHAN DASAR SECTION */}
        <div className="mb-6 bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => { playPopSound(); setExpandedLatihan(!expandedLatihan); }}
          >
            <span className="font-display text-lg text-accent">LATIHAN DASAR</span>
            {expandedLatihan ? <ChevronUp className="w-5 h-5 text-accent" /> : <ChevronDown className="w-5 h-5 text-accent" />}
          </button>
          {expandedLatihan && (
            <div className="px-5 pb-5 space-y-6">
              {latihanDasar.map((item) => (
                <div key={item.no} className="border-b border-border/30 pb-4 last:border-0">
                  <div className="font-body text-sm text-white/90 mb-2">
                    <span className="text-accent font-display mr-2">{item.no}.</span>
                    {renderWithLatex(item.soal)}
                  </div>
                  {item.options.length > 0 && (
                    <div className="ml-6 space-y-1">
                      {item.options.map((opt, optIdx) => (
                        <div key={optIdx} className="text-white/70 text-sm font-body">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SOAL OLIMPIADE SECTION */}
        <div className="mb-6 bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => { playPopSound(); setExpandedOlimpiade(!expandedOlimpiade); }}
          >
            <span className="font-display text-lg text-accent">SOAL OLIMPIADE</span>
            {expandedOlimpiade ? <ChevronUp className="w-5 h-5 text-accent" /> : <ChevronDown className="w-5 h-5 text-accent" />}
          </button>
          {expandedOlimpiade && (
            <div className="px-5 pb-5 space-y-6">
              {latihanOlimpiade.map((item) => (
                <div key={item.no} className="border-b border-border/30 pb-4 last:border-0">
                  <div className="font-body text-sm text-white/90 mb-2 whitespace-pre-line">
                    <span className="text-accent font-display mr-2">{item.no}.</span>
                    {item.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {item.options.length > 0 && (
                    <div className="ml-6 space-y-1">
                      {item.options.map((opt, optIdx) => (
                        <div key={optIdx} className="text-white/70 text-sm font-body">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeBilanganBerpangkatPage;
