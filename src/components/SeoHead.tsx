import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  jsonLd?: object | object[];
  type?: "website" | "article" | "product";
}

const BASE = "https://www.foquz.de";

const SeoHead = ({ title, description, path, image, jsonLd, type = "website" }: SeoHeadProps) => {
  const url = `${BASE}${path}`;
  const ogImage =
    image ||
    "https://storage.googleapis.com/gpt-engineer-file-uploads/wvNfJ4Ce37UgRcMWbgp559k9OTD2/social-images/social-1772333478095-FOQUZ_fav.webp";
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
