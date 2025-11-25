import { fetchWeather } from "../services/weatherService.js";

export const getWeather = async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required. ",
      });
    }

    const data = await fetchWeather(city);
    return res.json(data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch weather data",
    });
  }
};
