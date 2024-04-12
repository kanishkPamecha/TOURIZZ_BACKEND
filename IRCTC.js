const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/pnr/:pnrNumber', async (req, res) => {
  const { pnrNumber } = req.params;
  const { recaptchaToken } = req.body;

  try {
    // Verify the reCAPTCHA token
    const recaptchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: '6Lc365ooAAAAAKhDPLeU6w5h9XIHF0TBumS72k_c', 
          response: recaptchaToken,
        },
      }
    );

    if (recaptchaResponse.data.success) {
      // If reCAPTCHA is verified, proceed with PNR status request
      const response = await axios.get(`IRCTC_API_URL/${pnrNumber}`);
      const pnrStatus = response.data; // Assuming API returns JSON
      res.json(pnrStatus);
    } else {
      res.status(403).json({ error: 'reCAPTCHA verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching PNR status. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
