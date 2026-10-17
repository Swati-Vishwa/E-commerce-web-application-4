import { useState } from "react";

// A placeholder imagevwhen there's no image or the URL is broken
export default function ProductImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-4xl ${className}`}>
        <img src="https://images.pexels.com/photos/16264610/pexels-photo-16264610.jpeg?_gl=1*46tm6z*_ga*NTUzMDQzOTkwLjE3ODA0NzE5MTc.*_ga_8JE65Q40S6*czE3OTE5NTM0MTgkbzMkZzEkdDE3OTE5NTM0NDUkajMzJGwwJGgw" alt="Placeholder dog image" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}