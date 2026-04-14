# 📥 Bot WhatsApp Download API

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
cd api-downloader
npm install
```

### 2. Jalankan Server API
```bash
node server.js
```

### 3. Jalankan Bot WhatsApp
```bash
cd ..
node index.js
```

## 📱 Perintah Bot

- `.tiktok <link>` - Download video TikTok
- `.ig <link>` - Download video/post Instagram  
- `.yt <link>` - Download video YouTube
- `.fb <link>` - Download video Facebook
- `.x <link>` - Download video X/Twitter
- `.sticker` - Buat stiker dari media
- `.brat <teks>` - Buat stiker aesthetic
- `.menu` - Tampilkan menu
- `.ping` - Test kecepatan bot

## 🔧 API Endpoints

Server berjalan di `http://localhost:3000`

### GET /download
Parameter:
- `url` (required) - URL video yang akan didownload

Response:
```json
{
  "status": true,
  "platform": "TikTok",
  "url": "https://download-url.com/video.mp4"
}
```

## 🛠️ Platform Support

✅ **YouTube** - Local API + Fallback  
✅ **TikTok** - tikwm.com API  
✅ **Instagram** - Local API + Fallback  
✅ **Facebook** - Multiple API fallbacks  
✅ **X/Twitter** - Multiple API fallbacks  

## 📝 Notes

- Pastikan server API (port 3000) berjalan sebelum menjalankan bot
- Bot akan otomatis retry dengan API fallback jika primary API gagal
- Semua download tanpa watermark (kecuali beberapa platform tertentu)
- Timeout request: 15 detik

## 🐛 Troubleshooting

1. **Error ECONNREFUSED** - Jalankan `node server.js` di folder `api-downloader`
2. **Download gagal** - Coba link yang berbeda atau tunggu beberapa saat
3. **Bot tidak respons** - Restart bot dan server API
