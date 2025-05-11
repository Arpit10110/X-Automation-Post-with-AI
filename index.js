import puppeteer from "puppeteer";
import { config } from "dotenv";
import { GoogleGenAI } from "@google/genai";
config();

const loginX = async(tt) => {
    const browser = await puppeteer.launch({ 
        headless: false, 
        defaultViewport: null, 
        args: ['--start-maximized'] 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto("https://x.com/i/flow/login", { waitUntil: 'networkidle2' });

    // login process
    const usernameInput = await page.waitForSelector('input[name="text"]');
    await usernameInput.type('Arpit01901', { delay: 200 });
    await page.keyboard.press('Enter');
    // const userphone = await page.waitForSelector('input[name="text"]');
    // await usernameInput.type('8840689883', { delay: 200 });
    // await page.keyboard.press('Enter');
    const passwordInput = await page.waitForSelector('input[name="password"]');
    await passwordInput.type(process.env.X_PASSWORD, { delay: 200 });
    await page.keyboard.press('Enter');
    
    // Wait for the home page to load
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Start posting a tweet
    await page.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true });
    await page.click('[data-testid="tweetTextarea_0"]');
    const tweetText = `${tt}`;
    await page.keyboard.type(tweetText, { delay: 100 });
    
    // Wait for the tweet button and click it
    // Fixed selector - using the correct data-testid from your screenshot
    await page.waitForSelector('[data-testid="tweetButton"]', { visible: true });
    await page.click('[data-testid="tweetButton"]');
    
    // Add a delay to ensure the post completes
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Tweet posted successfully!");
    
    // Uncomment to close browser when done
    await browser.close();
}

const generatetweet = async () => {
    const topic = "Will AI replace software developers?";

    const prompt = `
  You're a witty and creative content writer for Twitter.
  
  Write ONLY ONE tweet about the topic: "${topic}". 
  It must:
  - Be under 280 characters
  - Use a clever or casual tone
  - Include 2-4 relevant hashtags (to boost reach)
  - Be unique and different each time
  - Sound natural and human (no robotic tone)
  - NOT include any commentary or intro like "here's one" or "let's try"
  - Output ONLY the tweet content. No pretext or follow-up.
  `;
  
    console.log("Generating tweet...");
  
    const ai = new GoogleGenAI({ apiKey: process.env.GEMNI_API });
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
  
    const tweet = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || result.text;
    console.log("Generated Tweet:\n", tweet.trim());
    const tt = tweet.trim();
    loginX(tt).catch(error => {
        console.error("An error occurred:", error);
    });
};

generatetweet();