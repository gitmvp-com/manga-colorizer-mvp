# 🚀 Quick Start Guide - Manga Colorizer

Get your Manga Colorizer up and running in 5 minutes!

## 📌 Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** or **Bun** installed ([Download Node.js](https://nodejs.org/))
- An **OpenRouter API key** ([Get one free here](https://openrouter.ai/keys))
- A code editor (VS Code recommended)

## 💾 Step 1: Clone the Repository

```bash
git clone https://github.com/gitmvp-com/manga-colorizer-mvp.git
cd manga-colorizer-mvp
```

## 📦 Step 2: Install Dependencies

Choose your package manager:

```bash
# Using npm
npm install

# OR using pnpm (faster)
pnpm install

# OR using bun (fastest)
bun install
```

## 🔑 Step 3: Set Up Environment Variables

1. **Copy the example environment file:**

```bash
cp .env.example .env.local
```

2. **Open `.env.local` and add your OpenRouter API key:**

```env
OPENROUTER_API_KEY=sk-or-v1-YOUR_API_KEY_HERE
```

### How to Get an OpenRouter API Key:

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to [Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy and paste it into your `.env.local` file

## 🏃 Step 4: Run the Development Server

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev

# OR using bun
bun dev
```

You should see:

```
▶ Local:        http://localhost:3000
▶ Ready in XXXms
```

## 🎉 Step 5: Open in Browser

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the Manga Colorizer homepage!

## 🧪 Step 6: Test the App

1. **Upload a manga image** (black and white)
   - Click the upload area or drag & drop an image
   - Supported formats: JPG, PNG, WebP (up to 10MB)

2. **Click "Colorize Manga"**
   - Wait for the AI to process (30-60 seconds)
   - Watch the progress indicator

3. **Download your colorized manga!**
   - Choose PNG (high quality) or JPEG (smaller size)
   - Or share it using the Share button

## ⚠️ Important Notes

### 🚧 Current Limitation

The current MVP uses **Gemini 2.5 Flash** which is optimized for text generation, not image generation. To get actual colorized manga images, you'll need to:

1. **Option A:** Integrate with an image-to-image model:
   - Stable Diffusion with ControlNet
   - DALL-E 3
   - Midjourney API
   - Specialized manga colorization models

2. **Option B:** Use a different AI service that supports image colorization

The API route at `src/app/api/colorize-manga/route.ts` includes a comprehensive system prompt designed specifically for manga colorization. You'll just need to update it to work with your chosen image generation service.

## 🛠️ Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
npm run dev -- -p 3001
```

### API Key Not Working

- Make sure you copied the entire key including the `sk-or-v1-` prefix
- Check that your `.env.local` file is in the root directory
- Restart the development server after adding the key
- Verify your key is active at [OpenRouter Keys](https://openrouter.ai/keys)

### Image Upload Fails

- Check that your image is under 10MB
- Ensure it's in JPG, PNG, or WebP format
- Try a different image to rule out corruption

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## 📚 Next Steps

### Customize the App

- **Adjust colors:** Edit `src/app/globals.css` for custom themes
- **Change branding:** Update `src/app/layout.tsx` metadata
- **Modify UI:** Components are in `src/components/`

### Deploy to Production

See the main [README.md](README.md#-deployment) for deployment instructions.

### Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) to learn how to contribute to the project.

## 💬 Need Help?

- **GitHub Issues:** [Open an issue](https://github.com/gitmvp-com/manga-colorizer-mvp/issues)
- **Documentation:** Check the [README.md](README.md)
- **OpenRouter Docs:** [OpenRouter Documentation](https://openrouter.ai/docs)

## 🎆 Success!

You're now ready to start colorizing manga with AI! 🎉

---

**Quick Reference:**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

Happy colorizing! 🎨✨