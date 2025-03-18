import { useState } from "react";
import { Clipboard, Share } from "lucide-react";
import "./ShareButton.css"

export default function ShareButton({ url = window.location.href, title = "Check this out!" }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Clipboard copy failed:", error);
      }
    }
  };

  return (
    <button className="share-btn" onClick={handleShare}>
      {copied ? <Clipboard size={18} /> : <Share size={18} />}
      <span>{copied ? "Link Copied!" : "Share"}</span>
    </button>
  );
}
