// pages/api/generatePdf.js
import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
 const { url } = req.query;
 console.log("Function Running")

 if (!url) {
    return res.status(400).json({ error: 'URL is required' });
 }

 try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Specify the part of the page to convert to PDF
    // For example, to convert a specific element with id 'content'
    const element = await page.$('#content');
    const pdf = await element.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    });

    await browser.close();

    // Set headers and send the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="download.pdf"`);
    return res.send(pdf);
 } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
 }
}
