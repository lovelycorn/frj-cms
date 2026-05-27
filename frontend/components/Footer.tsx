import Link from "next/link";

export default function Footer(): JSX.Element {
  return (
    <footer className="border-t border-slate-200 bg-brand-950 text-slate-200">
      <div className="section-wrap grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-white">FRJ Industrial</h3>
          <p className="mt-3 text-sm text-slate-300">
            Your reliable global partner for industrial products, OEM solutions, and export-ready supply chains.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/products" className="hover:text-white">
                Product Catalog
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Email: sales@example.com</li>
            <li>Phone: +86 21 5555 8888</li>
            <li>Address: Shanghai, China</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Service Area</h4>
          <p className="mt-3 text-sm text-slate-300">North America, Europe, Middle East, and Asia Pacific.</p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} FRJ Industrial. All rights reserved.</p>
      </div>
    </footer>
  );
}
