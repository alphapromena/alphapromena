import privacyHtml from "@/content/policies/privacy-policy.html?raw";
import { PolicyPage } from "@/components/policy-page";

export default function Privacy() {
  return <PolicyPage eyebrow="Legal · Privacy" title="Privacy Policy" html={privacyHtml} />;
}
