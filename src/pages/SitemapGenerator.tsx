import { useEffect } from 'react';
import { generateSitemapXML } from '@/utils/sitemap';

const SitemapGenerator = () => {
  useEffect(() => {
    const generateAndDownload = async () => {
      try {
        const sitemapXML = await generateSitemapXML();
        
        // Create blob and download
        const blob = new Blob([sitemapXML], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Also update the public sitemap.xml
        console.log('Generated sitemap:', sitemapXML);
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    generateAndDownload();
  }, []);

  return (
    <div className="p-8">
      <h1>Generating Sitemap...</h1>
      <p>The sitemap.xml file is being generated and will download automatically.</p>
    </div>
  );
};

export default SitemapGenerator;