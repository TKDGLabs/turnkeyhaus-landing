import { permanentRedirect } from "next/navigation";

type Params = {
  params: {
    slug: string;
  };
};

export default function LegacyBlogDetailPage({ params }: Params) {
  permanentRedirect(`/insights/${params.slug}`);
}
