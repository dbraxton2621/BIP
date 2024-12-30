declare module 'react-native-cheerio' {
    interface Cheerio {
        attr(name: string): string | undefined;
        text(): string;
    }

    interface CheerioAPI {
        (selector: string): Cheerio;
    }

    interface CheerioStatic {
        load(html: string): CheerioAPI;
    }

    const cheerio: CheerioStatic;
    export default cheerio;
}
