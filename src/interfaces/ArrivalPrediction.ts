export interface ArrivalPrediction {
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
