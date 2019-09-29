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
        return fetch(this.root + "/" + url).then(response => response.json());
    }
}

export class PithItem {
    readonly title: string;
    constructor(readonly channel: PithChannel, readonly id: string, descriptor?: any) {
        if(descriptor) {
            Object.assign(this, descriptor);
        }
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
    readonly service: PithService;
    constructor(service, descriptor) {
        super(`channel/${descriptor.id}`, service.restModule);
        Object.assign(this, descriptor);
    }

    get rootDirectory() : PithDirectory {
        return new PithDirectory(this, "");
    }
}

export class PithService {
    private serviceLocation: PithDiscoveryResult;
    private restModule: RestModule;
    constructor(serviceLocation: PithDiscoveryResult) {
        this.restModule = new RestModule(`http://${serviceLocation.host}:${serviceLocation.port}/${serviceLocation.rest}/`);
    }

    listChannels() : Promise<PithChannel[]> {
        return this.restModule.get("channels").then(result => result.map((ch => new PithChannel(this, ch))));
    }
}
