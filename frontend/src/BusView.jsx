import { formatTime } from "./utils";

export default function BusView({buses}) {
    return (
        <>
            {
                buses.slice(0,4).map(bus => {
        
                    let realtime = false;
                    let time = bus.time;
                    let originalTime = bus.time;
                    let delay = 0;
                    if(bus.realtime) {
                        realtime = true;
                        time = bus.realtime;
                        delay = Math.floor((bus.realtime - bus.time) / 60000);
                        if(delay >= 0) {
                        delay = "+" + delay;
                        }
                    }

                    time -= new Date().getTimezoneOffset() * -60000; // Adjust for timezone offset
                    originalTime -= new Date().getTimezoneOffset() * -60000; // Adjust for timezone offset
            
                    const rawMinutesTil = Math.ceil((time - new Date()) / 60000);
                    const hoursTil = Math.floor(rawMinutesTil / 60);
                    const minutesTil = rawMinutesTil % 60;
                    
                    return (
                        <div className={`buscard ${bus.north ? "north" : ""}`} key={bus.line + bus.time}>
                        <div className="timetil">
                            {hoursTil > 0 ? <><span className="timetilnum">{hoursTil}</span>h</> : ""}<><span className="timetilnum">{minutesTil}</span>min</>
                        </div>
                        <div className="businfo">
                            <h2>{bus.line} {bus.direction}</h2>
                            <span className="via">{bus.via && !bus.north ? bus.via : ""}</span>
                            <p className="busclock">
                            {formatTime(originalTime)}
                            <span className="delay">{realtime ? delay : ""}</span>
                            </p>
                        </div>
                        </div>
                    );
                })
            }
        </>
    );
}