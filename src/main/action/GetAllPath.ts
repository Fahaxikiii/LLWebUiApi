import { BaseAction } from "./BaseAction";
import { ActionName } from "./types";

export interface GetAllPathResponse {
    LiteLoaderPath: string;
    PluginPath: string;//所有插件
    ConfigPath: string;//所有插件
    QQPath: string;
}

export class GetAllPath extends BaseAction<void, GetAllPathResponse> {
    public actionName: string = ActionName.GetAllPath;
    public async _handle(_payload: void): Promise<GetAllPathResponse> {
        const resData: GetAllPathResponse =
        {
            LiteLoaderPath: "string",
            PluginPath: "string",
            ConfigPath: "string",
            QQPath: "string"
        };
        return resData;
    }
}