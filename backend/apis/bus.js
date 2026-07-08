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

        const sortedDepartures = departures.sort((a, b) => new Date(a.realtime ? a.realtime : a.time) - new Date(b.realtime ? b.realtime : b.time));
        return sortedDepartures;
        } catch (e) {
        console.error(e);
        return [];
    }
}
