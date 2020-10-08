import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

async function addGoogleMaps() {
  return new Promise((resolve, reject) => {
    const htmlHead = document.head!;
    let script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
    script.async = true;
    script.defer = true;
    htmlHead.append(script);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Oops! Something went wrong'));
  })
}

async function searchAddressHandler(event: Event) {
  try {
    event.preventDefault();

    const addressInput = document.getElementById('address')! as HTMLInputElement;
    const enteredAddress = addressInput.value;

    const response = await axios.get<GoogleGeocodingResponse>(
  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
    )

    if (response.data.status !== 'OK') {
      throw new Error('Could not fetch location!');
    }
    const coordinates = response.data.results[0].geometry.location;
    const map = new google.maps.Map(document.getElementById('map')!, {
      center: coordinates,
      zoom: 16
    });

    new google.maps.Marker({ position: coordinates, map });
  } catch (error) {
    alert(error.message);
    console.log(error);
  }
}

(async function () {
  try {
    await addGoogleMaps();

    const form = document.querySelector('form')!;
    form.addEventListener('submit', searchAddressHandler);
  } catch (error) {
    alert(error.message);
    console.log(error);
  }
})();
