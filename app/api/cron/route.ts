import { NextResponse } from "next/server";
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/utils";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

export const maxDuration = 10; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch all products from the database
    const products = await Product.find({});

    if (!products || products.length === 0) {
      throw new Error("No products fetched");
    }

    // Process each product asynchronously
    const updatedProducts = await Promise.all(products.map(async (currentProduct) => {
      try {
        // Scrape product data from Amazon
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) {
          // If scraping fails, return without updating the product
          return null;
        }

        // Update price history and other details
        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        // Update product in the database
        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product,
          { new: true } // Return the updated document
        );

        // Check if email notification should be sent
        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);
        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          // Generate email content
          const emailContent = await generateEmailBody(productInfo, emailNotifType);
          // Get user emails
          const userEmails = updatedProduct.users.map((user: any) => user.email);
          // Send email notification
          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      } catch (error) {
        console.error(`Error processing product: ${error}`);
        return null; // Return null to maintain array structure
      }
    }));

    // Filter out null values (failed product updates)
    const filteredProducts = updatedProducts.filter(product => product !== null);

    return NextResponse.json({
      message: "Products updated successfully",
      data: filteredProducts,
    });
  } catch (error) {
    console.error(`Failed to update products: ${error}`);
    throw new Error("Failed to update products");
  }
}
