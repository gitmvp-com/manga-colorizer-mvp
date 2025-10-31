# 🧠 AI System Prompt Documentation

## Overview

The Manga Colorizer uses a specialized system prompt designed specifically for manga colorization. This document explains the prompt structure, design principles, and how to customize it.

## The System Prompt

Located in: `src/app/api/colorize-manga/route.ts`

### Full Prompt Text

```typescript
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
```

## Prompt Design Principles

### 1. **Role Definition**

The prompt establishes the AI as an "expert manga colorization AI artist" to set context and expectations.

### 2. **Expertise Areas**

Lists specific domains of knowledge:
- Manga art styles (shonen, shoujo, seinen)
- Color palette selection
- Aesthetic preservation
- Technical skills (line art, effects)

### 3. **Guidelines Structure**

Provides 10 specific colorization guidelines that:
- Start with analysis (understanding before acting)
- Cover technical aspects (skin tones, lighting)
- Address artistic concerns (mood, balance)
- Ensure quality (clarity, visibility)

### 4. **Color Theory Integration**

- **Warm colors** for action/excitement
- **Cool colors** for calm/emotional scenes
- **Balanced palettes** to avoid overwhelming
- **Contrast preservation** for readability

### 5. **Context Awareness**

The prompt instructs the AI to:
- Analyze scene context before colorizing
- Match colors to mood and genre
- Apply appropriate aesthetic choices

## User Prompt

In addition to the system prompt, each request includes a user message:

```typescript
'Please colorize this black and white manga image. Apply vibrant, natural colors that enhance the artwork while maintaining its original style and energy. Ensure characters have appropriate skin tones and hair colors, backgrounds are complementary, and the overall result looks professional and visually appealing.'
```

This reinforces the colorization objective with specific requirements.

## Customization Guide

### Adjusting for Different Styles

#### For More Realistic Colorization

```typescript
const REALISTIC_MANGA_PROMPT = `...existing prompt...

Additional Focus:
- Prioritize photorealistic color application
- Use subtle, natural color gradients
- Apply realistic lighting and shadows
- Reduce vibrant/saturated colors in favor of natural tones
`;
```

#### For More Vibrant/Anime Style

```typescript
const VIBRANT_ANIME_PROMPT = `...existing prompt...

Additional Focus:
- Use bold, saturated colors typical of modern anime
- Apply cel-shading techniques
- Enhance contrast between light and shadow
- Use vivid hair colors (pink, blue, purple, etc.)
`;
```

#### For Specific Genres

```typescript
// For action manga
const ACTION_MANGA_PROMPT = `...existing prompt...

Genre-Specific Guidelines:
- Use warm color palettes (reds, oranges, yellows)
- Apply dynamic color gradients for motion effects
- Enhance impact with bold color contrasts
- Colorize speed lines and action effects prominently
`;

// For romance manga
const ROMANCE_MANGA_PROMPT = `...existing prompt...

Genre-Specific Guidelines:
- Use soft, pastel color palettes (pinks, lavenders, soft blues)
- Apply gentle color transitions
- Create dreamy, atmospheric backgrounds
- Use warm lighting for intimate scenes
`;
```

### Adding Color Palette Preferences

```typescript
const CUSTOM_PALETTE_PROMPT = `...existing prompt...

Preferred Color Palettes:
- Skin tones: ${userPreferences.skinTone || 'natural Asian/anime tones'}
- Hair colors: ${userPreferences.hairColor || 'vibrant anime colors'}
- Background: ${userPreferences.background || 'complementary muted tones'}
- Accent colors: ${userPreferences.accents || 'based on scene mood'}
`;
```

### Temperature and Model Parameters

Adjust these in the API call:

```typescript
const result = await generateText({
  model: openrouter('google/gemini-2.0-flash-exp:free'),
  messages: [...],
  maxTokens: 4096,
  temperature: 0.7,  // Adjust for creativity vs consistency
  // temperature: 0.3  // More consistent, less creative
  // temperature: 0.9  // More creative, less consistent
});
```

## Integration with Image Models

### For Stable Diffusion

When integrating with Stable Diffusion + ControlNet:

