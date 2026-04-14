// GUE AKTIFIN SEMUA YANG GILA DISINI - VERSI DEBUG OVERCLOCK & BERSIH (FIXED)
const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffPath = require('@ffmpeg-installer/ffmpeg').path;
const sharp = require('sharp');
const { fileTypeFromBuffer } = require('file-type');

// SET PATH FFMPEG BIAR GAK ERROR
ffmpeg.setFfmpegPath(ffPath);

// FUNGSI BUAT NGELOG BIAR RAPIH
const log = (text, level = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    let prefix = '';
    switch(level) {
        case 'error': prefix = '❌'; break;
        case 'success': prefix = '✅'; break;
        case 'warn': prefix = '⚠️'; break;
        default: prefix = '🔵'; break;
    }
    console.log(`[${timestamp}] ${prefix} ${text}`);
};

// INI BUAT NAMPILIN MENU GILA
const menuText = `

Halo, *%user*! Ini dia menu yang bisa lu pake:

*.sticker*
  _Balas foto/video/GIF dengan perintah ini buat bikin stiker._

*.brat <teks lu>*
  _Bikin stiker aesthetic ala "brat". Contoh: .brat gue ganteng_

*.tiktok <link>*
  _Download video TikTok HD tanpa watermark._

*.ig <link>*
  _Download video/post dari Instagram._

*.yt <link>*
  _Download video YouTube (bakal muncul pilihan kualitas)._

*.fb <link>*
  _Download video dari Facebook._

*.x <link>*
  _Download video dari X (Twitter)._

*.menu*
  _Nampilin menu ini lagi._

*.ping*
  _Cek kecepatan respon bot._


`;

