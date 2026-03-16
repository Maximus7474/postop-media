# Post-OP Media

**postop-media** is a high-performance Discord bot designed to bridge the gap between players and file servers. It allows users to upload media directly to a CDN via slash commands, ensuring a seamless experience for community-driven content.

Currently, the project natively supports [FiveManage](https://fivemanage.com), with custom endpoint support in active development.

---

## 🚀 Getting Started

### Installation (Recommended)

For the best stability, it is recommended to download the latest version from the **[Releases](https://github.com)** page.

* **Binaries:** Downloads include pre-compiled executables for Windows and Linux, removing the need to install Node.js or Bun on your host machine.
* **Pre-releases:** Experimental features are available via pre-release tags, but may be subject to frequent changes.

### Configuration

Each release includes a `.env` and a `config.json`.

#### 1. Environment Variables (`.env`)

Create a `.env` file in the root directory:

```bash
DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"
MAIN_GUILD_ID="YOUR_GUILD_ID"

# API_KEY serves as the global fallback
API_KEY="YOUR_FIVEMANAGE_KEY"

# Optional: Specific keys for different media types
# IMAGE_API_KEY="OPTIONAL_IMAGE_KEY"
# VIDEO_API_KEY="OPTIONAL_VIDEO_KEY"

```

#### 2. Project Config (`config.json`)

The bot validates settings using Zod to ensure your upload pipeline is configured correctly.

##### Default configuration

This is the default configuration. Use this if you are using FiveManage as your primary host.

```json
{
  "UploadMethod": "fivemanage"
}

```

##### Custom Setup (Advanced)

Use this if you are pointing the bot to your own private storage server or a third-party API. Note that `CustomUpload` is **mandatory** if the method is set to `custom`.

> [!NOTE]
> While the schema exists, custom endpoint logic is currently being implemented. We are open to suggestions regarding requirements or other supported upload services.

```json
{
  "UploadMethod": "custom",
  "CustomUpload": {
    "method": "POST",
    "endpoint": "https://your-media-server.com/api/upload",
    "headers": {
      "Authorization": "Bearer YOUR_SECRET_TOKEN",
      "X-Custom-Header": "PostOp-Media-Bot"
    }
  }
}

```

---

### 💡 Quick Tips for Users

* **JSON Syntax:** Ensure you don't leave a trailing comma after the last item in `config.json`, as this will cause an error.
* **Keep it Secret:** Never share your `.env` file or your `DISCORD_BOT_TOKEN` with anyone.
* **Validation:** If the bot fails to start, check the console; the **Zod validation** will tell you exactly which line in your `config.json` is formatted incorrectly.

---

## 🛠 Development

This project is built using [Bun](https://bun.com), a fast all-in-one JavaScript runtime.

### Tech Stack

* **Runtime:** Bun v1.3.2+
* **Language:** TypeScript
* **Validation:** Zod
* **Build Tool:** Bun Native Compiler (Generating standalone binaries)

### Local Setup

```bash
# Install dependencies
bun install

# Run in development mode
bun run index.ts

```

### Building Binaries

The project uses a custom build script to compile TypeScript into platform-specific binaries. This process strips internal development labels and optimizes the output.

```bash
# Build for all platforms (Windows & Linux)
bun run build --target=all

# Build for a specific platform
bun run build --target=windows
bun run build --target=linux

```

Output files are generated in the `/dist` directory.

---

## 🤝 Contributing

Contributing guidelines are coming soon! If you have suggestions for new upload providers or features, feel free to open an issue or a discussion.
