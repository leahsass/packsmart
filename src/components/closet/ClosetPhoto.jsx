import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

const urlCache = new Map();

export default function ClosetPhoto({ fileUri, alt, className, fallback = null }) {
  const [url, setUrl] = useState(() => urlCache.get(fileUri) || null);

  useEffect(() => {
    if (!fileUri) {
      setUrl(null);
      return;
    }
    const cached = urlCache.get(fileUri);
    if (cached) {
      setUrl(cached);
      return;
    }
    let alive = true;
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 3600 })
      .then(({ signed_url }) => {
        urlCache.set(fileUri, signed_url);
        if (alive) setUrl(signed_url);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [fileUri]);

  if (!fileUri || !url) return fallback;
  return <Image src={url} alt={alt} className={className} fittingType="fill" />;
}