async function startBot() {
    log('Sistem lagi di-overclock... Menyiapkan koneksi...');
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    // Dummy logger buat nge-biarin Baileys DIEM TOTAL. YANG BENAR INI!
    const makeSilentLogger = () => ({
        level: 'silent',
        info: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {},
        trace: () => {},
        child: () => makeSilentLogger() // INI KUNCI NYA! Harus return logger lagi.
    });
    const silentLogger = makeSilentLogger();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false, // Gue handle sendiri biar lebih gila
        logger: silentLogger // <<< INI DIA YANG NGE-BERSIHIN TERMINAL LU!
    });

    // NAMPILIN QR CODE DI TERMINAL
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            log('SCAN QR CODE INI DENGAN WHATSAPP LU!', 'warn');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            log(`Koneksi putus. Alasan: ${lastDisconnect.error?.message}. Reconnect? ${shouldReconnect}`, 'error');
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            log('Bot udah konek dan siap ngamuk!', 'success');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // INI INTINYA, HANDLER SEMUA PERINTAH GILA
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const type = Object.keys(msg.message)[0];
        const textMessage = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        // --- AWAL DEBUG CONSOLE ---
        console.log('\n--- [CHAT MASUK] ---');
        console.log(`Dari: ${msg.pushName} (${from.replace('@s.whatsapp.net', '')})`);
        console.log(`Pesan: "${textMessage}"`);
        // --- AKHIR DEBUG CONSOLE ---

        const prefix = '.';
        if (!textMessage.startsWith(prefix)) return;

        const command = textMessage.slice(1).trim().split(' ')[0].toLowerCase();
        const args = textMessage.trim().split(' ').slice(1);
        const q = args.join(' ');

        console.log(`[PERINTAH TERDETEKSI] -> .${command}`);
        console.log(`[ARGUMEN] -> ${q || '(tidak ada)'}`);

        const userName = msg.pushName || 'Bos';

        const reply = (text) => {
            // --- AWAL DEBUG CONSOLE ---
            console.log(`[BALASAN] -> ${userName}: "${text}"`);
            console.log('----------------------\n');
            // --- AKHIR DEBUG CONSOLE ---
            sock.sendMessage(from, { text: text }, { quoted: msg });
        };

        // PUSAT PERINTAH, CEKAT TANGAN!
        // PUSAT PERINTAH, CEKAT TANGAN!
           // PUSAT PERINTAH, CEKAT TANGAN! - VERSI YANG BENAR
        switch (command) {
            case 'menu':
                const personalizedMenu = menuText.replace('%user', userName);
                sock.sendMessage(from, { text: personalizedMenu }, { quoted: msg });
                break;

            case 'ping':
                const timestamp = Date.now() / 1000;
                const latency = Math.round((Date.now() - msg.messageTimestamp * 1000));
                reply(`🏓 Pong! Kecepatan respon: *${latency} ms*`);
                break;

            case 'sticker': {
                if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo) return reply('🔥 Balas foto/video/GIF nya dulu, goblok!');
                const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
                const mediaType = Object.keys(quotedMsg)[0];

                if (!['imageMessage', 'videoMessage'].includes(mediaType)) return reply('🔥 Itu bukan media yang bisa dijadiin stiker!');

                log(`[${command}] Proses bikin stiker dari ${mediaType.replace('Message', '')}...`);
                const stream = await downloadContentFromMessage(quotedMsg[mediaType], mediaType.replace('Message', ''));
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                const stickerPack = 'Bot WA Gigs';
                const stickerAuthor = 'Powered by Gigs & Xyren';

                ffmpeg(buffer)
                    .on('error', (err) => {
                        log(`Gagal buat stiker: ${err.message}`, 'error');
                        reply('❌ Gagal buat stiker, mungkin videonya terlalu gede atau formatnya nggak support.');
                    })
                    .on('end', () => log('Stiker selesai dibuat.', 'success'))
                    .addOutputOptions([
                        `-vcodec`, `libwebp`,
                        `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b];[a] palettegen=reserve_transparent=on:transparency_color=ffffff [p];[b][p] paletteuse`,
                        `-metadata`, `title=${stickerPack}`,
                        `-metadata`, `author=${stickerAuthor}`
                    ])
                    .toFormat('webp')
                    .save('sticker.webp')
                    .on('end', async () => {
                        const webpBuffer = fs.readFileSync('sticker.webp');
                        await sock.sendMessage(from, { sticker: webpBuffer }, { quoted: msg });
                        fs.unlinkSync('sticker.webp');
                    });
                break;
            }
            
            case 'brat': {
                if (!q) return reply('🔥 Lu mau nulis apa di stiker brat-nya? Contoh: .brat lu ganteng');
                log(`[${command}] Membuat stiker brat dengan teks: "${q}"...`);

                const fontPath = path.join(__dirname, 'fonts', 'Inter-ExtraBold.ttf');
                if (!fs.existsSync(fontPath)) return reply('❌ Font `Inter-ExtraBold.ttf` nggak ketemu di folder `fonts`! Baca tutorial nya lagi.');

                const imgWidth = 512;
                const imgHeight = 512;
                const bgColor = { r: 242, g: 239, b: 233, alpha: 1 }; // Warna khas brat
                const textColor = '#f7f7f7ff'; 

                try {
                    const svgImage = `
                    <svg width="${imgWidth}" height="${imgHeight}">
                        <rect width="100%" height="100%" fill="rgb(${bgColor.r},${bgColor.g},${bgColor.b})" />
                        <text x="50%" y="50%" font-family="Inter" font-size="42" font-weight="800" fill="${textColor}" text-anchor="middle" dominant-baseline="central">
                            ${q.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                        </text>
                    </svg>
                    `;
                    const svgBuffer = Buffer.from(svgImage);
                    const webpBuffer = await sharp(svgBuffer)
                        .webp({ quality: 100 })
                        .toBuffer();

                    await sock.sendMessage(from, { sticker: webpBuffer }, { quoted: msg });
                    log(`Stiker brat berhasil dikirim.`, 'success');

                } catch (e) {
                    log(`Gagal bikin stiker brat: ${e.message}`, 'error');
                    reply('❌ Gagal bikin stiker brat. Cek lagi teksnya atau font nya.');
                }
                break;
            }

            // --- SATU UNTUK SEMUA, YANG BENER INI ---
            case 'tiktok':
            case 'ig':
            case 'yt':
            case 'fb':
            case 'x': {
                if (!q) return reply(`🔥 Mana link ${command.toUpperCase()}-nya?`);
                
                log(`[${command}] Lagi nge-download dari: ${q}`);
                reply(`⏳ Lagi proses ${command.toUpperCase()}... Tunggu!`);

                try {
                    // INI DIA! BOT LU NGOMONG KE SERVER LOKAL LU, BUKAN KE LUAR!
                    const apiRes = await axios.get(`http://localhost:3000/download?url=${encodeURIComponent(q)}`);
                    
                    if (!apiRes.data.status) return reply(`❌ Gagal! ${apiRes.data.message}`);
                    
                    const platform = apiRes.data.platform;
                    const downloadUrl = apiRes.data.url;
                    const note = apiRes.data.note;
                    
                    reply(`⏳ Sedang download ${platform} video...`);
                    
                    try {
                        // Download video langsung
                        const videoBuffer = await axios.get(downloadUrl, { 
                            responseType: 'arraybuffer',
                            timeout: 30000
                        }).then(res => res.data);
                        
                        // Check if it's actually a video file
                        if (videoBuffer.length < 100000) { // Less than 100KB = probably not a video
                            throw new Error('File too small, not a valid video');
                        }
                        
                        // Kirim video ke WhatsApp
                        await sock.sendMessage(from, { 
                            video: videoBuffer, 
                            caption: `✅ Download dari ${platform} selesai!` 
                        }, { quoted: msg });
                        
                        log(`Video ${platform} berhasil dikirim.`, 'success');
                        
                    } catch (downloadError) {
                        // Smart fallback dengan instruksi yang sangat jelas
                        if (platform === 'X/Twitter') {
                            reply(`📱 ${platform} video detected!\n\n🔗 ${downloadUrl}\n\n💡 Cara download:\n1. Klik link di atas\n2. Buka di browser (Chrome/Safari)\n3. Play video\n4. Klik ikon Download\n5. Pilih kualitas video\n\n🎥 Atau gunakan aplikasi Twitter/X untuk download langsung!`);
                        } else if (platform === 'Facebook') {
                            reply(`📱 ${platform} video detected!\n\n🔗 ${downloadUrl}\n\n💡 Cara download:\n1. Klik link di atas\n2. Buka di browser\n3. Play video\n4. Klik ikon Download\n5. Pilih kualitas video\n\n🎥 Atau gunakan aplikasi Facebook untuk download langsung!`);
                        } else if (platform === 'YouTube') {
                            reply(`🎬 YouTube video detected!\n\n🔗 ${downloadUrl}\n\n💡 Cara download:\n1. Klik link di atas\n2. Buka di YouTube\n3. Klik tombol Download\n4. Pilih kualitas video\n\n📱 Atau gunakan YouTube Music/YouTube Premium untuk offline download!`);
                        } else {
                            reply(`❌ Download gagal. Silahkan download manual:\n\n🔗 ${downloadUrl}\n\n💡 Tips: Buka link di browser dan download manual.`);
                        }
                        log(`Download ${platform} gagal: ${downloadError.message}`, 'error');
                    }

                } catch (err) {
                    log(`Error download ${command}: ${err.message}`, 'error');
                    if (err.code === 'ECONNREFUSED') {
                        reply('❌ ERROR! Server download-nya (api-downloader) belum dijalanin. Jalanin dulu `node server.js` di folder `api-downloader`-nya!');
                    } else {
                        reply('❌ Error! Mungkin linknya nggak valid atau server download-nya lagi lemot.');
                    }
                }
                break;
            }

            default:
                reply('🔥 Perintah nggak dikenal! Ketik *.menu* buat liat yang ada.');
                break;
        }
    });
}

// JALANIN SISTEM GILA INI
startBot();

// FUNGSI BANTUAN BUAT DOWNLOAD MEDIA
async function downloadContentFromMessage(message, type) {
    const stream = await downloadMediaMessage(message, { });
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}