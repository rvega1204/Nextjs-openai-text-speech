# OpenAI Text to Speech Converter

A [Next.js](https://nextjs.org) application that converts text into speech using the OpenAI Audio API.

## Features

- **Text Input**: User-friendly interface to input text.
- **Word Count**: Real-time word and character count.
- **Validation**: Ensures input is within limits (5 - 5000 characters).
- **Speech Generation**: Converts text to high-quality audio using OpenAI's `tts-1-hd` model.
- **Audio Playback**: Built-in audio player to listen to the generated speech.
- **Responsive Design**: Built with TailwindCSS for a seamless experience across devices.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Forms**: [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) validation
- **AI**: [OpenAI API](https://platform.openai.com/docs/guides/text-to-speech)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

## Getting Started

### Prerequisites

- Node.js installed.
- An OpenAI API Key.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rvega1204/Nextjs-openai-text-speech.git
   cd openai-text-speech
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

### Running the Application

run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

This project uses **Vitest** for testing.

To run the test suite:

```bash
npm test
```

### Test Coverage

- **Home Page**: Verifies landing page rendering.
- **Speech Page**: Tests form validation, user interaction, and API integration.
- **Speech API**: Verifies the backend route handles requests and errors correctly.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
  - `page.js`: Landing page.
  - `speech/page.js`: Main text-to-speech functionality.
  - `api/speech/route.js`: API handler for OpenAI requests.
- `__tests__/`: Test files.
- `vitest.config.mjs`: Testing configuration.

## API Reference

### POST `/api/speech`

Converts input text to speech.

- **Request Body**:
  ```json
  {
    "text": "Text to convert to speech"
  }
  ```
- **Response**: Returns an audio stream (`audio/mpeg`).

### Error Handling

- **400 Bad Request**: Invalid input text.
- **500 Internal Server Error**: Failed to generate speech.

## License

MIT License

## Author

- [Ricardo Vega](https://github.com/rvega1204)
