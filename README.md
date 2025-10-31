# 🎨 Manga Colorizer - AI-Powered Manga Colorization

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Transform your black and white manga images into vibrant, colorful artwork using advanced AI technology powered by Gemini 2.5 Flash.

## ✨ Features

- 🖼️ **AI-Powered Colorization** - Advanced AI algorithms automatically colorize manga images
- 📱 **Drag & Drop Upload** - Easy image upload with drag-and-drop support
- 🌈 **Smart Color Palette** - AI applies contextually appropriate colors based on scene analysis
- 💾 **Multiple Download Formats** - Download colorized images as PNG or JPEG
- 📤 **Share Functionality** - Built-in Web Share API for easy sharing
- 🌙 **Dark Mode** - Full dark mode support for comfortable viewing
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⏱️ **Real-time Progress** - Multi-stage loading indicators with time estimates
- ⚠️ **Error Handling** - Comprehensive error states with retry functionality
- ♻️ **Image Validation** - Client-side validation for file types and sizes

## 🖥️ Demo

![Manga Colorizer Demo](https://via.placeholder.com/800x400?text=Manga+Colorizer+Demo)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- An OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/gitmvp-com/manga-colorizer-mvp.git
cd manga-colorizer-mvp
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. **Run the development server**

```bash
npm run dev
# or
pnpm dev
# or
bun dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 How It Works

### 1. Upload Manga Image
Upload a black and white manga panel or page in JPG, PNG, or WebP format (up to 10MB).

### 2. AI Colorization
Our advanced AI powered by Gemini 2.5 Flash analyzes the manga and applies:
- Natural skin tones and hair colors
- Contextually appropriate background colors
- Mood-based color palettes (warm for action, cool for calm)
- Proper lighting and shading
- Preservation of original line art

### 3. Download & Share
Download your colorized manga in high quality or share it instantly with the Web Share API.

## 🧠 AI System Prompt

The manga colorizer uses a specialized system prompt designed for manga colorization:

- **Art Style Recognition** - Understands different manga styles (shonen, shoujo, seinen)
- **Color Theory** - Applies emotional color palettes based on scene mood
- **Manga Elements** - Recognizes and colorizes speed lines, screentones, and effects
- **Character Design** - Applies realistic anime/manga character color schemes
- **Lighting Analysis** - Maintains consistent lighting across the image
- **Contrast Preservation** - Keeps original line art clarity and detail

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.2 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **AI Integration:** 
  - Gemini 2.5 Flash via OpenRouter
  - Vercel AI SDK (`ai` package)
  - OpenRouter AI SDK Provider
- **Build Tool:** Turbopack (Next.js 15)
- **Fonts:** Geist Sans & Geist Mono

## 📝 Project Structure

```
manga-colorizer-mvp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── colorize-manga/
│   │   │       └── route.ts          # API endpoint for manga colorization
│   │   ├── layout.tsx             # Root layout with metadata
│   │   ├── page.tsx               # Main application page
│   │   └── globals.css            # Global styles with Tailwind
│   ├── components/
│   │   ├── ImageUpload.tsx        # Drag-and-drop image upload
│   │   ├── ResultDisplay.tsx      # Colorized result viewer
│   │   ├── LoadingDisplay.tsx     # Multi-stage loading indicator
│   │   ├── ErrorDisplay.tsx       # Error handling component
│   │   └── index.ts               # Component exports
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   └── types/
│       └── index.ts               # TypeScript type definitions
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |

### Image Upload Limits

- **Max File Size:** 10MB
- **Supported Formats:** JPG, PNG, WebP
- **Recommended Resolution:** 1024x1024 or higher for best results

## 📊 Performance

- **Processing Time:** 30-60 seconds (depends on image complexity)
- **Optimizations:**
  - Client-side image validation
  - Efficient base64 encoding
  - Streaming responses
  - Progressive loading states

## 🐛 Known Limitations

1. **Image Generation Model:** The current MVP uses Gemini 2.5 Flash which is optimized for text generation. For production-ready manga colorization, you'll need to integrate with an image-to-image model like:
   - Stable Diffusion with ControlNet
   - DALL-E 3
   - Midjourney API
   - Specialized manga colorization models

2. **API Response:** The current API route returns a placeholder response structure. Update the implementation to work with your chosen image generation service.

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitmvp-com/manga-colorizer-mvp)

1. Click the "Deploy" button above
2. Add your `OPENROUTER_API_KEY` environment variable
3. Deploy!

### Deploy Manually

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenRouter](https://openrouter.ai/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Based on [ai_outfit_app](https://github.com/filiksyos/ai_outfit_app) by filiksyos

## 💬 Support

For questions or issues, please open an issue on GitHub.

## 🔮 Roadmap

- [ ] Integrate proper image-to-image AI model
- [ ] Add color palette customization
- [ ] Batch processing for multiple images
- [ ] User accounts and gallery
- [ ] Advanced editing tools (color adjustment, style transfer)
- [ ] Mobile app version
- [ ] API for third-party integrations

---

Made with ❤️ by [GitMVP](https://github.com/gitmvp-com)