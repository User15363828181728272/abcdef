const axios = require('axios');

/**
 * Douyin Downloader (Video & Images)
 * Source: SnapVideoTools / AgungDevX
 * Category: Download
 * Creator: D2:业
 */

async function douyinDl(url) {
    try {
        const { data } = await axios.post('https://snapvideotools.com/id/api/snap', 
            { text: url },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
                    'Referer': 'https://snapvideotools.com/id/douyin-downloader'
                }
            }
        );

        if (data.code !== 0 || !data.data) {
            throw new Error("Gagal mengambil data Douyin. Cek kembali link-nya.");
        }

        const res = data.data;

        // Validasi: Kalau bukan Douyin, kita tolak biar konsisten
        if (!res.platformName.toLowerCase().includes('douyin')) {
            throw new Error("Ini bukan link Douyin, Bos!");
        }

        return {
            title: res.title || 'Douyin Video',
            thumbnail: res.cover,
            medias: res.mediaUrls.map(m => ({
                type: m.type, // 'video' atau 'image'
                url: m.url,
                ext: m.suffix
            }))
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = function (app) {
    /**
     * @endpoint /v1/download/douyin
     * @query ?url=https://www.douyin.com/video/xxx
     */
    app.get("/v1/download/douyin", async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: "Link Douyin-nya mana?" });

        try {
            const result = await douyinDl(url);
            res.json({
                status: true,
                creator: "D2:业",
                result: result
            });
        } catch (err) {
            res.status(500).json({ status: false, error: err.message });
        }
    });
};
