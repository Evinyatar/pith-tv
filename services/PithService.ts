import {PithDiscoveryResult} from "./PithDiscovery";

export class RestModule {
    private root: string;
    constructor(root: string);
    constructor(subpath: string, parent: RestModule);
    constructor(rootOrSubpath: string, parent?: RestModule) {
        if(parent && rootOrSubpath) {
            this.root = parent.root + "/" + rootOrSubpath;
        } else {
            this.root = rootOrSubpath;
        }
    }

    get(url) {
        return fetch(this.resolve(url)).then(response => response.json());
    }

    resolve(url) {
        return this.root + "/" + url;
    }
}

export class PithItemStream {
    duration: number;
    format: {
        streams: {}[]
    };
    mimetype: string;
    seekable: boolean;
    streams: {}[];
    url: string;
}

export class PithStreamDetails {
    item: any;
    stream: PithItemStream;
}

export class PithItem {
    readonly title: string;
    readonly playable: boolean;
    readonly poster: string;
    constructor(readonly channel: PithChannel, readonly id: string, descriptor?: any) {
        if(descriptor) {
            Object.assign(this, descriptor);
        }
    }

    getStreamDetails(): Promise<PithStreamDetails> {
        return this.channel.get('stream/' + this.id);
    }

    get service(): PithService {
        return this.channel.service;
    }
}
export class PithDirectory extends PithItem {
    readonly title: string;
    constructor(readonly channel: PithChannel, readonly id: string, descriptor?: any) {
        super(channel, id, descriptor);
    }

    async listContents() {
        return this.channel.get(`list/${this.id}`).then(result => result.map(r => {
            if(r.type === "container") {
                return new PithDirectory(this.channel, r.id, r);
            } else {
                return new PithItem(this.channel, r.id, r);
            }
        }));
    }
}

export class PithChannel extends RestModule {
    readonly id: string;
    readonly title: string;
    readonly channel: PithChannel;
    constructor(private service: PithService, descriptor) {
        super(`channel/${descriptor.id}`, service.restModule);
        Object.assign(this, descriptor);
    }

    get rootDirectory() : PithDirectory {
        return new PithDirectory(this, "");
    }
}

export class PithService {
    readonly restModule: RestModule;
    constructor(private serviceLocation: PithDiscoveryResult) {
        this.restModule = new RestModule(this.resolve(serviceLocation.rest));
    }

    private resolve(url: string) {
        return `http://${this.serviceLocation.host}:${this.serviceLocation.port}/${url}/`;
    }

    listChannels() : Promise<PithChannel[]> {
        return this.restModule.get("channels").then(result => result.map((ch => new PithChannel(this, ch))));
    }

    getImage(url: string, width: number, height: number) {
        return this.resolve(`scale/${url}?size=${width}x${height}`);
    }
}
