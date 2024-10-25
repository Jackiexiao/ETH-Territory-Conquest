# ETH Territory Conquest 🎮

A blockchain-based territory conquest game where players can claim and own squares on an 8x8 grid using their Ethereum wallet.

<img width="437" alt="image" src="https://github.com/user-attachments/assets/ea3fc365-6db9-4a79-8a54-32767588c80a">


## Features ✨

- **Web3 Integration**: Connect with MetaMask wallet
- **Interactive Grid**: 8x8 game board with clickable territories
- **Real-time Updates**: Instant visual feedback for territory claims
- **Beautiful UI**: Modern design with gradient backgrounds and glass-morphism effects
- **Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack 🛠

- React + TypeScript
- Vite
- Tailwind CSS
- ethers.js
- MetaMask
- Lucide Icons
- React Hot Toast

## Getting Started 🚀

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd eth-territory-game
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## How to Play 🎯

1. Connect your MetaMask wallet using the "Connect Wallet" button
2. Click on any unclaimed (gray) square to start a claim transaction
3. Confirm the transaction in MetaMask
4. Once confirmed, the territory will be marked with your color
5. Try to create strategic patterns and block other players!

## Development Notes 📝

- The game currently uses simulated blockchain transactions
- For production deployment, implement:
  - Smart contract for territory ownership
  - Real transaction handling
  - Player scoring system
  - Territory control mechanics
  - Leaderboard functionality

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

MIT License - feel free to use this project for learning or building your own blockchain game!
