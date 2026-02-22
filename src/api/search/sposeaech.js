const axios = require('axios');

module.exports = function (app) {
    app.get("/search/spotify", async (req, res) => {
        const { q } = req.query;
        if (!q) return res.status(400).json({ status: false, error: "Judul lagu mana, Bos?" });

        try {
            const searchApi = `https://spotdown.org/api/song-details?url=${encodeURIComponent(q)}`;
            const { data } = await axios.get(searchApi);
            const song = data?.songs?.[0];

            if (!song) return res.status(404).json({ status: false, error: "Lagu tidak ditemukan." });

            res.json({
                status: true,
                creator: "D2:业",
                result: {
                    title: song.title,
                    artist: song.artist,
                    thumbnail: song.thumbnail,
                    url: song.url // URL Spotify asli ini yang dipake buat download
                }
            });
        } catch (err) {
            res.status(500).json({ status: false, error: err.message });
        }
    });
};
