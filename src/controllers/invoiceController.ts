import puppeteer from 'puppeteer';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
const fs = require('fs');

// Define the schema to save invoice details in MongoDB
const invoiceSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
  },
  products: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: Number,
  date: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Generate Invoice PDF and save product details
export const generateInvoice = async (req: Request, res: Response): Promise<void> => {
  const { user, products, totalPrice } = req.body;

  try {
    // Save the invoice data to MongoDB
    const newInvoice = new Invoice({
      user,
      products,
      totalPrice,
    });
    await newInvoice.save();

    // Generate the product rows dynamically
    const productRows = products.map((product: { name: string; quantity: number; price: number }) => {
      const total = product.quantity * product.price;
      return `
        <tr>
          <td class="py-4 px-6 border-b">${product.name}</td>
          <td class="py-4 px-6 border-b">${product.quantity}</td>
          <td class="py-4 px-6 border-b">$${product.price.toFixed(2)}</td>
          <td class="py-4 px-6 border-b">$${total.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    // Generate the PDF using Puppeteer in headless mode
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // HTML content for the PDF with dynamic data
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Generator</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
    
        <!-- Navbar -->
        <nav class="bg-gray-900 text-white sticky top-0 z-50 p-4 flex justify-between items-center">
            <div class="flex items-center">
                <img src="" alt="Logo" class="h-10 w-10 mr-2">
                <span class="text-xl font-bold">Invoice Generator</span>
            </div>
        </nav>
    
        <!-- User Info Section -->
        <div class="bg-gray-800 text-white p-6 mt-4">
            <div class="flex justify-between">
                <div>
                    <p class="text-lg font-semibold">Name: ${user.name}</p>
                    <p>Email: ${user.email}</p>
                </div>
                <div>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    
        <!-- Products Table -->
        <div class="container mx-auto mt-8">
            <table class="min-w-full bg-white border border-gray-300">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-3 px-6 text-left text-sm font-medium text-gray-900">Product</th>
                        <th class="py-3 px-6 text-left text-sm font-medium text-gray-900">Quantity</th>
                        <th class="py-3 px-6 text-left text-sm font-medium text-gray-900">Rate</th>
                        <th class="py-3 px-6 text-left text-sm font-medium text-gray-900">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${productRows}
                </tbody>
            </table>
        </div>
    
        <!-- Total and GST Section -->
        <div class="container mx-auto mt-6 p-4 bg-white border border-gray-300">
            <div class="flex justify-end">
                <div class="w-1/2">
                    <div class="flex justify-between py-2">
                        <span class="text-gray-700">Total Amount:</span>
                        <span class="text-gray-900 font-semibold">$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between py-2">
                        <span class="text-gray-700">GST (5%):</span>
                        <span class="text-gray-900 font-semibold">$${(totalPrice * 0.05).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between py-2 border-t mt-2">
                        <span class="text-lg font-bold text-gray-700">Amount to be Paid:</span>
                        <span class="text-lg font-bold text-gray-900">$${(totalPrice * 1.05).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
`;

    await page.setViewport({ width: 1920, height: 1080 });

    // Set the page content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    // Save the PDF to the file system (optional)
    fs.writeFileSync('invoice.pdf', pdfBuffer);

    // Send the PDF as a response
    await browser.close();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
    });
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Error generating invoice' });
  }
};
