import dotenv from 'dotenv';
import axios from 'axios';
import protobuf from 'protobufjs';
dotenv.config();

export async function getBusDepartures () {

    const viaList = {
        "4": "Raksila, Kastelli, Maikkula",
        "4A": "Raksila, Kastelli, Maikkula",
        "18": "Karjasilta, Höyhtyä",
        "20": "Raksila, OYS",
        "20+": "Raksila, OYS",
        "20BH": "Raksila",
        "20K": "Raksila, OYS",
        "21": "Limingantulli, Joutsensilta",
    };

    try {

        const busData = await axios.get("https://oulu.mattersoft.fi/timetable/rest/stopdisplays/1791", {
            headers: {
                Apikey: process.env.MATTERSOFT_API_KEY
            }
        });

        console.log("BUS DATA", busData.data);

        //console.log("ARRIVALS", arrivals);

        /*const linesToKaijo = busDataNorth.data.stops[0].lines.find(line => line.lineName === "18");
        linesToKaijo.north = true;
        */

        let departures = busData.data.nextStopVisits.reduce((arr, bus) => {
            bus.stopVisits.forEach(stopVisit => {
                arr.push({
                    line: bus.directionOfLine.lineNumber,
                    direction: bus.directionOfLine.destinationName,
                    via: viaList[bus.directionOfLine.lineNumber],
                    time: stopVisit.scheduledDepartureTime,
                    realtime: stopVisit.estimatedDepartureTime,
                })
            });
            return arr;
        }, []);
        /*let departures = busData.data.nextStopVisits.lines.reduce((acc, line) => {
            return acc.concat(
            (line.departures?.map(departure => ({
                line: line.lineName,
                direction: line.lineDirectionName,
                via: viaList[line.lineName],
                time: departure.departureSchedule,
                realtimeId: departure.realtimeId,
                north: line.north
                })) || [])
                .filter(departure => !!departure)
            );
        }, []);

        //fetch realtime data
        const realtimeData = await axios.post("https://jl.oulunliikenne.fi/api/fara/realtime", {
            citySymbol: "FI_OULU",
            vehicles: departures
            .filter(departure => !!departure.realtimeId)
            .map(departure => (
                {
                realtimeId: departure.realtimeId,
                bufferedSeconds: 0,
                predictionForStopCode: process.env.BUS_STOP_CODE,
                }
            ))
        })
        
        //Shorten direction name
        departures.forEach(departure => {
            if(departure.direction === "Oulu, linja-autoasema") {
            departure.direction = "Linja-autoasema";
            }
        });

        //Add realtime data
        departures.forEach(departure => {
            if(!departure.realtimeId) return;

            departure.realtime = realtimeData.data.vehicles.find(vehicle => vehicle.realtimeId === departure.realtimeId).stopPrediction.realtimeDeparture;
        });*/

        const sortedDepartures = departures.sort((a, b) => new Date(a.realtime ? a.realtime : a.time) - new Date(b.realtime ? b.realtime : b.time));
        return sortedDepartures;
        } catch (e) {
        console.error(e);
        return [];
    }

        /*
       
        const busKey = process.env.BUS_API_KEY;

        const encodedBusKey = Buffer.from(busKey).toString('base64');

        const busData = await axios.get("https://data.waltti.fi/oulu/api/gtfsrealtime/v1.0/feed/tripupdate", {
            headers: {
                Authorization: `Basic ${encodedBusKey}`
            },
            responseType: "arraybuffer"
        });

        const root = await protobuf.load("gtfs-realtime.proto");
        const FeedMessage = root.lookupType("transit_realtime.FeedMessage");

        const message = FeedMessage.decode(new Uint8Array(busData.data));
        const object = FeedMessage.toObject(message, {
            longs: String,
            enums: String,
            bytes: String,
        });

        const arrivals = object.entity.filter(entity => {
            return entity.tripUpdate.stopTimeUpdate.find(stop => stop.stopId === process.env.BUS_STOP_ID);
        }).map(entity => {

            const correctStop = entity.tripUpdate.stopTimeUpdate.find(stop => stop.stopId === process.env.BUS_STOP_ID);
            console.log("ENTITY", entity);

            return {
                time: correctStop.arrival.time ? new Date(correctStop.arrival.time * 1000).toLocaleString() : null,
                line: entity.tripUpdate.trip.routeId,
            }
        });*/
}
