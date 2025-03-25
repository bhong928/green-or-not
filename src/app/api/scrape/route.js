import axios from "axios"
import * as cheerio from "cheerio"

export async function POST(req) {
    try {
        const { url } = await req.json(); // parse the request body

        if (!url) {
            return new Response(JSON.stringify({ error: "No URL provided"}), { status: 404});
        }

        // Fetch the HTML content of the product page
        const { data } = await axios.get(url, {
            headers: {"User-Agent": "Mozilla/5.0"}, // Avoid bot detection
        })

        // Load the HTML into Cheerio
        const $ = cheerio.load(data);

        // Extract product Details
        const productName =
            $('meta[property="og:title"]').attr("content") ||
            $('meta[name="title"]').attr("content") ||
            $("h1").first().text().trim() ||
            "Unknown Product";

        // Extracting Product Image
        let productImage =
            $('meta[property="og:image"]').attr("content") || 
            $('meta[name="twitter:image"]').attr("content") || 
            $("#imgTagWrapperId img").attr("data-old-hires") || // Amazon-specific attribute
            $("#imgTagWrapperId img").attr("src") ||
            $("img").first().attr("src") ||
            null;

        if (productImage && productImage.startsWith("/")) {
            const urlObj = new URL(url);
            productImage = `${urlObj.origin}${productImage}`;
        }
        if (!productImage) {
            console.log("No product image found");
            productImage = 
                $("#imgTagWrapperId img").attr("data-src") ||
                $("#imgTagWrapperId img").attr("src") ||
            null;
          }

        // Extracting Product Description
        const productDescription =
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="description"]').attr("content") ||
            "No Description Available";

        return new Response(
            JSON.stringify({
                productName,
                productImage,
                productDescription,
            }),
            {status: 200}
        );
    } 
    catch (error) {
        console.error("Scraping Error:", error);
        return new Response(JSON.stringify({error: "Failed to fetch product data."}), {status: 500});
    }
}