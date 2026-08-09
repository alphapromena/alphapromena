import termsHtml from "@/content/policies/terms-of-service.html?raw";
import { PolicyPage } from "@/components/policy-page";

export default function Terms() {
  return <PolicyPage eyebrow="Legal · Terms" title="Terms of Service" html={termsHtml} />;
}
