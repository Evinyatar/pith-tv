import ZeroConf from "react-native-zeroconf";

export class PithDiscoveryResult {
    host: string;
    port: number;
    name: string;
    rest: string;
}

export class PithDiscovery {
    private zeroconf: ZeroConf;
    constructor() {
        this.zeroconf = new ZeroConf();
    }

    start() {
        this.zeroconf.on("resolved", (evt) => console.log("resolved", evt));
        this.zeroconf.on("found", (evt) => console.log("found", evt));
        this.zeroconf.on("error", (evt) => console.log("error", evt));
        this.zeroconf.on("start", (evt) => console.log("start", evt));
        this.zeroconf.on("stop", (evt) => console.log("stop", evt));
        this.zeroconf.on("update", (evt) => console.log("update", evt, this.zeroconf.getServices()));
        this.zeroconf.scan("airplay", "tcp", "local.");
        console.log("start");
    }

    get deviceList() : PithDiscoveryResult[] {
        return [{
            host: "192.168.1.4",
            port: 3333,
            name: "Kyros",
            rest: "rest"
        }];
    }
}
