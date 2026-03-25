export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f0f0f0] p-4 md:p-8 lg:p-12 font-bold text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="relative inline-block">
          <div className="bg-pink-400 border-4 border-black px-8 py-4 -rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 transition-transform cursor-default">
            <h1 className="font-black text-4xl md:text-6xl uppercase tracking-tighter">
              Privacy Policy
            </h1>
          </div>
          <div className="mt-8 bg-white border-4 border-black px-4 py-2 inline-block rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm">
            Last updated: January 14, 2026
          </div>
        </header>

        {/* Intro Section */}
        <section className="bg-cyan-200 border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          <p className="text-xl md:text-2xl font-black leading-tight mb-4">
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information and tells You
            about Your privacy rights.
          </p>
          <p className="text-lg">
            We use Your Personal data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>
        </section>

        {/* Interpretation Section */}
        <div className="grid gap-8">
          <section className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="bg-yellow-300 border-4 border-black px-6 py-2 inline-block font-black text-2xl uppercase mb-6 -ml-10 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Interpretation and Definitions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-black text-xl underline decoration-pink-500 decoration-4 mb-2">
                  Interpretation
                </h3>
                <p>
                  The words of which the initial letter is capitalized have
                  meanings defined under the following conditions. The following
                  definitions shall have the same meaning regardless of whether
                  they appear in singular or in plural.
                </p>
              </div>

              <div>
                <h3 className="font-black text-xl underline decoration-cyan-500 decoration-4 mb-4">
                  Definitions
                </h3>
                <p className="mb-4">For the purposes of this Privacy Policy:</p>
                <ul className="grid gap-4">
                  {[
                    {
                      title: "Account",
                      desc: "A unique account created for You to access our Service or parts of our Service.",
                    },
                    {
                      title: "Affiliate",
                      desc: "An entity that controls, is controlled by or is under common control with a party (50%+ ownership).",
                    },
                    {
                      title: "Application",
                      desc: "Refers to Uniserve Campus Platform, the software program provided by the Company.",
                    },
                    {
                      title: "Company",
                      desc: 'Refers to Uniserve (referred to as either "the Company", "We", "Us" or "Our").',
                    },
                    {
                      title: "Cookies",
                      desc: "Small files placed on Your device containing details of Your browsing history.",
                    },
                    {
                      title: "Country",
                      desc: "Refers to: California, United States.",
                    },
                    {
                      title: "Device",
                      desc: "Any device that can access the Service such as a computer, cellphone, or tablet.",
                    },
                    {
                      title: "Personal Data",
                      desc: "Any information relates to an identified or identifiable individual.",
                    },
                    {
                      title: "Service",
                      desc: "Refers to the Application or the Website or both.",
                    },
                    {
                      title: "Service Provider",
                      desc: "Third-party companies or individuals who process data on behalf of the Company.",
                    },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="bg-purple-100 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-transform"
                    >
                      <span className="font-black uppercase">
                        {item.title}:
                      </span>{" "}
                      {item.desc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Data Collection Section */}
          <section className="bg-lime-200 border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <h2 className="bg-pink-400 border-4 border-black px-6 py-2 inline-block font-black text-2xl uppercase mb-6 -ml-10 -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Collecting & Using Data
            </h2>

            <div className="space-y-8">
              <div className="bg-white border-2 border-black p-4 inline-block">
                <h3 className="font-black text-xl mb-4 uppercase">
                  Types of Data Collected
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-black pl-4">
                    <h4 className="font-black text-lg">Personal Data</h4>
                    <p>
                      While using Our Service, We may ask You for: Email
                      address, First/Last name, and Usage Data.
                    </p>
                  </div>
                  <div className="border-l-4 border-black pl-4">
                    <h4 className="font-black text-lg">Usage Data</h4>
                    <p>
                      Collected automatically: IP address, browser type, browser
                      version, pages visited, and diagnostic data.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-black text-xl mb-4 underline decoration-white decoration-4">
                  Social Media Services
                </h3>
                <p className="mb-4">
                  The Company allows You to log in through the following
                  services:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Google",
                    "Facebook",
                    "Instagram",
                    "Twitter",
                    "LinkedIn",
                  ].map((social) => (
                    <span
                      key={social}
                      className="bg-black text-white px-4 py-1 font-black uppercase text-sm border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    >
                      {social}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Cookies Section */}
          <section className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="bg-orange-300 border-4 border-black px-6 py-2 inline-block font-black text-2xl uppercase mb-6 -ml-10 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
              Tracking & Cookies
            </h2>
            <p className="mb-6">
              We use Cookies and similar tracking technologies (beacons, tags,
              scripts) to track activity and store certain information.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-100 border-2 border-black p-4 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black mb-2">Necessary Cookies</h4>
                <p className="text-sm">
                  Essential to provide services and avoid fraudulent use of
                  accounts.
                </p>
              </div>
              <div className="bg-pink-100 border-2 border-black p-4 -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black mb-2">Cookies Policy</h4>
                <p className="text-sm">
                  Identifies if users have accepted the use of cookies.
                </p>
              </div>
              <div className="bg-yellow-100 border-2 border-black p-4 -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black mb-2">Functionality Cookies</h4>
                <p className="text-sm">
                  Remembers choices You make (login details, language).
                </p>
              </div>
            </div>
          </section>

          {/* Retention Section */}
          <section className="bg-indigo-400 border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-white -rotate-1">
            <h2 className="bg-white border-4 border-black px-6 py-2 inline-block font-black text-2xl uppercase mb-6 -ml-10 rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
              Data Management
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-xl mb-2 italic underline underline-offset-4">
                  Retention of Data
                </h3>
                <p>
                  We retain Your Personal Data only for as long as necessary to
                  comply with legal obligations and resolve disputes.
                </p>
              </div>
              <div>
                <h3 className="font-black text-xl mb-2 italic underline underline-offset-4">
                  Transfer of Data
                </h3>
                <p>
                  Your information is processed at our operating offices. Your
                  submission of data represents Your agreement to that transfer.
                </p>
              </div>
              <div>
                <h3 className="font-black text-xl mb-2 italic underline underline-offset-4">
                  Delete Data
                </h3>
                <p>
                  You have the right to delete or request assistance in deleting
                  Personal Data collected about You.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Section */}
          <section className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="bg-black text-white border-4 border-black px-6 py-2 inline-block font-black text-2xl uppercase mb-6 -ml-10 -rotate-1 shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]">
              Legal Disclosure
            </h2>
            <p className="mb-4 font-bold">
              The Company may disclose Your Data in good faith belief that such
              action is necessary to:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of the Company</li>
              <li>Prevent or investigate possible wrongdoing</li>
              <li>Protect the personal safety of Users</li>
              <li>Protect against legal liability</li>
            </ul>
          </section>

          {/* Contact Section */}
          <footer className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
            <h2 className="font-black text-3xl uppercase mb-4">Questions?</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, You can
              contact us:
            </p>
            <a
              href="mailto:hello@nienalabs.com"
              className="inline-block bg-black text-white px-8 py-4 font-black text-xl border-4 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              EMAIL US &rarr;
            </a>
          </footer>
        </div>
      </div>
    </main>
  );
}
