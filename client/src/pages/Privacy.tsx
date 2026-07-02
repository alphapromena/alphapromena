import privacyMarkdown from "@/content/policies/privacy-policy.md?raw";
import { PolicyPage } from "@/components/policy-page";

export default function Privacy() {
  return <PolicyPage eyebrow="Legal · Privacy" title="Privacy Policy" markdown={privacyMarkdown} />;
}
