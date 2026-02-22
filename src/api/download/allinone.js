const axios = require('axios');

class AllInOneDownloader {
  constructor() {
    this.baseURL = 'https://allinonedownloader.com';
    this.endpoint = '/system/3c829fbbcf0387c.php';
  }

  async download(url) {
    const headers = {
      'accept': '*/*',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cookie': 'PHPSESSID=8367e29121fc8693ddf09840eaf9a645;', // Note: Ini bisa expired
      'origin': this.baseURL,
      'referer': `${this.baseURL}/`,
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    };

    const payload = new URLSearchParams({
      url: url,
      token: 'ac98e0708b18806a7e0aedaf8bfd135b9605ce9e617aebbdf3118d402ae6f15f',
      urlhash: '/EW6oWxKREb5Ji1lQRgY2f4FkImCr6gbFo1HX4VAUuiJrN+7veIcnrr+ZrfMg0Jyo46ABKmFUhf2LpwuIxiFJZZObl9tfJG7E9EMVNIbkNyiqCIdpc61WKeMmmbMW+n6'
    });

    try {
      const response = await axios.post(`${this.baseURL}${this.endpoint}`, payload.toString(), { headers });
      return response.data;
    } catch (err) {
      throw new Error("Gagal mengambil data. Token atau Cookie mungkin sudah expired.");
    }
  }
}

const downloader = new AllInOneDownloader();

module.exports = function (app) {
  /**
   * @endpoint /download/allinone
   * @category Downloader
   */
  app.get("/download/allinone", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, error: "Mana link-nya, Bang D2:业?" });

    try {
      const result = await downloader.download(url);
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
