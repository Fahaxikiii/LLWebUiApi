import { BrowserWindow, ipcMain } from "electron";
let proxyIpcInvokeList: any[] = [];
export async function IPCExecuteCall(channel: string, ...args: any[]) {
    console.log("reg hook");
    console.log(proxyIpcInvokeList[0])
    return proxyIpcInvokeList[0](
        {
            _replyChannel: { sendReply: function (...vargs: any) { console.log(vargs); } },
            frameId: 1,
            processId: 1
        },
        false,
        channel,
        [...args]
    );
}
export function HookIpcReceiveHandle(window: BrowserWindow) {
    const originalSend = window.webContents.send;
    const patchSend = (channel: string, ...args: any) => {
        // HOOK IPC Receive
        if (channel.indexOf("IPC_") != -1) {
        } else {
            // console.log(args);
        }
        originalSend.call(window.webContents, channel, ...args);
    }
    window.webContents.send = patchSend;
}
export function HookIpcCallHandle(window: BrowserWindow) {
    // HOOK IPC Call
    let webContents = window.webContents as any;
    const ipc_message_proxy = webContents._events["-ipc-message"]?.[0] || webContents._events["-ipc-message"];
    const proxyIpcMsg = new Proxy(ipc_message_proxy, {
        apply(target, thisArg, args) {
            let ret = target.apply(thisArg, args);
            if ((args as Array<any>).length > 2) {
                if (args[2].indexOf("IPC_UP") != -1) {

                } else {
                    console.log(args);
                    //console.log("IPC_Call", args);
                }
            } else {

            }
            return ret;
        },
    });
    const ipc_invoke_proxy = webContents._events["-ipc-invoke"]?.[0] || webContents._events["-ipc-invoke"];
    const proxyIpcInvoke = new Proxy(ipc_invoke_proxy, {
        apply(target, thisArg, args) {
            console.log(args);
            args[0]["_replyChannel"]["sendReply"] = new Proxy(args[0]["_replyChannel"]["sendReply"], {
                apply(sendtarget, sendthisArg, sendargs) {

                    sendtarget.apply(sendthisArg, sendargs);
                }
            });
            let ret = target.apply(thisArg, args);
            return ret;
        }
    });
    if (webContents._events["-ipc-message"]?.[0]) {
        webContents._events["-ipc-message"][0] = proxyIpcMsg;
    } else {
        webContents._events["-ipc-message"] = proxyIpcMsg;
    }

    if (webContents._events["-ipc-invoke"]?.[0]) {
        webContents._events["-ipc-invoke"][0] = proxyIpcInvoke;
        proxyIpcInvokeList.push(webContents._events["-ipc-invoke"][0]);
    } else {
        webContents._events["-ipc-invoke"] = proxyIpcInvoke;
        proxyIpcInvokeList.push(webContents._events["-ipc-invoke"]);
    }
}
export function IpcApiSend(channel: string, args: any): boolean {
    return ipcMain.emit(
        channel,
        {},
        ...args
    );
}