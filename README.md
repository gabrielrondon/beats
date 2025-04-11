# Binaural Beats Generator

A minimalist web application for generating binaural beats to help with focus, relaxation, and meditation.

## Features

- Real-time binaural beat generation
- Adjustable frequency (1-30 Hz)
- Base frequency control
- Volume control
- Preset frequencies for:
  - Concentration (14 Hz)
  - Relaxation (10 Hz)
  - Meditation (6 Hz)
  - Deep Meditation (4 Hz)
  - Sleep (2 Hz)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Web Audio API
- Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/gabrielrondon/beats.git
cd beats
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select a preset or adjust the frequency manually
2. Click the "Start" button to begin
3. Adjust volume as needed
4. Use headphones for the best experience

## Development

- `app/components/binaural-beats.tsx` - Main component
- Uses Web Audio API for sound generation
- Implements stereo separation for binaural effect

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details
