import { useEffect } from "react";

const CrispChat = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "b9bb22ac-2209-4f65-8640-f44417e00bf1";

      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default CrispChat;
