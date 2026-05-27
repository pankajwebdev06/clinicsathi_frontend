// Standalone "How to Register Your Clinic" page.
// Re-uses the existing visual guide from /blog/guide so we follow the
// component-first rule (no content duplication) — only the route + metadata
// change for nav discoverability and SEO.
import BlogGuidePage from '../blog/guide/page';

export const metadata = {
  title: 'How to Register Your Clinic on DoctorKaDost — Step-by-Step Guide',
  description:
    'Complete walkthrough: register your clinic, add staff, check-in patients, generate tokens, and print prescriptions. Visual step-by-step guide.',
  alternates: { canonical: '/register-guide' },
};

export default function RegisterGuidePage() {
  return <BlogGuidePage />;
}
