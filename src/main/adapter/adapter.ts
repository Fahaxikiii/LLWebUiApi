import { ServerConfig } from "../../common/types";

export function defaultServerAdapterCallback(ActionName: string, ArgData: string): string {
	console.log(ActionName, ArgData);
	// 统一处理
	return JSON.stringify({ code: 200, data: [] });
}

/**
* @description 外部Api接口抽象类
*/
export abstract class ServerAdapter {
	public CurrentConfig: ServerConfig | undefined = undefined;
	/**
	 * @description 初始化配置
	 */
	constructor() { }
	/**
	 * @description 注册数据处理回调函数
	 */
	public setCallBack(_Callback: any) { }
	/**
	 * @description 启动服务器
	 */
	public onListening() { }
	/**
	 * @description 重新设定配置属性
	 */
	public setConfig() { }
	/**
	  * @description 获取配置属性
	  */
	public getConfig() { }

}