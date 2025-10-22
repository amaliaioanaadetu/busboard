import axios from "axios";

interface ArrivalPrediction {
    id: string;
    lineId: string;
    lineName: string;
    destinationName: string;
    timeToStation: number;
    expectedArrival: string;
    stationName: string;
    platformName: string;
    direction: string;
    modeName: string;
}

interface BusArrival {
    lineName: string;
    destinationName: string;
    timeToStationMinutes: number;
}


export async function fetchArrivalsByStopCode(stopCode: string) {
    try {
        const response = await axios.get<ArrivalPrediction[]>(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals`);
        const arrivals: BusArrival[] = response.data
            .map((bus) => ({
                lineName: bus.lineName,
                destinationName: bus.destinationName,
                timeToStationMinutes: bus.timeToStation / 60,
            }))
            .sort((a: BusArrival, b: BusArrival) => a.timeToStationMinutes - b.timeToStationMinutes)
            .slice(0, 5);
        return arrivals;
    } catch (error) {
        console.error(error);
    }
}

export async function fetchArrivalsByPostcode(postcode: string) {
    try {
        const postcodeInfo = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
        const { latitude, longitude } = postcodeInfo.data.result;

        const stopTypes = await axios.get(`https://api.tfl.gov.uk/StopPoint/meta/stoptypes`);
        const stopTypesString = stopTypes.data.join(',');

        const response = await axios.get<ArrivalPrediction[]>(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=${stopTypesString}`);
        const nearestStopPoints = response.data.stopPoints.slice(0, 2);

        const arrivals: BusArrival[] = [];

        for (const stopPoint of nearestStopPoints) {
            for (const childStop of stopPoint.children) {
                const busPredictions = await fetchArrivalsByStopCode(childStop.naptanId); // await aici

                busPredictions?.forEach(bus => {
                    arrivals.push(bus);
                });
            }
        }

        arrivals.sort((a, b) => a.timeToStationMinutes - b.timeToStationMinutes);

        return arrivals.slice(0, 5);

    } catch (error) {
        console.error(error);
    }
}



