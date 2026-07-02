import termsMarkdown from "@/content/policies/terms-of-service.md?raw";
import { PolicyPage } from "@/components/policy-page";

export default function Terms() {
  return <PolicyPage eyebrow="Legal · Terms" title="Terms of Service" markdown={termsMarkdown} />;
}
