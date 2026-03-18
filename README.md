# Post-OP Media

  ![](https://img.shields.io/github/downloads/Maximus7474/postop-media/total?logo=github)
  ![](https://img.shields.io/github/v/release/Maximus7474/postop-media?logo=github)
  ![](https://img.shields.io/github/downloads/Maximus7474/postop-media/total?logo=github)

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

```json
{
  "UploadMethod": "custom",
  "CustomUpload": {
    "method": "POST",
    "endpoint": "https://your-media-server.com/api/upload",
    "path": "data.url",
    "headers": {
      "Authorization": "Bearer YOUR_SECRET_TOKEN"
    }
  }
}

```

###### Request Details

When using the custom uploader, the bot sends a **Multipart Form-Data** request. In addition to any custom headers you define in the config, the bot automatically includes the following data:

**1. Form Data Fields**
* `file`: The actual binary file (Blob).
* `metadata`: A JSON string containing:
    * `name`: The original file name.
    * `uploadedBy`: The display name and ID of the Discord member (e.g., `JohnDoe (johndoe - 123456789)`).
    * `source`: Always set to `Post-OP Media - Discord Bot`.

**2. Automatic Headers**
The bot appends these headers to every request for easier server-side logging:
* `X-Member-ID`: The Discord Snowflake ID of the user.
* `X-Upload-Source`: `Post-OP Media - Discord Bot`.

**3. Response Handling**
The `path` property in your config tells the bot where to find the resulting file link in your server's JSON response. For example, if your server returns `{ "data": { "url": "..." } }`, set your path to `data.url`.

> [!NOTE]
> **Developer Reference:** To see exactly how the bot constructs the `FormData` and resolves the JSON response, check the source code: [`custom.ts`](./src/handlers/upload_methods/custom.ts).

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
