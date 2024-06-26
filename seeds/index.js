require('dotenv').config();// load environment variables from .env file
const mongoose = require('mongoose');
const cities = require('./cities'); //importing cities array
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios'); //require axios request

mongoose.connect('mongodb://localhost:27017/yelp-camp') //initialize database name

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const image = await getImageURL();
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: image, // Use the fetched image
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere repudiandae sit nam earum eligendi veniam assumenda! Dolorem corporis repellat, unde accusantium eum ab molestias! Quas fuga culpa atque porro delectus?',
            price
        })
        await camp.save();
    }
}


const getImageURL = async () => {
    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            // The Authorization header is set to Client-ID YOUR_API_KEY.
            // The collection ID is passed as a query parameter using params
            headers: {
                // Load environment variables using dotenv and use process.env.UNSPLASH_API_KEY to access the Unsplash API key
                Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}` 
            },
            params: {
                collections: '1114848'
            }
        });
        return response.data.urls.small; // Adjust based on API response structure
    } catch (error) {
        console.error('Error fetching image:', error);
        return 'fallback_image_url.jpg'; // Provide a fallback in case of an error
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})