# Contributing to Manga Colorizer

Thank you for your interest in contributing to the Manga Colorizer project! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a new branch** for your feature or bug fix
4. **Make your changes** and commit them with clear messages
5. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/manga-colorizer-mvp.git
cd manga-colorizer-mvp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENROUTER_API_KEY to .env.local

# Start the development server
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

## Commit Messages

Use clear and descriptive commit messages:

- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor component`
- `test: Add tests`
- `chore: Update dependencies`

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Test your changes** thoroughly
3. **Update the README** if you're adding new features
4. **Ensure all tests pass** (when tests are added)
5. **Request review** from maintainers

## Areas for Contribution

### High Priority

- [ ] Integrate proper image-to-image AI model (Stable Diffusion, DALL-E, etc.)
- [ ] Add actual image colorization functionality
- [ ] Implement user authentication
- [ ] Add image gallery for saved colorizations

### Medium Priority

- [ ] Add color palette customization
- [ ] Implement batch processing
- [ ] Add more AI model options
- [ ] Improve mobile responsiveness
- [ ] Add unit and integration tests

### Low Priority

- [ ] Add animations and transitions
- [ ] Implement advanced editing tools
- [ ] Add social sharing features
- [ ] Create API documentation
- [ ] Add multilingual support

## Bug Reports

When reporting bugs, please include:

- **Description** of the bug
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment** (browser, OS, Node version)

## Feature Requests

For feature requests, please:

- **Describe the feature** clearly
- **Explain why it's needed**
- **Provide examples** if possible
- **Consider implementation** complexity

## Questions?

Feel free to open an issue for any questions or concerns!

## Code of Conduct

Be respectful and inclusive. We want this to be a welcoming community for everyone.

Thank you for contributing! 🎉