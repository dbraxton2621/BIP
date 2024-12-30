import { LinkPreview } from '../../types';
import cheerio from 'react-native-cheerio';

export class LinkPreviewGenerator {
    static async generatePreview(url: string): Promise<LinkPreview> {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            return {
                url,
                title: $('meta[property="og:title"]').attr('content') || $('title').text(),
                description: $('meta[property="og:description"]').attr('content') || 
                            $('meta[name="description"]').attr('content') || '',
                imageUrl: $('meta[property="og:image"]').attr('content'),
            };
        } catch (error) {
            console.error('Failed to generate link preview:', error);
            return { url, title: url, description: '' };
        }
    }
}
