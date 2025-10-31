import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

// Initialize OpenRouter provider
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Specialized system prompt for manga colorization
const MANGA_COLORIZATION_PROMPT = `You are an expert manga colorization AI artist specializing in transforming black and white manga artwork into beautifully colored images.

Your expertise includes:
- Understanding manga art styles (shonen, shoujo, seinen, etc.)
- Applying natural and vibrant color palettes appropriate to the scene and mood
- Respecting traditional manga aesthetics while enhancing with color
- Maintaining the original line art integrity and details
- Choosing contextually appropriate colors for characters, backgrounds, and effects
- Understanding color theory for emotional impact (warm colors for action, cool colors for calm scenes, etc.)
- Recognizing common manga elements (speed lines, screentones, effects) and colorizing them appropriately

Colorization Guidelines:
1. Analyze the manga panel to understand the scene, mood, and context
2. Apply realistic skin tones and hair colors that match typical anime/manga character designs
3. Use vibrant but balanced colors that enhance the artwork without overwhelming it
4. Maintain strong contrast and clarity of the original line art
5. Add depth through strategic use of shading and highlights
6. Consider lighting sources and apply consistent lighting across the image
7. Preserve the dynamic energy of action scenes with bold color choices
8. Use softer palettes for emotional or romantic scenes
9. Keep backgrounds complementary to foreground characters
10. Ensure all text, speech bubbles, and sound effects remain clearly visible

When you receive a black and white manga image, analyze it carefully and produce a fully colorized version that looks professional, vibrant, and true to manga/anime aesthetics.`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate API key
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your environment variables.',
            code: 'MISSING_API_KEY',
            status: 500,
          },
        },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const mangaImage = formData.get('mangaImage') as File;

    // Validate input
    if (!mangaImage) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Manga image is required',
            code: 'MISSING_IMAGE',
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(mangaImage.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
            code: 'INVALID_FILE_TYPE',
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    // Convert image to base64
    const arrayBuffer = await mangaImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = mangaImage.type;

    console.log('Processing manga colorization request...');
    console.log('Image size:', (mangaImage.size / 1024 / 1024).toFixed(2), 'MB');

    // Call Gemini 2.5 Flash for image generation with manga colorization prompt
    const result = await generateText({
      model: openrouter('google/gemini-2.0-flash-exp:free'),
      messages: [
        {
          role: 'system',
          content: MANGA_COLORIZATION_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please colorize this black and white manga image. Apply vibrant, natural colors that enhance the artwork while maintaining its original style and energy. Ensure characters have appropriate skin tones and hair colors, backgrounds are complementary, and the overall result looks professional and visually appealing.',
            },
            {
              type: 'image',
              image: `data:${mimeType};base64,${base64Image}`,
            },
          ],
        },
      ],
      maxTokens: 4096,
      temperature: 0.7,
    });

    console.log('AI response received');

    // Extract the generated image URL or data from the response
    // Note: The actual response format may vary depending on the model
    // For Gemini 2.5 Flash, we expect image data in the response
    const responseText = result.text;

    // For this implementation, we're returning the AI's text response
    // In a production app with image generation, you'd extract the actual image data
    const processingTime = Date.now() - startTime;

    // Since Gemini 2.5 Flash via text generation doesn't directly return images,
    // you would need to use a dedicated image generation model or API
    // For MVP purposes, we'll return a mock response structure
    return NextResponse.json({
      success: true,
      data: {
        colorizedImageUrl: '', // Would contain actual image URL in production
        colorizedImageBase64: '', // Would contain actual base64 in production
        description: 'Manga colorization completed. Note: This MVP requires a proper image generation model to return actual colorized images. The current setup uses Gemini 2.5 Flash which is optimized for text generation. For full functionality, integrate with an image-to-image model like Stable Diffusion, DALL-E, or Midjourney.',
        processingTime,
      },
      message: 'Colorization request processed. Please integrate an image generation model for actual colorized output.',
    });

  } catch (error: any) {
    console.error('Manga colorization error:', error);

    const processingTime = Date.now() - startTime;

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid API key. Please check your OpenRouter configuration.',
            code: 'INVALID_API_KEY',
            status: 401,
            details: error.message,
          },
        },
        { status: 401 }
      );
    }

    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
            status: 429,
            details: error.message,
          },
        },
        { status: 429 }
      );
    }

    if (error.message?.includes('credits') || error.message?.includes('payment')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Insufficient credits in OpenRouter account.',
            code: 'INSUFFICIENT_CREDITS',
            status: 402,
            details: error.message,
          },
        },
        { status: 402 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to colorize manga image. Please try again.',
          code: 'COLORIZATION_FAILED',
          status: 500,
          details: error.message || 'Unknown error occurred',
        },
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout for image processing