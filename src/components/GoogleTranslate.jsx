import { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Prevent duplicate script loads
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Define the callback only once
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_translate_element'
        );
      };
    }
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;