```typescript
const SD_MANGA_PROMPT = {
  positive: `manga colorization, vibrant colors, professional anime art, 
             detailed shading, clean line art, ${MANGA_COLORIZATION_PROMPT}`,
  negative: `blurry, low quality, watermark, text, messy, oversaturated, 
             washed out colors, loss of line art detail`,
  controlnet: {
    model: 'control_v11p_sd15_lineart',
    weight: 1.0,
  }
};
```

### For DALL-E 3

```typescript
const DALLE_MANGA_PROMPT = `Transform this black and white manga image into a 
fully colorized version. ${MANGA_COLORIZATION_PROMPT}. Maintain all original 
details and line art clarity.`;
```

## Best Practices

### 1. **Be Specific**
   - Clear instructions produce better results
   - Mention what to preserve (line art, composition)
   - Specify desired outcomes (vibrant, natural, professional)

### 2. **Provide Examples**
   - Reference specific manga/anime styles
   - Mention color palette examples
   - Describe desired aesthetic clearly

### 3. **Set Constraints**
   - Define what NOT to do (don't oversaturate, don't blur lines)
   - Establish quality standards
   - Maintain consistency guidelines

### 4. **Structure Guidelines**
   - Numbered lists are easier to follow
   - Group related instructions
   - Prioritize important instructions first

### 5. **Test and Iterate**
   - Try different prompt variations
   - Adjust based on output quality
   - Fine-tune for your specific use case

## Prompt Performance Tips

### Improving Color Accuracy

```typescript
// Add color reference guidance
"- Reference typical anime color palettes:
  * Skin: peachy-pink to light tan tones
  * Hair: vibrant (blue, pink, purple) or natural (brown, black, blonde)
  * Eyes: bright, saturated colors with highlights
  * Clothing: bold, contrasting colors"
```

### Enhancing Detail Preservation

```typescript
// Emphasize line art preservation
"CRITICAL: Preserve all original line art details. The black lines must remain 
crisp and clear. Colors should fill areas between lines without bleeding or 
blurring the original artwork."
```

### Controlling Color Intensity

```typescript
// Add intensity guidelines
"Color Intensity Levels:
- Foreground characters: High saturation (80-100%)
- Backgrounds: Medium saturation (50-70%)
- Effects/accents: Variable based on scene mood
- Shadows: Desaturated versions of base colors"
```

## Troubleshooting Common Issues

### Issue: Colors Too Dull

**Solution:** Add to prompt:
```
"Apply vibrant, saturated colors. Avoid muted or washed-out palettes."
```

### Issue: Loss of Line Art Detail

**Solution:** Emphasize:
```
"PRESERVE all original line art. Lines must remain crisp and black."
```

### Issue: Inconsistent Character Colors

**Solution:** Add:
```
"Analyze character features first. Apply consistent colors to the same character 
throughout the image. Hair color, eye color, and clothing should be uniform for 
each character."
```

### Issue: Inappropriate Color Choices

**Solution:** Specify:
```
"Consider scene context before choosing colors:
- Action scenes: warm, energetic colors (red, orange, yellow)
- Calm scenes: cool, soothing colors (blue, green, purple)
- Emotional scenes: soft pastels or deep, rich tones"
```

## Advanced Techniques

### Multi-Step Prompting

For complex colorization:

```typescript
// Step 1: Analysis
"First, analyze this manga image and describe:
1. The scene type (action, romance, comedy, etc.)
2. The mood and atmosphere
3. The characters present and their likely attributes
4. The setting and time of day"

// Step 2: Color Planning
"Based on your analysis, suggest an appropriate color palette."

// Step 3: Colorization
"Now apply the suggested color palette to colorize the image."
```

### Conditional Instructions

```typescript
"IF the scene contains:
- Action/fighting: Use warm, intense colors with high contrast
- Romance/emotional: Use soft, pastel colors with gentle transitions  
- Comedy/lighthearted: Use bright, cheerful colors with high saturation
- Dark/serious: Use desaturated colors with dramatic lighting"
```

## Resources

- [Manga Art Styles Guide](https://en.wikipedia.org/wiki/Manga_iconography)
- [Anime Color Theory](https://www.creativebloq.com/anime/anime-colour-theory)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

## Contributing

Have improvements to the prompt? See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to submit changes!

---

**Remember:** The prompt is just a guideline. The AI model's capabilities and the quality of the input image also significantly impact the final result.