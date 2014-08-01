/*!  * ASP.NET SignalR JavaScript Library v1.1.2  * http://signalr.net/  *  * Copyright Microsoft Open Technologies, Inc. All rights reserved.  * Licensed under the Apache 2.0  * https://github.com/SignalR/SignalR/blob/master/LICENSE.md  *  */
(function (n, t) { "use strict"; function a(t, r) { var u, f; if (n.isArray(t)) { for (u = t.length - 1; u >= 0; u--) f = t[u], n.type(t) === "object" || n.type(f) === "string" && i.transports[f] || (r.log("Invalid transport: " + f + ", removing it from the transports list."), t.splice(u, 1)); t.length === 0 && (r.log("No transports remain within the specified transport array."), t = null) } else if (n.type(t) === "object" || i.transports[t] || t === "auto") { if (t === "auto" && i._.ieVersion <= 8) return ["longPolling"] } else r.log("Invalid transport: " + t.toString()), t = null; return t } function v(n) { return n === "http:" ? 80 : n === "https:" ? 443 : void 0 } function s(n, t) { return t.match(/:\d+$/) ? t : t + ":" + v(n) } if (typeof n != "function") throw new Error("SignalR: jQuery not found. Please ensure jQuery is referenced before the SignalR.js file."); if (!t.JSON) throw new Error("SignalR: No JSON parser found. Please ensure json2.js is referenced before the SignalR.js file if you need to support clients without native JSON parsing support, e.g. IE<8."); var i, e, o = t.document.readyState === "complete", f = n(t), r = { onStart: "onStart", onStarting: "onStarting", onReceived: "onReceived", onError: "onError", onConnectionSlow: "onConnectionSlow", onReconnecting: "onReconnecting", onReconnect: "onReconnect", onStateChanged: "onStateChanged", onDisconnect: "onDisconnect" }, h = function (n, i) { if (i !== !1) { var r; typeof t.console != "undefined" && (r = "[" + (new Date).toTimeString() + "] SignalR: " + n, t.console.debug ? t.console.debug(r) : t.console.log && t.console.log(r)) } }, u = function (t, i, u) { return i === t.state ? (t.state = u, n(t).triggerHandler(r.onStateChanged, [{ oldState: i, newState: u }]), !0) : !1 }, c = function (n) { return n.state === i.connectionState.disconnected }, l = function (n) { var r, u; n._.configuredStopReconnectingTimeout || (u = function (n) { n.log("Couldn't reconnect within the configured timeout (" + n.disconnectTimeout + "ms), disconnecting."), n.stop(!1, !1) }, n.reconnecting(function () { var n = this; n.state === i.connectionState.reconnecting && (r = t.setTimeout(function () { u(n) }, n.disconnectTimeout)) }), n.stateChanged(function (n) { n.oldState === i.connectionState.reconnecting && t.clearTimeout(r) }), n._.configuredStopReconnectingTimeout = !0) }; i = function (n, t, r) { return new i.fn.init(n, t, r) }, i._ = { defaultContentType: "application/x-www-form-urlencoded; charset=UTF-8", ieVersion: function () { var i, n; return t.navigator.appName === "Microsoft Internet Explorer" && (n = /MSIE ([0-9]+\.[0-9]+)/.exec(t.navigator.userAgent), n && (i = t.parseFloat(n[1]))), i }() }, i.events = r, i.changeState = u, i.isDisconnecting = c, i.connectionState = { connecting: 0, connected: 1, reconnecting: 2, disconnected: 4 }, i.hub = { start: function () { throw new Error("SignalR: Error loading hubs. Ensure your hubs reference is correct, e.g. <script src='/signalr/hubs'><\/script>."); } }, f.load(function () { o = !0 }), i.fn = i.prototype = { init: function (n, t, i) { this.url = n, this.qs = t, this._ = {}, typeof i == "boolean" && (this.logging = i) }, isCrossDomain: function (i, r) { var u; return (i = n.trim(i), i.indexOf("http") !== 0) ? !1 : (r = r || t.location, u = t.document.createElement("a"), u.href = i, u.protocol + s(u.protocol, u.host) !== r.protocol + s(r.protocol, r.host)) }, ajaxDataType: "json", contentType: "application/json; charset=UTF-8", logging: !1, state: i.connectionState.disconnected, keepAliveData: {}, reconnectDelay: 2e3, disconnectTimeout: 3e4, keepAliveWarnAt: 2 / 3, start: function (e, s) { var h = this, c = { waitForPageLoad: !0, transport: "auto", jsonp: !1 }, w, v = h._deferral || n.Deferred(), y = t.document.createElement("a"), p; if (n.type(e) === "function" ? s = e : n.type(e) === "object" && (n.extend(c, e), n.type(c.callback) === "function" && (s = c.callback)), c.transport = a(c.transport, h), !c.transport) throw new Error("SignalR: Invalid transport(s) specified, aborting start."); return !o && c.waitForPageLoad === !0 ? (f.load(function () { h._deferral = v, h.start(e, s) }), v.promise()) : (l(h), u(h, i.connectionState.disconnected, i.connectionState.connecting) === !1) ? (v.resolve(h), v.promise()) : (y.href = h.url, y.protocol && y.protocol !== ":" ? (h.protocol = y.protocol, h.host = y.host, h.baseUrl = y.protocol + "//" + y.host) : (h.protocol = t.document.location.protocol, h.host = t.document.location.host, h.baseUrl = h.protocol + "//" + h.host), h.wsProtocol = h.protocol === "https:" ? "wss://" : "ws://", c.transport === "auto" && c.jsonp === !0 && (c.transport = "longPolling"), this.isCrossDomain(h.url) && (h.log("Auto detected cross domain url."), c.transport === "auto" && (c.transport = ["webSockets", "longPolling"]), c.jsonp || (c.jsonp = !n.support.cors, c.jsonp && h.log("Using jsonp because this browser doesn't support CORS")), h.contentType = i._.defaultContentType), h.ajaxDataType = c.jsonp ? "jsonp" : "json", n(h).bind(r.onStart, function () { n.type(s) === "function" && s.call(h), v.resolve(h) }), w = function (t, e) { if (e = e || 0, e >= t.length) { h.transport || (n(h).triggerHandler(r.onError, ["SignalR: No transport could be initialized successfully. Try specifying a different transport or none at all for auto initialization."]), v.reject("SignalR: No transport could be initialized successfully. Try specifying a different transport or none at all for auto initialization."), h.stop()); return } var o = t[e], s = n.type(o) === "object" ? o : i.transports[o]; if (o.indexOf("_") === 0) { w(t, e + 1); return } s.start(h, function () { s.supportsKeepAlive && h.keepAliveData.activated && i.transports._logic.monitorKeepAlive(h), h.transport = s, u(h, i.connectionState.connecting, i.connectionState.connected), n(h).triggerHandler(r.onStart), f.unload(function () { h.stop(!1) }) }, function () { w(t, e + 1) }) }, p = h.url + "/negotiate", p = i.transports._logic.addQs(p, h), h.log("Negotiating with '" + p + "'."), n.ajax({ url: p, global: !1, cache: !1, type: "GET", contentType: h.contentType, data: {}, dataType: h.ajaxDataType, error: function (t) { n(h).triggerHandler(r.onError, [t.responseText]), v.reject("SignalR: Error during negotiation request: " + t.responseText), h.stop() }, success: function (t) { var u = h.keepAliveData, f, e; if (h.appRelativeUrl = t.Url, h.id = t.ConnectionId, h.token = t.ConnectionToken, h.webSocketServerUrl = t.WebSocketServerUrl, h.disconnectTimeout = t.DisconnectTimeout * 1e3, t.KeepAliveTimeout ? (u.activated = !0, u.timeout = t.KeepAliveTimeout * 1e3, u.timeoutWarning = u.timeout * h.keepAliveWarnAt, u.checkInterval = (u.timeout - u.timeoutWarning) / 3) : u.activated = !1, !t.ProtocolVersion || t.ProtocolVersion !== "1.2") { n(h).triggerHandler(r.onError, ["You are using a version of the client that isn't compatible with the server. Client version 1.2, server version " + t.ProtocolVersion + "."]), v.reject("You are using a version of the client that isn't compatible with the server. Client version 1.2, server version " + t.ProtocolVersion + "."); return } n(h).triggerHandler(r.onStarting), f = [], e = [], n.each(i.transports, function (n) { if (n === "webSockets" && !t.TryWebSockets) return !0; e.push(n) }), n.isArray(c.transport) ? n.each(c.transport, function () { var t = this; (n.type(t) === "object" || n.type(t) === "string" && n.inArray("" + t, e) >= 0) && f.push(n.type(t) === "string" ? "" + t : t) }) : n.type(c.transport) === "object" || n.inArray(c.transport, e) >= 0 ? f.push(c.transport) : f = e, w(f) } }), v.promise()) }, starting: function (t) { var i = this; return n(i).bind(r.onStarting, function () { t.call(i) }), i }, send: function (n) { var t = this; if (t.state === i.connectionState.disconnected) throw new Error("SignalR: Connection must be started before data can be sent. Call .start() before .send()"); if (t.state === i.connectionState.connecting) throw new Error("SignalR: Connection has not been fully initialized. Use .start().done() or .start().fail() to run logic after the connection has started."); return t.transport.send(t, n), t }, received: function (t) { var i = this; return n(i).bind(r.onReceived, function (n, r) { t.call(i, r) }), i }, stateChanged: function (t) { var i = this; return n(i).bind(r.onStateChanged, function (n, r) { t.call(i, r) }), i }, error: function (t) { var i = this; return n(i).bind(r.onError, function (n, r) { t.call(i, r) }), i }, disconnected: function (t) { var i = this; return n(i).bind(r.onDisconnect, function () { t.call(i) }), i }, connectionSlow: function (t) { var i = this; return n(i).bind(r.onConnectionSlow, function () { t.call(i) }), i }, reconnecting: function (t) { var i = this; return n(i).bind(r.onReconnecting, function () { t.call(i) }), i }, reconnected: function (t) { var i = this; return n(i).bind(r.onReconnect, function () { t.call(i) }), i }, stop: function (t, f) { var e = this; if (e.state !== i.connectionState.disconnected) { try { e.transport && (f !== !1 && e.transport.abort(e, t), e.transport.supportsKeepAlive && e.keepAliveData.activated && i.transports._logic.stopMonitoringKeepAlive(e), e.transport.stop(e), e.transport = null), n(e).triggerHandler(r.onDisconnect), delete e.messageId, delete e.groupsToken, delete e.id, delete e._deferral } finally { u(e, e.state, i.connectionState.disconnected) } return e } }, log: function (n) { h(n, this.logging) } }, i.fn.init.prototype = i.fn, i.noConflict = function () { return n.connection === i && (n.connection = e), i }, n.connection && (e = n.connection), n.connection = n.signalR = i })(window.jQuery, window), function (n, t) { "use strict"; function u(f) { var e = f.keepAliveData, o, s; f.state === i.connectionState.connected && (o = new Date, o.setTime(o - e.lastKeepAlive), s = o.getTime(), s >= e.timeout ? (f.log("Keep alive timed out.  Notifying transport that connection has been lost."), f.transport.lostConnection(f)) : s >= e.timeoutWarning ? e.userNotified || (f.log("Keep alive has been missed, connection may be dead/slow."), n(f).triggerHandler(r.onConnectionSlow), e.userNotified = !0) : e.userNotified = !1), e.monitoring && t.setTimeout(function () { u(f) }, e.checkInterval) } function e(n) { return n.state === i.connectionState.connected || n.state === i.connectionState.reconnecting } var i = n.signalR, r = n.signalR.events, f = n.signalR.changeState; i.transports = {}, i.transports._logic = { pingServer: function (t, i) { var f = i === "webSockets" ? "" : t.baseUrl, u = f + t.appRelativeUrl + "/ping", r = n.Deferred(); return u = this.addQs(u, t), n.ajax({ url: u, global: !1, cache: !1, type: "GET", contentType: t.contentType, data: {}, dataType: t.ajaxDataType, success: function (n) { n.Response === "pong" ? r.resolve() : r.reject("SignalR: Invalid ping response when pinging server: " + (n.responseText || n.statusText)) }, error: function (n) { r.reject("SignalR: Error pinging server: " + (n.responseText || n.statusText)) } }), r.promise() }, addQs: function (t, i) { var r = t.indexOf("?") !== -1 ? "&" : "?", u; if (!i.qs) return t; if (typeof i.qs == "object") return t + r + n.param(i.qs); if (typeof i.qs == "string") return u = i.qs.charAt(0), (u === "?" || u === "&") && (r = ""), t + r + i.qs; throw new Error("Connections query string property must be either a string or object."); }, getUrl: function (n, i, r, u) { var o = i === "webSockets" ? "" : n.baseUrl, f = o + n.appRelativeUrl, e = "transport=" + i + "&connectionToken=" + t.encodeURIComponent(n.token); return n.data && (e += "&connectionData=" + t.encodeURIComponent(n.data)), n.groupsToken && (e += "&groupsToken=" + t.encodeURIComponent(n.groupsToken)), r ? (f += u ? "/poll" : "/reconnect", n.messageId && (e += "&messageId=" + t.encodeURIComponent(n.messageId))) : f += "/connect", f += "?" + e, f = this.addQs(f, n), f += "&tid=" + Math.floor(Math.random() * 11) }, maximizePersistentResponse: function (n) { return { MessageId: n.C, Messages: n.M, Disconnect: typeof n.D != "undefined" ? !0 : !1, TimedOut: typeof n.T != "undefined" ? !0 : !1, LongPollDelay: n.L, GroupsToken: n.G } }, updateGroups: function (n, t) { t && (n.groupsToken = t) }, ajaxSend: function (u, f) { var e = u.url + "/send?transport=" + u.transport.name + "&connectionToken=" + t.encodeURIComponent(u.token); return e = this.addQs(e, u), n.ajax({ url: e, global: !1, type: u.ajaxDataType === "jsonp" ? "GET" : "POST", contentType: i._.defaultContentType, dataType: u.ajaxDataType, data: { data: f }, success: function (t) { t && n(u).triggerHandler(r.onReceived, [t]) }, error: function (t, i) { i !== "abort" && i !== "parsererror" && n(u).triggerHandler(r.onError, [t]) } }) }, ajaxAbort: function (i, r) { if (typeof i.transport != "undefined") { r = typeof r == "undefined" ? !0 : r; var u = i.url + "/abort?transport=" + i.transport.name + "&connectionToken=" + t.encodeURIComponent(i.token); u = this.addQs(u, i), n.ajax({ url: u, async: r, timeout: 1e3, global: !1, type: "POST", contentType: i.contentType, dataType: i.ajaxDataType, data: {} }), i.log("Fired ajax abort async = " + r) } }, processMessages: function (t, i) { var u, f; if (t.transport) { if (f = n(t), t.transport.supportsKeepAlive && t.keepAliveData.activated && this.updateKeepAlive(t), !i) return; if (u = this.maximizePersistentResponse(i), u.Disconnect) { t.log("Disconnect command received from server"), t.stop(!1, !1); return } this.updateGroups(t, u.GroupsToken), u.Messages && n.each(u.Messages, function (n, t) { f.triggerHandler(r.onReceived, [t]) }), u.MessageId && (t.messageId = u.MessageId) } }, monitorKeepAlive: function (t) { var i = t.keepAliveData, f = this; i.monitoring ? t.log("Tried to monitor keep alive but it's already being monitored") : (i.monitoring = !0, f.updateKeepAlive(t), t.keepAliveData.reconnectKeepAliveUpdate = function () { f.updateKeepAlive(t) }, n(t).bind(r.onReconnect, t.keepAliveData.reconnectKeepAliveUpdate), t.log("Now monitoring keep alive with a warning timeout of " + i.timeoutWarning + " and a connection lost timeout of " + i.timeout), u(t)) }, stopMonitoringKeepAlive: function (t) { var i = t.keepAliveData; i.monitoring && (i.monitoring = !1, n(t).unbind(r.onReconnect, t.keepAliveData.reconnectKeepAliveUpdate), t.keepAliveData = {}, t.log("Stopping the monitoring of the keep alive")) }, updateKeepAlive: function (n) { n.keepAliveData.lastKeepAlive = new Date }, ensureReconnectingState: function (t) { return f(t, i.connectionState.connected, i.connectionState.reconnecting) === !0 && n(t).triggerHandler(r.onReconnecting), t.state === i.connectionState.reconnecting }, clearReconnectTimeout: function (n) { n && n._.reconnectTimeout && (t.clearTimeout(n._.reconnectTimeout), delete n._.reconnectTimeout) }, reconnect: function (n, r) { var u = i.transports[r], f = this; e(n) && !n._.reconnectTimeout && (n._.reconnectTimeout = t.setTimeout(function () { u.stop(n), f.ensureReconnectingState(n) && (n.log(r + " reconnecting"), u.start(n)) }, n.reconnectDelay)) }, foreverFrame: { count: 0, connections: {} } } }(window.jQuery, window), function (n, t) { "use strict"; var r = n.signalR, u = n.signalR.events, f = n.signalR.changeState, i = r.transports._logic; r.transports.webSockets = { name: "webSockets", supportsKeepAlive: !0, send: function (n, t) { n.socket.send(t) }, start: function (e, o, s) { var h, c = !1, l = this, a = !o, v = n(e); if (!t.WebSocket) { s(); return } e.socket || (h = e.webSocketServerUrl ? e.webSocketServerUrl : e.wsProtocol + e.host, h += i.getUrl(e, this.name, a), e.log("Connecting to websocket endpoint '" + h + "'"), e.socket = new t.WebSocket(h), e.socket.onopen = function () { c = !0, e.log("Websocket opened"), i.clearReconnectTimeout(e), o ? o() : f(e, r.connectionState.reconnecting, r.connectionState.connected) === !0 && v.triggerHandler(u.onReconnect) }, e.socket.onclose = function (t) { if (this === e.socket) { if (c) typeof t.wasClean != "undefined" && t.wasClean === !1 ? (n(e).triggerHandler(u.onError, [t.reason]), e.log("Unclean disconnect from websocket." + t.reason)) : e.log("Websocket closed"); else { s ? s() : a && l.reconnect(e); return } l.reconnect(e) } }, e.socket.onmessage = function (r) { var f = t.JSON.parse(r.data), o = n(e); f && (n.isEmptyObject(f) || f.M ? i.processMessages(e, f) : o.triggerHandler(u.onReceived, [f])) }) }, reconnect: function (n) { i.reconnect(n, this.name) }, lostConnection: function (n) { this.reconnect(n) }, stop: function (n) { i.clearReconnectTimeout(n), n.socket !== null && (n.log("Closing the Websocket"), n.socket.close(), n.socket = null) }, abort: function () { } } }(window.jQuery, window), function (n, t) { "use strict"; var r = n.signalR, u = n.signalR.events, f = n.signalR.changeState, i = r.transports._logic; r.transports.serverSentEvents = { name: "serverSentEvents", supportsKeepAlive: !0, timeOut: 3e3, start: function (e, o, s) { var h = this, c = !1, a = n(e), l = !o, v, y; if (e.eventSource && (e.log("The connection already has an event source. Stopping it."), e.stop()), !t.EventSource) { s && (e.log("This browser doesn't support SSE."), s()); return } v = i.getUrl(e, this.name, l); try { e.log("Attempting to connect to SSE endpoint '" + v + "'"), e.eventSource = new t.EventSource(v) } catch (p) { e.log("EventSource failed trying to connect with error " + p.Message), s ? s() : (a.triggerHandler(u.onError, [p]), l && h.reconnect(e)); return } y = t.setTimeout(function () { c === !1 && (e.log("EventSource timed out trying to connect"), e.log("EventSource readyState: " + e.eventSource.readyState), l || h.stop(e), l ? e.eventSource.readyState !== t.EventSource.CONNECTING && e.eventSource.readyState !== t.EventSource.OPEN && h.reconnect(e) : s && s()) }, h.timeOut), e.eventSource.addEventListener("open", function () { e.log("EventSource connected"), y && t.clearTimeout(y), i.clearReconnectTimeout(e), c === !1 && (c = !0, o ? o() : f(e, r.connectionState.reconnecting, r.connectionState.connected) === !0 && a.triggerHandler(u.onReconnect)) }, !1), e.eventSource.addEventListener("message", function (n) { n.data !== "initialized" && i.processMessages(e, t.JSON.parse(n.data)) }, !1), e.eventSource.addEventListener("error", function (n) { if (this === e.eventSource) { if (!c) { s && s(); return } e.log("EventSource readyState: " + e.eventSource.readyState), n.eventPhase === t.EventSource.CLOSED ? (e.log("EventSource reconnecting due to the server connection ending"), h.reconnect(e)) : (e.log("EventSource error"), a.triggerHandler(u.onError)) } }, !1) }, reconnect: function (n) { i.reconnect(n, this.name) }, lostConnection: function (n) { this.reconnect(n) }, send: function (n, t) { i.ajaxSend(n, t) }, stop: function (n) { i.clearReconnectTimeout(n), n && n.eventSource && (n.log("EventSource calling close()"), n.eventSource.close(), n.eventSource = null, delete n.eventSource) }, abort: function (n, t) { i.ajaxAbort(n, t) } } }(window.jQuery, window), function (n, t) { "use strict"; var r = n.signalR, f = n.signalR.events, e = n.signalR.changeState, i = r.transports._logic, u = function () { var u = null, f = 1e3, i = 0; return { prevent: function () { r._.ieVersion <= 8 && (i === 0 && (u = t.setInterval(function () { var t = n("<iframe style='position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;' src=''></iframe>"); n("body").append(t), t.remove(), t = null }, f)), i++) }, cancel: function () { i === 1 && t.clearInterval(u), i > 0 && i-- } } }(); r.transports.foreverFrame = { name: "foreverFrame", supportsKeepAlive: !0, timeOut: 3e3, start: function (r, f, e) { var o = this, h = i.foreverFrame.count += 1, c, s = n("<iframe data-signalr-connection-id='" + r.id + "' style='position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;' src=''></iframe>"); if (t.EventSource) { e && (r.log("This browser supports SSE, skipping Forever Frame."), e()); return } u.prevent(), c = i.getUrl(r, this.name), c += "&frameId=" + h, n("body").append(s), s.prop("src", c), i.foreverFrame.connections[h] = r, r.log("Binding to iframe's readystatechange event."), s.bind("readystatechange", function () { n.inArray(this.readyState, ["loaded", "complete"]) >= 0 && (r.log("Forever frame iframe readyState changed to " + this.readyState + ", reconnecting"), o.reconnect(r)) }), r.frame = s[0], r.frameId = h, f && (r.onSuccess = f), t.setTimeout(function () { r.onSuccess && (r.log("Failed to connect using forever frame source, it timed out after " + o.timeOut + "ms."), o.stop(r), e && e()) }, o.timeOut) }, reconnect: function (n) { var r = this; t.setTimeout(function () { if (n.frame && i.ensureReconnectingState(n)) { var u = n.frame, t = i.getUrl(n, r.name, !0) + "&frameId=" + n.frameId; n.log("Updating iframe src to '" + t + "'."), u.src = t } }, n.reconnectDelay) }, lostConnection: function (n) { this.reconnect(n) }, send: function (n, t) { i.ajaxSend(n, t) }, receive: function (t, r) { var u; i.processMessages(t, r), t.frameMessageCount = (t.frameMessageCount || 0) + 1, t.frameMessageCount > 50 && (t.frameMessageCount = 0, u = t.frame.contentWindow || t.frame.contentDocument, u && u.document && n("body", u.document).empty()) }, stop: function (t) { var r = null; if (u.cancel(), t.frame) { if (t.frame.stop) t.frame.stop(); else try { r = t.frame.contentWindow || t.frame.contentDocument, r.document && r.document.execCommand && r.document.execCommand("Stop") } catch (f) { t.log("SignalR: Error occured when stopping foreverFrame transport. Message = " + f.message) } n(t.frame).remove(), delete i.foreverFrame.connections[t.frameId], t.frame = null, t.frameId = null, delete t.frame, delete t.frameId, t.log("Stopping forever frame") } }, abort: function (n, t) { i.ajaxAbort(n, t) }, getConnection: function (n) { return i.foreverFrame.connections[n] }, started: function (t) { t.onSuccess ? (t.onSuccess(), t.onSuccess = null, delete t.onSuccess) : e(t, r.connectionState.reconnecting, r.connectionState.connected) === !0 && n(t).triggerHandler(f.onReconnect) } } }(window.jQuery, window), function (n, t) { "use strict"; var r = n.signalR, f = n.signalR.events, e = n.signalR.changeState, u = n.signalR.isDisconnecting, i = r.transports._logic; r.transports.longPolling = { name: "longPolling", supportsKeepAlive: !1, reconnectDelay: 3e3, init: function (n, r) { var e = this, f, o = function (i) { u(n) === !1 && (n.log("SignalR: Server ping failed because '" + i + "', re-trying ping."), t.setTimeout(f, e.reconnectDelay)) }; n.log("SignalR: Initializing long polling connection with server."), f = function () { i.pingServer(n, e.name).done(r).fail(o) }, f() }, start: function (o, s) { var l = this, v = !1, y = function () { v || (v = !0, s(), o.log("Longpolling connected")) }, a = 0, c = null, p = function (i) { t.clearTimeout(c), c = null, e(o, r.connectionState.reconnecting, r.connectionState.connected) === !0 && (o.log("Raising the reconnect event"), n(i).triggerHandler(f.onReconnect)) }, w = 36e5; o.pollXhr && (o.log("Polling xhr requests already exists, aborting."), o.stop()), l.init(o, function () { o.messageId = null, t.setTimeout(function () { (function e(s, h) { var k = s.messageId, d = k === null, v = !d, g = !h, b = i.getUrl(s, l.name, v, g); u(s) !== !0 && (o.log("Attempting to connect to '" + b + "' using longPolling."), s.pollXhr = n.ajax({ url: b, global: !1, cache: !1, type: "GET", dataType: o.ajaxDataType, contentType: o.contentType, success: function (r) { var o = 0, f; (a = 0, c !== null && p(), y(), r && (f = i.maximizePersistentResponse(r)), i.processMessages(s, r), f && n.type(f.LongPollDelay) === "number" && (o = f.LongPollDelay), f && f.Disconnect) || u(s) !== !0 && (o > 0 ? t.setTimeout(function () { e(s, !1) }, o) : e(s, !1)) }, error: function (u, h) { if (t.clearTimeout(c), c = null, h === "abort") { o.log("Aborted xhr requst."); return } a++, o.state !== r.connectionState.reconnecting && (o.log("An error occurred using longPolling. Status = " + h + ". " + u.responseText), n(s).triggerHandler(f.onError, [u.responseText])), i.ensureReconnectingState(s), l.init(s, function () { e(s, !0) }) } }), v && h === !0 && (c = t.setTimeout(function () { p(s) }, Math.min(1e3 * (Math.pow(2, a) - 1), w)))) })(o), t.setTimeout(function () { y() }, 250) }, 250) }) }, lostConnection: function () { throw new Error("Lost Connection not handled for LongPolling"); }, send: function (n, t) { i.ajaxSend(n, t) }, stop: function (n) { n.pollXhr && (n.pollXhr.abort(), n.pollXhr = null, delete n.pollXhr) }, abort: function (n, t) { i.ajaxAbort(n, t) } } }(window.jQuery, window), function (n, t) { "use strict"; function f(n) { return n + s } function h(n, t, i) { for (var f = n.length, u = [], r = 0; r < f; r += 1) n.hasOwnProperty(r) && (u[r] = t.call(i, n[r], r, n)); return u } function c(t) { return n.isFunction(t) ? null : n.type(t) === "undefined" ? null : t } function o(n) { for (var t in n) if (n.hasOwnProperty(t)) return !0; return !1 } function r(n, t) { return new r.fn.init(n, t) } function i(t, r) { var u = { qs: null, logging: !1, useDefaultPath: !0 }; return n.extend(u, r), (!t || u.useDefaultPath) && (t = (t || "") + "/signalr"), new i.fn.init(t, u) } var e = 0, u = {}, s = ".hubProxy"; r.fn = r.prototype = { init: function (n, t) { this.state = {}, this.connection = n, this.hubName = t, this._ = { callbackMap: {} } }, hasSubscriptions: function () { return o(this._.callbackMap) }, on: function (t, i) { var r = this, u = r._.callbackMap; return t = t.toLowerCase(), u[t] || (u[t] = {}), u[t][i] = function (n, t) { i.apply(r, t) }, n(r).bind(f(t), u[t][i]), r }, off: function (t, i) { var u = this, e = u._.callbackMap, r; return t = t.toLowerCase(), r = e[t], r && (r[i] ? (n(u).unbind(f(t), r[i]), delete r[i], o(r) || delete e[t]) : i || (n(u).unbind(f(t)), delete e[t])), u }, invoke: function (i) { var r = this, s = n.makeArray(arguments).slice(1), l = h(s, c), o = { H: r.hubName, M: i, A: l, I: e }, f = n.Deferred(), a = function (t) { var i = r._maximizeHubResponse(t); n.extend(r.state, i.State), i.Error ? (i.StackTrace && r.connection.log(i.Error + "\n" + i.StackTrace), f.rejectWith(r, [i.Error])) : f.resolveWith(r, [i.Result]) }; return u[e.toString()] = { scope: r, method: a }, e += 1, n.isEmptyObject(r.state) || (o.S = r.state), r.connection.send(t.JSON.stringify(o)), f.promise() }, _maximizeHubResponse: function (n) { return { State: n.S, Result: n.R, Id: n.I, Error: n.E, StackTrace: n.T } } }, r.fn.init.prototype = r.fn, i.fn = i.prototype = n.connection(), i.fn.init = function (t, i) { var e = { qs: null, logging: !1, useDefaultPath: !0 }, r = this; n.extend(e, i), n.signalR.fn.init.call(r, t, e.qs, e.logging), r.proxies = {}, r.received(function (t) { var i, s, e, o, h, c; t && (typeof t.I != "undefined" ? (e = t.I.toString(), o = u[e], o && (u[e] = null, delete u[e], o.method.call(o.scope, t))) : (i = this._maximizeClientHubInvocation(t), r.log("Triggering client hub event '" + i.Method + "' on hub '" + i.Hub + "'."), h = i.Hub.toLowerCase(), c = i.Method.toLowerCase(), s = this.proxies[h], n.extend(s.state, i.State), n(s).triggerHandler(f(c), [i.Args]))) }) }, i.fn._maximizeClientHubInvocation = function (n) { return { Hub: n.H, Method: n.M, Args: n.A, State: n.S } }, i.fn._registerSubscribedHubs = function () { this._subscribedToHubs || (this._subscribedToHubs = !0, this.starting(function () { var i = []; n.each(this.proxies, function (n) { this.hasSubscriptions() && i.push({ name: n }) }), this.data = t.JSON.stringify(i) })) }, i.fn.createHubProxy = function (n) { n = n.toLowerCase(); var t = this.proxies[n]; return t || (t = r(this, n), this.proxies[n] = t), this._registerSubscribedHubs(), t }, i.fn.init.prototype = i.fn, n.hubConnection = i }(window.jQuery, window), function (n) { n.signalR.version = "1.1.2" }(window.jQuery)
//end of SignalR

//start error file/////////////////////////////////
window.onerror = function (msg, url, lineNo) {
    logT5PusherError("onerror", msg, url, lineNo, '', '');
}

//Error object used for sending error details to DB
function T5Error(errordesc) {
    this.errordesc = errordesc;
    this.origin = "JS";
}

//this is our T5 custom error handler - we should log errors in DB (via AJAX call)
function logT5PusherError(origin, msg, url, lineNo, ThirdPartyUserkey, currentConnectionID) {
    try {

        var errordetails = "";
        try {
            if (msg.message) {
                errordetails = msg.message;
            }
            else {
                errordetails = msg;
            }

        } catch (ex) { errordetails = msg; }


        logErrorExtra(origin, msg + ":" + ThirdPartyUserkey + ":" + currentConnectionID, url, lineNo, 0);

       //this needs work!!! - nned to update puhser to log this in sql server db!!
        //$.ajax({
        //    url: T5Pusher_URL + "/Error/logError",
        //    data: { clientdetails: currentConnectionID, localtime: AdminPusher.GetCurrentTimeStamp(), clientdetails: currentConnectionID, userdetails: ThirdPartyUserkey, origin: origin, details: errordetails },
        //    dataType: "jsonp",
        //    //jsonpCallback: 'JSONPCallback',
        //    //data: JSON.stringify(thisError),
        //   // contentType: "application/json: charset=utf-8",
        //    success: function (response) {
        //        alert("log error success!");
        //    }
        //});
    }
    catch (ex) {

        alert("ex");
    }
}
///end error file////////////////////////////////////////


function JSONPCallback() {
    //alert("in JSONPCallback!!");
    var v = 1;
}



//start T5Pusher////////////////////////////////////////
function PushQueueItem(processName_in, messageList_in, groupName_in) {
    this.processName = processName_in;
    this.messageList = messageList_in;
    this.groupName = groupName_in;
}

//creating function sthis way means that the function i sNOT created evey time you create a new object!!!
PushQueueItem.prototype.GetProcessName = function () {
    return this.processName;
};

PushQueueItem.prototype.GetMessageList = function () {
    return this.messageList;
};

PushQueueItem.prototype.GetGroupName = function () {
    return this.groupName;
};


//using the revealing module pattern
var T5Pusher = function () {
    //private variables - which the 3rd party cannot see
    var SignalRConnection;
    var thisconnection;
    var T5Pusher_URL = "";
    var numGroupsDB = -101;

    //put these 4 into new class
    var listOfGroupsJoined = new Array(); //this will hold the list of the groups we have attempted to join and we will use this in cases where we've lost connection and wish to reinitialise our connection
    var listOfGroupsJoined_times = new Array(); //this will hold the list of the groups we have attempted to join and we will use this in cases where we've lost connection and wish to reinitialise our connection
    var listOfGroupsJoined_secure = new Array();
    var listOfGroupsJoined_return = new Array();

    var numReconnectsSinceWeLastReceivedASignalRMessage = 0;
    var lastInteractionTime;
    var connectionRetryTimeout;
    var connectionRetryInterval = 10000; //if , after attempting to connect for this interval we still haven't re-established connection to T5Pusher = then take action!
    var ConnectionCheckInProgress = 0;
    var StartingInProgress = 0;
    var SignalRWaitInterval = 10000; //10 second wait whenever we try to connect to SignalR!!!!
    var srstarted = 0;
    var timeBetweenSignalRConnections = 14; //14000000; //should be 14 in live
    var SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce = 0;
    var validated = 0;
    var ThirdPartyUserkey;
    var ThirdPartyPassword;
    var userHasCalledStartAgain = 0;

    var internalconnection = function () {
        var connectionstatus;

        return {
            connectionstatus: connectionstatus
        };
    }
    var pushQueue = new Array();

    var currentConnectionID;
    var LastConnectionState = -1; //this is to keep track of the signalr connection states - they will often call the state changed function but the state will be the same as the last time???? - is this because i kill the previous connection and start a new one????

    ////////////BINDING VARIABLES////////////////////////////////////////////////////
    var listOf3rdPartyEventNames = new Array();
    var listOf3rdPartyEvents = new Array();
    var thirdPartyConnectionstartMethod = null;
    var thirdPartyUnAuthorisedMethod = null;
    var thirdPartyConnectionfailedMethod = null;
    var thirdPartyConnectionSlowMethod = null;
    var thirdPartyConnectionstateChangedMethod = null;
    var thirdPartyConnectionlostMethod = null;
    ////////////END BINDING VARIABLES////////////////////////////////////////////////////

    var secureConnection = false;
    var clientvalidationurl = "AuthHandler.ashx"; //"/t5pusher/validate"; //client needs to be able to change this
    var groupvalidationurl = "";

    var jsonpclientvalidation = false;

    //the below is crude examination of the useragent - we should call Eannas model
    //api to find out if the browser is indeed a samsung
    var isSafari = 0;
    var isChrome = 0;
    var isAndroid = 0;
    var isSamsung = 0;
    function ExamineUserAgent() {
        try {

            var ua = navigator.userAgent.toLowerCase();

            if (ua.indexOf('android') > -1) {
                isAndroid = 1;

                if (ua.indexOf('gt-') > -1) {

                    isSamsung = 1;
                }
            }

            if (ua.indexOf('safari') != -1) {
                if ((ua.indexOf('chrome') > -1) || (ua.indexOf('crios') > -1)) { //crios is the name for Chrome on iOS. 
                    isSafari = 0;
                    isChrome = 1;
                } else {
                    isSafari = 1;
                    isChrome = 0;
                }
            }
        } catch (e) { logT5PusherError("DetermineIfSafari", ex, null, 0, ThirdPartyUserkey, currentConnectionID); }
    }


    //private functions - which the 3rd party cannot see
    function LogThisInteractionTime() { //This function logs each time we interact with the T5Pusher server
        //we have received a message from SignalR - so reset numREconnects value
        numReconnectsSinceWeLastReceivedASignalRMessage = 0;
        var DateHelper = new Date();
        lastInteractionTime = DateHelper.getTime();
    } //end LogThisInteractionTime

    function GetCorrectGroupName(groupName, T5internalgroup) {
        var correctGroupName;

        if (groupName) {
            correctGroupName = "3PG:" + ThirdPartyUserkey + ":" + groupName;
        }
        else {
            //there is no groupName - so return groupName in the format "3P:Userkey"
            correctGroupName = "3P:" + ThirdPartyUserkey;
        }
        return correctGroupName;
    } //end GetCorrectGroupName

    function GetOriginalGroupName(groupName) {
        var OriginalGroupName;

        try {
            var preFix = "3PG:" + ThirdPartyUserkey;
            if (groupName.indexOf(preFix) == 0) {
                OriginalGroupName = groupName.substring(preFix.length + 1, groupName.length);
            }
            else {
                OriginalGroupName = groupName;
            }
        } catch (ex) { OriginalGroupName = groupName }

        return OriginalGroupName;
    } //end GetOriginalGroupName

    function GetCurrentConnectionMethod() {
        try {
            return thisconnection.transport.name;
        } catch (ex) { logT5PusherError("GetCurrentConnectionMethod", ex, null, 0, ThirdPartyUserkey, currentConnectionID); }
    }

    //this function makes sure that the connection is still Connected at all times!!!!!!!
    function ManageConnection() {
        try {
            var restartTriggered = 0;

            if ((lastInteractionTime == null) || (SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0)) {
                //this is the first time this function has been called and we have still not connected to or interacted with the T5Pusher server!!!!
                //so.....attempt to connect to the current LiveEvent server!!!!

                //we now check SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0 here - 
                //the reason for this is that untill we have validated the user we dont officially class SignalR as having started
                //and so we dont call the users onconnectionstarted function - this means we CAN receive messages from signalR 
                //- so lastInteractionTime will NOT be null BUT we wont have called onconnectionstarted

                //this does not necessarily means connection failed - keepAlive could be down
                //BUT we HAVE to gaurantee that keepAlive will always work or else 
                //if (thirdPartyConnectionfailedMethod) {
                //    thirdPartyConnectionfailedMethod.call();
                //}

                //LogPushEvent("NotReceivedAnyKeepAliveYet!!!!!");
                //logT5PusherError("ManageConnection", "ManageConnection - NotReceivedAnyKeepAliveYet  about to call RestartSignalRConnection!", null, 0, ThirdPartyUserkey, currentConnectionID);
                //RestartSignalRConnection("ManageConnection_NotReceivedAnyKeepAliveYet");
                //restartTriggered = 1;
            }
            else {
                var DateHelper = new Date();
                var currentTime = DateHelper.getTime();
                var TimeSinceLastInteraction = parseInt((currentTime - lastInteractionTime) / 1000);

                if (
                    (TimeSinceLastInteraction > timeBetweenSignalRConnections)
                   ) {
                    //we have exceeded the acceptable length of time without a message from the T5Pusher server!!!!
                    //so...attempt reconnection to  signalR!!!!                 //- which of course we cannot do for Pusher!!!

                    LogPushEvent("ManageConnection_TimeTooGreat!!!!!");
                    logT5PusherError("ManageConnection", "ManageConnection - about to call RestartSignalRConnection! - TimeSinceLastInteraction is " + TimeSinceLastInteraction + " and timeBetweenConnections is " + timeBetweenSignalRConnections, null, 0, ThirdPartyUserkey, currentConnectionID);
                    RestartSignalRConnection("ManageConnection_TimeTooGreat");
                    restartTriggered = 1;
                }
                else {

                    if ((numGroupsDB != -101) && (numGroupsDB != -102)) {
                        //numGroupsInDB has been returned from DB correctly
                        if 
                           ((typeof (listOfGroupsJoined) != 'undefined' && listOfGroupsJoined != null) && (listOfGroupsJoined.length > 0)) {
                            //we HAVE joined groups
                            if (numGroupsDB < listOfGroupsJoined.length) {
                                //the DB is telling us that this connectionid is NOT in the same amount of groups that the client thinks!!!!

                                //so - reinitialize our group details!!!
                                logT5PusherError("ManageConnection", "T5Pusher ManageConnection - we have joined groups BUT we DONT have any groups set up with signalr (well accoring to DB we dont anyway!!!) - so REjoining groups now!!!", null, 0, ThirdPartyUserkey, currentConnectionID);
                                LogPushEvent("ManageConnection_GroupsNotAllThere!!!!!");
                                var rejoined = RejoinGroups(); //now attempt to rejoin groups

                                if (rejoined <= 0) {
                                    //we were unsuccessfull in our attempt to rejoin groups - so restart total connection!!!!
                                    logT5PusherError("ManageConnection", "CheckConnection - unable to rejoin groups - so restarting entire connection", null, 0, ThirdPartyUserkey, currentConnectionID);
                                    RestartSignalRConnection("ManageConnection_NoGroups");
                                    restartTriggered = 1;
                                }
                            }
                        }
                    }
                }
                //stephen 27-Feb-13
                //temporarily commented out the grou checking part of this as there have been changes in SignalR 1.0 and we can no longer access $.connection.hub.groups
                //awaiting documentation to see how this works!!!!!!!! - something to do with $.connection.hub.groupsToken
                /*
                else {
                    //start group else
                    //we are receiving all the keepALive messages - now check if we are are currently listening out for our groups!!!

                    if (
                           ((typeof (listOfGroupsJoined) != 'undefined' && listOfGroupsJoined != null) && (listOfGroupsJoined.length > 0)) //we HAVE joined groups
                           &&
                            (($.connection.hub.groups == null) || ($.connection.hub.groups.length == 0) || ($.connection.hub.groups.length < listOfGroupsJoined.length)) //BUT we DONT have any groups set up with signalr!!!!!!
                       ) {
                        //we have joined groups BUT we DONT have any groups set up with signalr!!!!!!
                        //so - reinitialize our group details!!!
                        logT5PusherError("SR_Con", "T5Pusher ManageConnection - we have joined groups BUT we DONT have any groups set up with signalr - so REjoining groups now!!!", "", "", GetCurrentTimeStamp());
                        LogPushEvent("ManageConnection_GroupsNotAllThere!!!!!");
                        var rejoined = ReJoinGroups(); //now attempt to rejoin groups

                        if (rejoined <= 0) {
                            //we were unsuccessfull in our attempt to rejoin groups - so restart total connection!!!!
                            logT5PusherError("T5Pusher", "CheckConnection - unable to rejoin groups - so restarting entire connection", "", "", GetCurrentTimeStamp());
                            RestartSignalRConnection("ManageConnection_NoGroups");
                            restartTriggered = 1;
                        }
                    }
                }//end group else
                */
            }
        }
        catch (ex) {
            logT5PusherError("CheckConnection", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
        }

        if (restartTriggered == 0) {
            //we have NOT triggered a restart - so continue checking the connection!!!!!!
            LogPushEvent("setting manageConnection in " + ((timeBetweenSignalRConnections / 2) * 1000) + " seconds");

            //before we go to sleep - go to DB to check if we still have the correct amount of groups
            //this is an ajax call - so the thinking is - we will have the answer next time we call this function - we can then compare the numbers to make sure we have the correct number of groups

            if (numGroupsDB == -101) {
                //we do NOT know the number of connections in the DB for this connection
                //this is due to the connection just being started/reset or due to the fact we have just joined another group
                GetNumberOfGroupsThisConnectionIsIn(thisconnection.id);
            }
            window.setTimeout(function () {
                ManageConnection();
            }, ((timeBetweenSignalRConnections / 2) * 1000));
        } //end restartTriggered
    } //end ManageConnection

    function GetCurrentTimeStamp() {
        var EventTimeStamp = new Date();
        return EventTimeStamp.getTime();
    }//end GetCurrentTimeStamp

    //this function restarts the signalR Connection!!!!
    function RestartSignalRConnection(Origin) {

        try {

            LogPushEvent("in RestartSignalRConnection - restarting connection Origin is " + Origin + "!!!!!");
            //logT5PusherError("RestartSignalRConnection", "In RestartSignalRConnection Origin is " + Origin,null,0, ThirdPartyUserkey, currentConnectionID));
            StartingInProgress = 0; //reset this value

            //set this so we can start the CheckConnection flow again after the signalR restart!
            //we dont want the connection flow running when we are restarting the connetion - we know the connection is down!!!!
            //thats why we are here!!!! - so there's no need for the connection flow to continue!!!!!
            ConnectionCheckInProgress = 0;
            numReconnectsSinceWeLastReceivedASignalRMessage = numReconnectsSinceWeLastReceivedASignalRMessage + 1;

            if (numReconnectsSinceWeLastReceivedASignalRMessage == 2) {
                //tell client we are having connection issues
                if (thirdPartyConnectionSlowMethod) {
                    thirdPartyConnectionSlowMethod.call();
                }
            }
            if (numReconnectsSinceWeLastReceivedASignalRMessage == 4) {
                //tell client we are still having more connection issues - this is now more serious - looks like connection is lost!!

                //we have tried on 3 previous occasions to re-establish connection to T5Pusher and we have notbeen able to receive
                //any message - so....tell 3rd party so they can refresh page or notify user
                if (thirdPartyConnectionlostMethod) {
                    thirdPartyConnectionlostMethod.call();
                }
            }

            //start signalR as normal!!!!
            thisconnection.stop();
            SignalRConnection = null;
            srstarted = 0;
            internalconnection.connectionstatus = "reconnecting";
            numGroupsDB = -101; //reset this so we will check in DB that gropus have been set up correctly oncve we re-establish the connection
            Connect();

        }
        catch (ex) {

            internalconnection.connectionstatus = "reconnection attempt failed - " + ex;
            if (thirdPartyConnectionfailedMethod) {
                thirdPartyConnectionfailedMethod.call();
            }
            logT5PusherError("RestartSignalRConnection", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
        }

    } //end RestartSignalRConnection

    //this is not currently used - waiting fot signalr fix for this issue
    function stopBrowserLoading() {
        alert("isbl");
        var $fakeFrame = $('<iframe style="height:0;width:0;display:none" src=""></iframe>');
        $('body').append($fakeFrame);
        $fakeFrame.remove();
    }

    //this function is going to connect the 3rd Party to SignalR!!!!
    function Connect() {
        try {

            //if this has been called before then maybe we should call reconnet
            //i.e - the 3rd party may call thid over and over ( they shouldn't BUT - they might!!!)
            //so if this happens we should at least kill any previous variables,connections etc!!!!!!
            var temp = ThirdPartyUserkey;

            thisconnection = $.hubConnection();
            thisconnection.logging = true;
            thisconnection.url = T5Pusher_URL + '/signalr' //this points to the T5Pusher Hub
            SignalRConnection = thisconnection.createHubProxy('T5Pusher');

            thisconnection.qs = { "ur": ThirdPartyUserkey };

            //$.connection.hub.logging = true;

            //this line means we look to an external domain for SignalR!!!!!
            //$.connection.hub.url = T5Pusher_URL + '/signalr' //this points to the T5Pusher Hub

            //connection = $.connection.T5Pusher;



            //receiveThirdPartyMessage
            //SignalRConnection.client.rtpm = function (processName, messageList) {
            SignalRConnection.on('rtpm', function (processName, messageList) {
                LogThisInteractionTime();
                var locationofMethod = listOf3rdPartyEventNames.indexOf(processName);
                if (locationofMethod > -1) {
                    listOf3rdPartyEvents[locationofMethod].call(undefined, messageList); //undefined = valueForThis
                }
                //};
            });

            //SignalRConnection.client.invalidsendattempt = function (message) {
            SignalRConnection.on('invalidsendattempt', function (message) {
                alert(message);
                //};
            });

            //no longer use this - result now gets returned to the calling function
            ////validation update
            //SignalRConnection.client.vu = function (result) {
            //    if (result == 1) {
            //        //this connection WAS validated!!!!
            //        //so ...now join to the correct groups!!!!!
            //        CompleteConnection();
            //    }
            //    else {
            //        //validation failed!!! - set a property that tells 3rd party this current connection status
            //        internalconnection.connectionstatus = "unauthorized - failed authorization";
            //        if (thirdPartyUnAuthorisedMethod) {
            //            thirdPartyUnAuthorisedMethod.call();
            //        }
            //    }
            //};

            //initialiseProxyFunctions();

            //SignalRConnection.client.keepalive = function () {
            SignalRConnection.on('keepalive', function () {
                LogThisInteractionTime();
                //};
            });


            thisconnection.connectionSlow(function () {
                //we go in here if signalR notices itself that it is having some connection issues due to slow/buggy networks
                //if this event is triggered 'signalR will try to recover. When this succeeds, nothing happens. 
                //If this fails, the stateChanged event will fire with "reconnecting" as it's new state.'

                if (thirdPartyConnectionSlowMethod) {
                    thirdPartyConnectionSlowMethod.call();
                }
            });

            thisconnection.stateChanged(function (change) {

                if (LastConnectionState != change.newState) //dont preceed any further with this function if the state has NOT ACTUALLY changed
                {
                    LastConnectionState = change.newState;

                    /* 
                    //no longer listen out for this state
                    //testing has shown that after calling RestartSignalRConnection we will connect and then at the end it will go into 
                    //this state - i.e reconnecting - but then it will stay ther - ie - it will go reconneting but then never connecting AND it doesn't seem
                    //to be reconnecting - it seems to just be connected fine - so we end up calling whatever logic we have for reconnecting when we are not 
                    //therefore we've removed this part of flow 
                    if (change.newState === $.signalR.connectionState.reconnecting)
                    {
                        //tell 3rd party we are reconnecting so they can display a message to the user???
                        //or do we just try and manage the connection ourselves???

                        thisConnectionIsAReconnect = 1;
                        //connectionRetryTimeout = setTimeout(function () {
                        //    //if we reach here then we have spent 10 seconds trying to re- establish the connection and have not been able to - so prompt a reload of page here!!!!! //if we reach here then we have spent 10 seconds trying to re- establish the connection and have not been able to - so prompt a reload of page here!!!!!
                        //    RestartSignalRConnection("ReconnectingTimeout");
                        //}, connectionRetryInterval);

                        internalconnection.connectionstatus = "reconnecting";
                    } else
                    */

                    if (change.newState === $.signalR.connectionState.connected) {

                        //setTimeout(T5Pusher.stopBrowserLoading(), 1500);
                        //var $fakeFrame = $('<iframe style="height:0;width:0;display:none" src=""></iframe>');
                        //$('body').append($fakeFrame);
                        //$fakeFrame.remove();

                        internalconnection.connectionstatus = "connected";
                        if (connectionRetryTimeout) //if we  were previously trying to reconnect - then clear the values set in this process
                        {
                            clearTimeout(connectionRetryTimeout);
                            connectionRetryTimeout = null;
                        }

                        if (currentConnectionID != $.connection.hub.id) {
                            currentConnectionID = $.connection.hub.id;
                            numGroupsDB = -101; //our connectionid has changed - so reset this so we will check we have the correct groups in DB linked to this connectionid that we think we have!!
                        }

                        if (thirdPartyConnectionstateChangedMethod) {
                            thirdPartyConnectionstateChangedMethod.call(undefined, internalconnection.connectionstatus);
                        }

                    }
                    else if (change.newState === $.signalR.connectionState.disconnected) {
                        internalconnection.connectionstatus = "disconnected";

                        if (thirdPartyConnectionstateChangedMethod) {
                            thirdPartyConnectionstateChangedMethod.call(undefined, internalconnection.connectionstatus);
                        }
                    }
                    else if (change.newState === $.signalR.connectionState.connecting) {

                        if (SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 1) {
                            //this is NOT the first time we have connected to T5Pusher
                            internalconnection.connectionstatus = "reconnecting";
                        }
                        else {
                            internalconnection.connectionstatus = "connecting";
                        }

                        if (thirdPartyConnectionstateChangedMethod) {
                            thirdPartyConnectionstateChangedMethod.call(undefined, internalconnection.connectionstatus);
                        }

                    }

                }
            });

            if (StartingInProgress == 0) {
                StartingInProgress = 1;

                var transports = ['webSockets', 'longPolling'];//['webSockets', 'longPolling'];
                try {
                    if ((isChrome == 0) && (isAndroid == 1) && (isSamsung == 1)) {
                        //this device is NOT chrome
                        //DOES have android in the useragent
                        //and DOES have "gt-" in the useragent - 
                        //so the odds are that this is a non chrome browser samsung
                        //so due to issues which will hopefully be resolved in future versions of signalr
                        //we need to only specify longpolling!!
                        transports = ['longPolling'];
                        logError("SamsungSwitch", "ua is " + navigator.userAgent.toLowerCase());
                    }
                } catch (ex) {
                    logError("UAIdentifyError", ex);
                }

                thisconnection.start({ transport: transports }).done(function () {


                    if (srstarted == 0) {
                        srstarted = 1;

                        //this pushes out all the messages we were unable to send due to signalr not having started
                        //processPushQueue();

                        /*
                        if (ConnectionCheckInProgress == 0) {
                            //start connection check
                            var timeToWait = timeBetweenSignalRConnections * 1000;
                            var logSentence = "setting manageConnection in " + timeToWait + " seconds";
                            LogPushEvent(logSentence); //for some reason this line throws an error on internet Explorer?????????
                            window.setTimeout(
                                    function () {
                                        ManageConnection();
                                    }
                                    , ((timeBetweenSignalRConnections ) * 1000) //wait the full length of time for the first check!!!
                            );
                            ConnectionCheckInProgress = 1;
                        }
                        */
                    }

                    //a new connection has been started - WITH a NEW ConnectionID!!!!!!!
                    //this means we need to validate the connection!!!!!
                    ValidateConnection(thisconnection.id);

                })
                 .fail(function (error) {
                     if (SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0) {
                         internalconnection.connectionstatus = "connection attempt failed - " + error;
                     }
                     else {
                         internalconnection.connectionstatus = "reconnection attempt failed - " + error;
                     }

                     if (thirdPartyConnectionfailedMethod) {
                         thirdPartyConnectionfailedMethod.call();
                     }
                     //instead of calling a fail here should we instead just try the connect function again??? - connect();

                 });
            }

            //now start the connection check right after we start -  $.connection.hub.start
            //the reason for this is - on rare occasions we are seeing situations where signalR just does not start
            //so if we call this function - after z seconds - we will see we haven;'t started yet and will prompt page reload
            //if we haven;t managed to connect to signalr after the timeToWait - then something is wrong!!!!
            if (ConnectionCheckInProgress == 0) {
                //start connection check
                var timeToWait = timeBetweenSignalRConnections * 1000;
                var logSentence = "setting manageConnection in " + timeToWait + " seconds";
                LogPushEvent(logSentence); //for some reason this line throws an error on internet Explorer?????????
                window.setTimeout(
                        function () {
                            ManageConnection();
                        }
                        , ((timeBetweenSignalRConnections) * 1000) //wait the full length of time for the first check!!!
                );
                ConnectionCheckInProgress = 1;
            }



        }
        catch (ex) {
            logT5PusherError("Connect", ex, null, 0, ThirdPartyUserkey, currentConnectionID);

            if (srstarted == 0) {

                //there was an error - we didn't manage to start connection
                if (SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0) {
                    internalconnection.connectionstatus = "connection attempt failed - " + ex;
                }
                else {
                    internalconnection.connectionstatus = "reconnection attempt failed - " + ex;
                }

                if (thirdPartyConnectionfailedMethod) {
                    thirdPartyConnectionfailedMethod.call();
                }

            }

            return false;
        }
    } //end Connect

    function processPushQueue() {
        for (var i = 0; i < pushQueue.length; i++) {
            try {
                PushMessage(pushQueue[i].GetProcessName(), pushQueue[i].GetMessageList(), pushQueue[i].GetGroupName());
            } catch (ex) { }
        }
        pushQueue = new Array();
    }

    function LogPushEvent(message) {
        var alertFallback = false;
        if (typeof console === "undefined" || typeof LogPushEvent === "undefined") {
            if (alertFallback) {
                alert(message);
            } else {
                //do nothing
            }
        }
        else {
            console.log(message);
        }
    }
        
   
    function GetNumberOfGroupsThisConnectionIsIn(connectionid) {
        //$.ajax({
        //    url: T5Pusher_URL + "/Connection/CheckGroups",
        //    type: "GET",
        //    data: "connectionid=" + connectionid,
        //    dataType: "jsonp",
        //    jsonpCallback: 'JSONPCallback',
        //    error: function (XMLHttpRequest, textStatus, errorThrown) {
        //        numGroupsDB = -102; //error
        //    },
        //    success: function (response) {
        //        numGroupsDB = parseInt(response, 10);
        //    }
        //});


       
        $.ajax({
            url: T5Pusher_URL + "/Connection/CheckGroups",
            dataType: 'jsonp',
            data: "connectionid=" + connectionid,
            success: function (response) {
                numGroupsDB = parseInt(response, 10);
            }
        });

    }


    //this function runs after we have established a connection to T5Pusher
    //once we have established the conection we can then join groups!
    function CompleteConnection() {

        try {

            if ((SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0) || (userHasCalledStartAgain == 1)) {
                //this is the first time we have connected to T5Pusher
                userHasCalledStartAgain = 0;

                T5Bind("InternalDefaultGroupJoin_T5I", function (data) {
                    if (data) {
                        if (data.joined == 1) {
                            //we have joined default group - so connection is NOW started

                            //if (SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0) {
                            if (thirdPartyConnectionstartMethod) {
                                thirdPartyConnectionstartMethod.call();
                            }
                            //}
                            SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce = 1;
                            internalconnection.connectionstatus = "connected";
                            processPushQueue();
                        }
                        else {
                            //we failed to join the default group - restart connection 
                            //if we could not join the default group then we have NOt established a connection 
                            if (SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0) {
                                internalconnection.connectionstatus = "connection attempt failed - unable to join the default group ";
                            }
                            else {
                                internalconnection.connectionstatus = "reconnection attempt failed - unable to join the default group ";
                            }

                            if (thirdPartyConnectionfailedMethod) {
                                thirdPartyConnectionfailedMethod.call();
                            }
                            return;
                        }
                    }
                });

                JoinGroupPrivate("3P:" + ThirdPartyUserkey, "InternalDefaultGroupJoin_T5I", 1);
            }
            else {
                //we have connected previously - so now check if we have previoulsy joined groups on the previous connection
                RejoinGroups();
                processPushQueue();
            }
        }
        catch (ex) {
            logT5PusherError("CompleteConnection", ex, null, 0, ThirdPartyUserkey, currentConnectionID);

            if ((SignalRConnectionHasBeenPreviouslyStartedAtLeastOnce == 0) || (userHasCalledStartAgain == 1)) {
                internalconnection.connectionstatus = "connection attempt failed - " + ex;
            }
            else {
                internalconnection.connectionstatus = "reconnection attempt failed - " + ex;
            }

            if (thirdPartyConnectionfailedMethod) {
                thirdPartyConnectionfailedMethod.call();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////
    function DeleteSecureGroup(groupName, ReturnFunction) {
        try {

            if (jsonpclientvalidation == false) {
                //the clients validation url is NOT on an external URL 
                //this means - we dont need to do a JSON AJAX call
                $.ajax({
                    url: clientvalidationurl,
                    type: "POST",

                    data: "connectionid=" + encodeURIComponent(thisconnection.id) + "&d=1&groupName=" + encodeURIComponent(groupName),
                    //data: { connectionid: thisconnection.id, groupName: groupName, delete: 1 }, //need to update delete to NOT be called delete - d instead - cos delete is a reserved word for javascript and using this causes issue son older browsers!!!!

                    dataType: "json",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {

                        //add the error message to the status here!!!
                        if (ReturnFunction) {
                            var locationofMethod = listOf3rdPartyEventNames.indexOf(ReturnFunction);
                            if (locationofMethod > -1) {
                                var returnObject = { groupName: groupName, deleted: -1, status: "error calling DeleteSecureGroup authorization URL - " + clientvalidationurl };
                                listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                            }
                        }

                    },
                    success: function (response) {
                        try {
                            var responseObject;
                            if ((response) || (response != 'object')) {  //if repsonse is NOT an object - make it an object!!!!
                                responseObject = JSON.parse(response);
                            }
                            else {
                                responseObject = response
                            }
                            DeleteSecureGroupReturn(responseObject, groupName, ReturnFunction);
                        } catch (ex) { DeleteSecureGroupReturn(response, groupName, ReturnFunction); }
                    }
                });
            }
            else {
                //the clients validation url IS on an external URL 
                //this means - we DO need to do a JSONP AJAX call


                $.ajax({
                    url: clientvalidationurl,
                    dataType: 'jsonp',

                    data: "connectionid=" + encodeURIComponent(thisconnection.id) + "&d=1&groupName=" + encodeURIComponent(groupName),
                    //data: { connectionid: thisconnection.id, groupName: groupName, delete: 1 }, //need to update delete to NOT be called delete - d instead - cos delete is a reserved word for javascript and using this causes issue son older browsers!!!!

                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        //add the error message to the status here!!!
                        if (ReturnFunction) {
                            var locationofMethod = listOf3rdPartyEventNames.indexOf(ReturnFunction);
                            if (locationofMethod > -1) {
                                var returnObject = { groupName: groupName, deleted: -1, status: "error calling DeleteSecureGroup authorization URL - " + clientvalidationurl };
                                listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                            }
                        }
                    },
                    success: function (response) {
                        var responseObject = JSON.parse(response);
                        DeleteSecureGroupReturn(response, groupName, ReturnFunction);
                    }
                });

                //OLD JSONP way with JSONPCallback
                //$.ajax({
                //    url: clientvalidationurl,
                //    type: "GET",
                //    data: { connectionid: thisconnection.id, groupName: groupName, delete: 1 },
                //    dataType: "jsonp",
                //    jsonpCallback: 'JSONPCallback'
                //    , error: function (XMLHttpRequest, textStatus, errorThrown) {
                //        //add the error message to the status here!!!
                //        if (ReturnFunction) {
                //            var locationofMethod = listOf3rdPartyEventNames.indexOf(ReturnFunction);
                //            if (locationofMethod > -1) {
                //                var returnObject = { groupName: groupName, deleted: -1, status: "error calling DeleteSecureGroup authorization URL - " + clientvalidationurl };
                //                listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                //            }
                //        }
                //    },
                //    success: function (response) {
                //        var responseObject = JSON.parse(response);
                //        DeleteSecureGroupReturn(response, groupName, ReturnFunction);
                //    }
                //});
            }
        }
        catch (ex) {
            logT5PusherError("DeleteSecureGroup", ex, null, 0, ThirdPartyUserkey, currentConnectionID);

            //add the error message to the status here!!!
            if (ReturnFunction) {
                var locationofMethod = listOf3rdPartyEventNames.indexOf(ReturnFunction);
                if (locationofMethod > -1) {
                    var returnObject = { groupName: groupName, deleted: -1, status: "error calling DeleteSecureGroup JSONP authorization URL - " + clientvalidationurl + ", error is " + ex.toString() };
                    listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                }
            }

            return false;
        }
    }//end deleteSecureGroup

    //we go here after a successfull call of the users secure channel hashing call
    function DeleteSecureGroupReturn(data, groupName, ReturnFunction) {
        //we know want to pass this data to OUR validation API!!!!!!
        try {
            if ((data) && (data.auth)) {
                //Create Secure Group on T5Pusher side

                SignalRConnection.invoke('dsg', data.auth, groupName).done(function (result) {
                    //SignalRConnection.server.dsg(data.auth, groupName).done(function (result) {
                    if (result == 1) {
                        //this secure group WAS deleted!!!
                        //so now what????? - probably need to return or call something here!!

                        if (ReturnFunction) {
                            var locationofMethod = listOf3rdPartyEventNames.indexOf(ReturnFunction);
                            if (locationofMethod > -1) {
                                var returnObject = { groupName: groupName, deleted: 1, status: "deleted" };
                                listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                            }
                        }

                    }
                    else {
                        //validation failed!!! - set a property that tells 3rd party this current connection status

                        //add the error message to the status here!!!
                        if (ReturnFunction) {
                            var locationofMethod = listOf3rdPartyEventNames.indexOf(ReturnFunction);
                            if (locationofMethod > -1) {

                                if (result == 0) {
                                    var returnObject = { groupName: groupName, deleted: -1, status: "DeleteSecureGroup failed authorization" };
                                    listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                                }
                                else {
                                    var returnObject = { groupName: groupName, deleted: -1, status: "DeleteSecureGroup failed on T5 server" };
                                    listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                                }
                            }
                        }

                    }
                });
            }
            else {
                //validation failed - update validation status variable which the 3rd party can view

                //add the error message to the status here!!!
                if (ReturnFunction) {
                    var locationofMethod = listOf3rdPartyEventNames.indexOf(ReturnFunction);
                    if (locationofMethod > -1) {
                        var returnObject = { groupName: groupName, deleted: -1, status: "DeleteSecureGroup - client authorization return data not valid - data is " + dataAsJSON };
                        listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                    }
                }

            }
        }
        catch (ex) {
            logT5PusherError("DeleteSecureGroupReturn", ex, null, 0, ThirdPartyUserkey, currentConnectionID);

            if (ReturnFunction) {
                var locationofMethod = listOf3rdPartyEventNames.indexOf(ReturnFunction);
                if (locationofMethod > -1) {
                    var dataAsJSON = JSON.stringify(data);
                    listOf3rdPartyEvents[locationofMethod].call(undefined, "DeleteSecureGroup - error processing client authorization return data - data is " + dataAsJSON + ", error is " + ex.toString()); //undefined = valueForThis
                }
            }
            return false;
        }
    }//end SecureChannelReturn
    /////////////////////////////////////////////////////////////////////////


    function CreateSecureGroup(groupName, JoinGroupReturn, broadcast) {
        try {

            if (!broadcast) {
                broadcast = 0;
            }

            var urltoCall;
            if (groupvalidationurl)
            {
                urltoCall = groupvalidationurl;
            }
            else
            {
                urltoCall = clientvalidationurl;
            }


            if (jsonpclientvalidation == false) {
                //the clients validation url is NOT on an external URL 
                //this means - we dont need to do a JSON AJAX call
                $.ajax({
                    url: urltoCall,
                    type: "POST",
                    data: { connectionid: thisconnection.id, groupName: groupName, broadcast: broadcast }, //, sendToAll: sendToAll
                    dataType: "json",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {

                        //add the error message to the status here!!!
                        if (JoinGroupReturn) {
                            var locationofMethod = listOf3rdPartyEventNames.indexOf(JoinGroupReturn);
                            if (locationofMethod > -1) {
                                var returnObject = { groupName: groupName, created: -1, status: "error calling CreateSecureGroup authorization URL - " + clientvalidationurl };
                                listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                            }
                        }

                    },
                    success: function (response) {
                        try {
                            var responseObject;
                            if ((response) || (response != 'object')) {  //if repsonse is NOT an object - make it an object!!!!
                                responseObject = JSON.parse(response);
                            }
                            else {
                                responseObject = response
                            }
                            CreateSecureGroupReturn(responseObject, groupName, broadcast, JoinGroupReturn);
                        } catch (ex) { CreateSecureGroupReturn(response, groupName, broadcast, JoinGroupReturn); }
                    }
                });
            }
            else {
                //the clients validation url IS on an external URL 
                //this means - we DO need to do a JSONP AJAX call

                $.ajax({
                    url: urltoCall,
                    dataType: 'jsonp',
                    data: { connectionid: thisconnection.id, groupName: groupName, broadcast: broadcast }, //, sendToAll: sendToAll
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (Failure) {
                            var locationofMethod = listOf3rdPartyEventNames.indexOf(Failure);
                            if (locationofMethod > -1) {
                                listOf3rdPartyEvents[locationofMethod].call(undefined, "unauthorized - error calling CreateSecureGroup JSONP authorization URL - " + errorThrown); //undefined = valueForThis
                            }
                        }
                    },
                    success: function (response) {
                        var responseObject = JSON.parse(response);
                        CreateSecureGroupReturn(responseObject, groupName, broadcast, JoinGroupReturn);
                    }
                });

                //OLD JSONP way with JSONPCallback
                //$.ajax({
                //    url: urltoCall,
                //    type: "GET",
                //    data: { connectionid: thisconnection.id, groupName: groupName, broadcast: broadcast }, //, sendToAll: sendToAll
                //    dataType: "jsonp",
                //    jsonpCallback: 'JSONPCallback'
                //    , error: function (XMLHttpRequest, textStatus, errorThrown) {
                //        if (Failure) {
                //            var locationofMethod = listOf3rdPartyEventNames.indexOf(Failure);
                //            if (locationofMethod > -1) {
                //                listOf3rdPartyEvents[locationofMethod].call(undefined, "unauthorized - error calling CreateSecureGroup JSONP authorization URL - " + errorThrown); //undefined = valueForThis
                //            }
                //        }
                //    },
                //    success: function (response) {
                //        var responseObject = JSON.parse(response);
                //        CreateSecureGroupReturn(responseObject, groupName, broadcast, JoinGroupReturn);
                //    }
                //});
            }
        }
        catch (ex) {
            logT5PusherError("CreateSecureGroup", ex, null, 0, ThirdPartyUserkey, currentConnectionID);

            if (JoinGroupReturn) {
                var locationofMethod = listOf3rdPartyEventNames.indexOf(JoinGroupReturn);
                if (locationofMethod > -1) {
                    var returnObject = { groupName: groupName, created: -1, status: "error calling CreateSecureGroup JSONP authorization URL - " + clientvalidationurl + ", error is " + ex.toString() };
                    listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                }
            }

            return false;
        }
    }//end CreateSecureGroup

    //we go here after a successfull call of the users secure channel hashing call
    function CreateSecureGroupReturn(data, groupName, broadcast, JoinGroupReturn) {
        //we know want to pass this data to OUR validation API!!!!!!
        try {
            if ((data) && (data.auth)) {
                //Create Secure Group on T5Pusher side

                SignalRConnection.invoke('csg', data.auth, groupName, broadcast).done(function (result) {
                    //SignalRConnection.server.csg(data.auth, groupName, broadcast).done(function (result) {
                    if (result == 1) {
                        //this secure group WAS created!!!
                        //so now what????? - probably need to return or call something here!!

                        if (JoinGroupReturn) {
                            var locationofMethod = listOf3rdPartyEventNames.indexOf(JoinGroupReturn);
                            if (locationofMethod > -1) {
                                var returnObject = { groupName: groupName, created: 1, status: "created" };
                                listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                            }
                        }
                    }
                    else {
                        if (JoinGroupReturn) {
                            var locationofMethod = listOf3rdPartyEventNames.indexOf(JoinGroupReturn);
                            if (locationofMethod > -1) {
                                var returnObject = { groupName: groupName, created: -1, status: "failed authorization" };
                                listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                            }
                        }

                    }
                });
            }
            else {
                if (JoinGroupReturn) {
                    var locationofMethod = listOf3rdPartyEventNames.indexOf(JoinGroupReturn);
                    if (locationofMethod > -1) {
                        var dataAsJSON = JSON.stringify(data);
                        var returnObject = { groupName: groupName, created: -1, status: "failed - client authorization return data not valid - data is " + dataAsJSON };
                        listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                    }
                }
            }
        }
        catch (ex) {
            logT5PusherError("CreateSecureGroupReturn", ex, null, 0, ThirdPartyUserkey, currentConnectionID);

            if (JoinGroupReturn) {
                var locationofMethod = listOf3rdPartyEventNames.indexOf(JoinGroupReturn);
                if (locationofMethod > -1) {
                    var dataAsJSON = JSON.stringify(data);
                    var returnObject = { groupName: groupName, created: -1, status: "failed - error processing client authorization return data - data is " + dataAsJSON };
                    listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                }
            }

            return false;
        }
    }//end SecureChannelReturn

    function JoinSecureGroupAuthorisation(groupName, JoinGroupReturn) {
        try {
            var urltoCall;
            if (groupvalidationurl) {
                urltoCall = groupvalidationurl;
            }
            else {
                urltoCall = clientvalidationurl;
            }

            if (jsonpclientvalidation == false) {
                //the clients validation url is NOT on an external URL 
                //this means - we dont need to do a JSON AJAX call
                $.ajax({
                    url: urltoCall,
                    type: "POST",
                    data: { connectionid: thisconnection.id, groupName: groupName, broadcast: 0 }, //, sendToAll: sendToAll
                    dataType: "json",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        //output something here to the debug console to say joiing group failed due to error calling this authorisation url
                    },
                    success: function (response) {
                        try {
                            var responseObject;
                            if ((response) || (response != 'object')) {  //if repsonse is NOT an object - make it an object!!!!
                                responseObject = JSON.parse(response);
                            }
                            else {
                                responseObject = response
                            }
                            joinGroupFinalStep(groupName, responseObject, JoinGroupReturn);
                        } catch (ex) { joinGroupFinalStep(groupName, response, JoinGroupReturn); }
                    }
                });
            }
            else {
                //the clients validation url IS on an external URL 
                //this means - we DO need to do a JSONP AJAX call

                $.ajax({
                    url: urltoCall,
                    dataType: 'jsonp',
                    data: { connectionid: thisconnection.id, groupName: groupName, broadcast: 0 }, //, sendToAll: sendToAll
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        //output something here to the debug console to say joiing group failed due to error calling this authorisation url
                    },
                    success: function (response) {
                        var responseObject = JSON.parse(response);
                        joinGroupFinalStep(groupName, responseObject, JoinGroupReturn);
                    }
                });
                //OLD JSONP way with JSONPCallback
                //$.ajax({
                //    url: urltoCall,
                //    type: "GET",
                //    data: { connectionid: thisconnection.id, groupName: groupName, broadcast: 0 }, //, sendToAll: sendToAll
                //    dataType: "jsonp",
                //    jsonpCallback: 'JSONPCallback'
                //    , error: function (XMLHttpRequest, textStatus, errorThrown) {
                //        //output something here to the debug console to say joiing group failed due to error calling this authorisation url
                //    },
                //    success: function (response) {
                //        var responseObject = JSON.parse(response);
                //        joinGroupFinalStep(groupName, responseObject, JoinGroupReturn);
                //    }
                //});
            }
        }
        catch (ex) {
            logT5PusherError("joinGroupFinalStep", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
            //output something here to the debug console to say joiing group failed due to error calling this authorisation url
            return false;
        }
    }//end JoinSecureGroupAuthorisation


    function ValidateConnection(connectionid) {
        try {
            if (secureConnection == true) { //only do this if the user has explicitly asked for authorisation

                if (jsonpclientvalidation == false) {
                    //the clients validation url is NOT on an external URL 
                    //this means - we dont need to do a JSON AJAX call
                    $.ajax({
                        url: clientvalidationurl,
                        type: "POST",
                        data: "connectionid=" + connectionid,
                        dataType: "json",
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            internalconnection.connectionstatus = "unauthorized - error calling client authorization URL - " + clientvalidationurl;
                            if (thirdPartyUnAuthorisedMethod) {
                                thirdPartyUnAuthorisedMethod.call();
                            }
                        },
                        success: function (response) {
                            try {
                                var responseObject;
                                if ((response) || (response != 'object')) {  //if repsonse is NOT an object - make it an object!!!!
                                    responseObject = JSON.parse(response);
                                }
                                else {
                                    responseObject = response
                                }
                                ClientValidationReturn(responseObject);
                            } catch (ex) { ClientValidationReturn(response); }
                        }
                    });
                }
                else {
                    //the clients validation url IS on an external URL 
                    //this means - we DO need to do a JSONP AJAX call

                    $.ajax({
                        url: clientvalidationurl,
                        dataType: 'jsonp',
                        data: "connectionid=" + connectionid,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            internalconnection.connectionstatus = "unauthorized - error calling client authorization URL - " + errorThrown;
                            if (thirdPartyUnAuthorisedMethod) {
                                thirdPartyUnAuthorisedMethod.call();
                            }
                        },
                        success: function (response) {
                            var responseObject = JSON.parse(response);
                            ClientValidationReturn(responseObject);
                        }
                    });
                    //OLD JSONP way with JSONPCallback
                    //$.ajax({
                    //    url: clientvalidationurl,
                    //    type: "GET",
                    //    data: "connectionid=" + connectionid,
                    //    dataType: "jsonp",
                    //    jsonpCallback: 'JSONPCallback'
                    //    , error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //        internalconnection.connectionstatus = "unauthorized - error calling client authorization URL - " + errorThrown;
                    //        if (thirdPartyUnAuthorisedMethod) {
                    //            thirdPartyUnAuthorisedMethod.call();
                    //        }
                    //    },
                    //    success: function (response) {
                    //        var responseObject = JSON.parse(response);
                    //        ClientValidationReturn(responseObject);
                    //    }
                    //});
                }
            }
            else {
                //the user does NOT want to do authorisation - so complete connection!
                CompleteConnection();
            }
        }
        catch (ex) {
            logT5PusherError("ValidateConnection", ex, null, 0, ThirdPartyUserkey, currentConnectionID);

            internalconnection.connectionstatus = "unauthorized - error calling client authorization URL - " + ex.toString();
            if (thirdPartyConnectionfailedMethod) {
                thirdPartyConnectionfailedMethod.call();
            }

            return false;
        }
        return validated;
    } //end ValidateUser

    //we go here after a successfull call of the clients validation/hashing API
    function ClientValidationReturn(data) {
        //we know want to pass this data to OUR validation API!!!!!!
        try {
            if ((data) && (data.auth)) {
                //Validate Third Party

                SignalRConnection.invoke('vtp', data.auth).done(function (result) {
                    //SignalRConnection.server.vtp(data.auth).done(function (result) {
                    if (result == 1) {
                        //this connection WAS validated!!!!
                        //so ...now join to the correct groups!!!!!
                        CompleteConnection();
                    }
                    else {
                        //validation failed!!! - set a property that tells 3rd party this current connection status
                        internalconnection.connectionstatus = "unauthorized - failed authorization";
                        if (thirdPartyUnAuthorisedMethod) {
                            thirdPartyUnAuthorisedMethod.call();
                        }
                    }
                });
            }
            else {
                //validation failed - update validation status variable which the 3rd party can view
                internalconnection.connectionstatus = "unauthorized - client authorization return data not valid";
                if (thirdPartyUnAuthorisedMethod) {
                    thirdPartyUnAuthorisedMethod.call();
                }
            }
        }
        catch (ex) {
            logT5PusherError("ClientValidationReturn", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
            internalconnection.connectionstatus = "unauthorized - error validating clients authorisation return data - data is " + dataAsJSON + ",error is " + ex.toString();
            if (thirdPartyConnectionfailedMethod) {
                thirdPartyConnectionfailedMethod.call();
            }
            return false;
        }
    }

    //This function initialises the Pusher!!!! 
    function Initialise(userkey) {

        try {
            internalconnection.connectionstatus = "connecting";
            ThirdPartyUserkey = userkey;
            if (srstarted == 0) {
                ExamineUserAgent();

                if ((isChrome == 0) && (isAndroid == 1)) {
                    //this is an android device that is NOT using chrome - therefore we may encounter
                    //issues with the page loading forever - so start connection after brief timeout!!!!
                    window.setTimeout(
                        function () {
                            Connect();
                        }
                        , 2000); //SignalR - bug - EVERYTHING - (images etc ) need to be finshed before signalR is finished otherwise it keeps loading 4ever!! - 
                }
                else {
                    Connect();
                }
            }
            else {
                //user has already started t5pusher but they are starting it again!!!
                //so call RestartSignalRConnection!!!
                userHasCalledStartAgain = 1;

                //if the user has triggerd a restart - then wipe ALL the gropu info!!!
                listOfGroupsJoined = new Array(); //this will hold the list of the groups we have attempted to join and we will use this in cases where we've lost connection and wish to reinitialise our connection
                listOfGroupsJoined_times = new Array(); //this will hold the list of the groups we have attempted to join and we will use this in cases where we've lost connection and wish to reinitialise our connection
                listOfGroupsJoined_secure = new Array();
                listOfGroupsJoined_return = new Array();

                RestartSignalRConnection("Initialise");
            }

        }
        catch (ex) {
            logT5PusherError("Initialise", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
            internalconnection.connectionstatus = "error starting connection - error is " + ex.toString();
            if (thirdPartyConnectionfailedMethod) {
                thirdPartyConnectionfailedMethod.call();
            }
            return false;
        }


    } //end Initialise

    //new way to push content to T5Pusher
    function PushMessage(processName, messageList, groupName) {
        try {

            if (srstarted == 1) {
                //sr HAS started - so send message
                if ((messageList) && (messageList.length > 0)) {

                    SignalRConnection.invoke('stpm', messageList, GetCorrectGroupName(groupName), processName);
                    //SignalRConnection.server.stpm(messageList, GetCorrectGroupName(groupName), processName); //, ThirdPartyPassword

                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                //sr has not started yet - so store this message for when it has
                var thisPushQueueItem = new PushQueueItem(processName, messageList, groupName);
                pushQueue.push(thisPushQueueItem);
                return true; //should we return true here??????
            }
        }
        catch (ex) {
            logT5PusherError("PushMessage", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
            return false;
        }
    }; //end PushMessage


    function joinGroupFinalStep(correctGroupName, Auth, JoinGroupReturn) {

        try {
            var authString = "";
            var secure = 0;
            if (!Auth) {
                //before we join this group we want to validate the user first!!!!
                authString = '';
            }
            else {
                try {
                    if (Auth.auth) {
                        authString = Auth.auth;
                    }
                    else {
                        authString = Auth;
                    }
                } catch (ex) { authString = Auth; }

            }

            if (Auth) {
                secure = 1;
            }

            SignalRConnection.invoke('thirdPartyJoinGroupV2', correctGroupName, secure, authString).done(function (result) {
                //SignalRConnection.server.thirdPartyJoinGroupV2(correctGroupName, secure, authString).done(function (result) {
                if (result == 1) { //group joined ok

                    //we have NOT joined more than 5 groups in the last 5 seconds - so - continue as normal
                    if (listOfGroupsJoined.indexOf(correctGroupName) < 0) {  //this groupName is not in our list - so add it!!!!
                        listOfGroupsJoined.push(correctGroupName);
                        listOfGroupsJoined_secure.push(secure);

                        if (!JoinGroupReturn) {
                            JoinGroupReturn = "";
                        }
                        else {

                            var locationofMethod = listOf3rdPartyEventNames.indexOf(JoinGroupReturn);
                            if (locationofMethod > -1) {
                                var returnObject = { groupName: GetOriginalGroupName(correctGroupName), joined: 1, status: "joined", secure: secure };
                                listOf3rdPartyEvents[locationofMethod].call(undefined, returnObject); //undefined = valueForThis
                            }
                        }

                        listOfGroupsJoined_return.push(JoinGroupReturn);

                        //record the time we joined this group
                        var now = new Date();
                        listOfGroupsJoined_times.push(now);
                        LogPushEvent("rejoining group - " + correctGroupName);
                    }

                    numGroupsDB = -101; //we have just joined a group - so reset this value so we can go to DB to update it!!!!
                    return 1;
                }
                else {
                    //put a message in the error console that says validation failed on T5Pusher side!!!

                    var locationofMethod = listOf3rdPartyEventNames.indexOf(JoinGroupReturn);
                    if (locationofMethod > -1) {

                        var status;
                        if (result == -4) {
                            status = "failed to join group - attempted to join a secure group with an incorrect hash value";
                        }
                        else if (result == -3) {
                            status = "failed to join group - this is NOT a secure group yet the client has attempted to join a secure group";
                        }
                        else if (result == -2) {
                            status = "failed to join group - the user has attempted to join a secure group but has NOT passed up a hashed authorisation code";
                        }
                        else if (result == -5) {
                            status = "failed to join group - the user has attempted to join a secure group WITHOUT the SECURE group details";
                        }
                        else if (result == -1) {
                            status = "failed to join group - T5Pusher Internal Error";
                        }
                        var returnObject = { groupName: GetOriginalGroupName(correctGroupName), joined: 0, status: status, secure: secure };
                        listOf3rdPartyEvents[locationofMethod].call(undefined, "failed!!"); //undefined = valueForThis
                    }

                }
            });
            return 1; //no error
        }
        catch (ex) {
            logT5PusherError("joinGroupFinalStep", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
            return -1;
        }
    }

    function GetNumGroupsJoinedInLast5Seconds() {
        var numMessagesSentInLast5Seconds = 0;

        try {
            var currentTime = new Date();
            for (var i = 0; i < listOfGroupsJoined_times.length; i++) {
                var groupJoinTime = listOfGroupsJoined_times[i];

                var dif = currentTime.getTime() - groupJoinTime.getTime();
                var Seconds = dif / 1000;

                if (Seconds <= 5) {
                    numMessagesSentInLast5Seconds = numMessagesSentInLast5Seconds + 1;
                }
            }
        }
        catch (ex) {
            logT5PusherError("GetNumGroupsJoinedInLast5Seconds", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
        }

        return numMessagesSentInLast5Seconds;
    }


    function JoinSecureGroupPrivate(groupName, JoinGroupReturn) {
        JoinGroupPrivate(groupName, JoinGroupReturn, null, 1);
    }


    function JoinGroupPrivate(groupName, JoinGroupReturn, T5internalgroup, Secure) {
        try {
            var joined = 0;
            var correctGroupName = "";
            if (!T5internalgroup) {
                //We are NOT joining a group we are using to manage the service
                //i.e we ARE joining a 3rd party group!!!!!
                //so - check if the 3rd party are starting their groupName with 3PG:
                correctGroupName = GetCorrectGroupName(groupName, T5internalgroup);
            }
            else {
                correctGroupName = groupName;
            }

            if (srstarted == 1) { //we should check to make sure we are connected before we attempt to join group
                //before we join the group here - make sure we haven't joined more than 5 groups in the last 5 seconds
                ////////due to issues with SignalR LongPolling (and it's also to do with the length of the groupName) - if we join more than 5 groups in 5 seconds we can have issues    
                if ((GetNumGroupsJoinedInLast5Seconds() < 5) || (GetCurrentConnectionMethod() != "longPolling")) { //|| (GetCurrentConnectionMethod() != "longPolling")
                    //we have NOT joined more than 5 groups in the last 5 seconds - so - join this group - NOW!!!!

                    if (Secure == 1) {
                        //this IS a secure group request ..so get the authorisation hash and then pass that to T5pusher to join the group 
                        JoinSecureGroupAuthorisation(correctGroupName, JoinGroupReturn);
                        joined = 1;//no error - we won't know if the group was actually joined until the response is returned from SignalR
                    }
                        //else if (Auth) {
                        //    //we already have the exising authorisation code for this group
                        //    //this means we must be rejoining this group AFTER a reconnect!!!!
                        //    //joined = joinGroupFinalStep(correctGroupName, Auth,true);//joined will be set to 1 if there was no error - we won't know if the group was actually joined until the response is returned from SignalR
                        //    JoinSecureGroupAuthorisation(correctGroupName);
                        //}
                    else {
                        //this is NOT a secure group request so join user to group as normal
                        joined = joinGroupFinalStep(correctGroupName, null, JoinGroupReturn); //joined will be set to 1 if there was no error - we wont know if the group was actually joined untill the response os returned from SignalR
                    }
                }
                else {
                    //we HAVE joined more than 5 groups in the last 5 seconds - so - join this group - in 5 seconds!!!!
                    window.setTimeout(
                            function () {
                                JoinGroupPrivate(groupName, JoinGroupReturn, T5internalgroup, Secure);
                            }
                            , (5500)
                    );
                    joined = -2;//unable to join due to longpolling issue = will be joined in a few seconds
                }
            }
            else {
                //signalr Connection is NOT started (this can happen if we are trying to connect to a group after a timeout - and while we were waiting we lost connection)
                //- so store this group so when we do establish connection we can join it then!!!)
                if (listOfGroupsJoined.indexOf(correctGroupName) < 0) {
                    //this groupName is not in our list - so add it!!!!
                    listOfGroupsJoined.push(correctGroupName);
                    if (!Secure) {
                        Secure = 0;
                    }
                    listOfGroupsJoined_secure.push(Secure);

                    if (!JoinGroupReturn) {
                        JoinGroupReturn = "";
                    }

                    listOfGroupsJoined_return.push(JoinGroupReturn);
                }
                joined = -3;  //will be joined after T5Pusher reconnect
            }
        }
        catch (ex) {
            logT5PusherError("JoinGroupPrivate", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
            joined = -1; //error
        }
        return joined;
    }  //JoinGroupPrivate

    function RejoinGroups() {
        var joined = 0;
        try {
            if (listOfGroupsJoined.length > 0) {
                //we DID join groups before - so.. we need to rejoin them!!!!!
                var NumGroups = listOfGroupsJoined.length;

                for (var i = 0; i < NumGroups; i++) {
                    var Secure = listOfGroupsJoined_secure[i];
                    var JoinGroupReturn = listOfGroupsJoined_return[i];
                    var GroupName = listOfGroupsJoined[i];
                    joined = JoinGroupPrivate(GroupName, JoinGroupReturn, true, Secure);
                    if (joined < 0) {
                        //if we fail to rejoin even 1 group then the RejoinGroups function has failed and we need to trigger a full signalR reconnect!!!!
                        return joined;
                    }
                }
            }
        }
        catch (ex) {
            logT5PusherError("RejoinGroups", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
            joined = -1; //if we fail to rejoin even 1 group then the RejoinGroups function has failed and we need to trigger a full signalR reconnect!!!!
        }
        return joined;
    }

    function T5Bind(name, method) {
        //first make sure we haven't already bound this event before!!!
        try {
            //only do this if we have BOTH a name AND a method!!!
            if ((name) && (method)) {
                if (listOf3rdPartyEventNames.indexOf(name) < 0) {
                    listOf3rdPartyEventNames.push(name);
                    listOf3rdPartyEvents.push(method);
                }
            }
        }
        catch (ex) {
            logT5PusherError("T5Bind", ex, null, 0, ThirdPartyUserkey, currentConnectionID);
        }
    }

    function T5ConnectionBind(name, method) {
        if (name) {
            if (name.toLowerCase() == "connected") {
                thirdPartyConnectionstartMethod = method;
            }
            else if (name.toLowerCase() == "connectionattemptfailed") {
                thirdPartyConnectionfailedMethod = method;
            }
            else if (name.toLowerCase() == "connectionslow") {
                thirdPartyConnectionSlowMethod = method;
            } else if (name.toLowerCase() == "statechanged") {
                thirdPartyConnectionstateChangedMethod = method;
            }
            else if (name.toLowerCase() == "connectionlost") {
                thirdPartyConnectionlostMethod = method;
            }
            else if ((name.toLowerCase() == "unauthorised") || (name.toLowerCase() == "unauthorized")) {
                thirdPartyUnAuthorisedMethod = method;
            }
        }
    }

    function setSecureConnection() {
        secureConnection = true;
    }

    function setJSONPAuthorisation() {
        jsonpclientvalidation = true;
    }

    function setClientAuthorisationURL(url) {
        clientvalidationurl = url;
    }

    function setGroupAuthorisationURL(url) {
        groupvalidationurl = url;
    }

    function SetPusherURL(newURL) {
        T5Pusher_URL = newURL;
    }

    return {
        start: Initialise,
        joinGroup: JoinGroupPrivate,
        push: PushMessage,
        bind: T5Bind,
        connectionbind: T5ConnectionBind,
        useSecureConnection: setSecureConnection,
        useJSONPAuthorisation: setJSONPAuthorisation,
        setClientAuthorisationURL: setClientAuthorisationURL,
        connection: internalconnection,
        GetCurrentConnectionMethod: GetCurrentConnectionMethod,
        GetCurrentTimeStamp: GetCurrentTimeStamp,
        stopBrowserLoading: stopBrowserLoading,
        CreateSecureGroup: CreateSecureGroup,
        JoinSecureGroup: JoinSecureGroupPrivate,
        restartTest: RestartSignalRConnection,
        DeleteSecureGroup: DeleteSecureGroup,
        SetPusherURL: SetPusherURL,
        setGroupAuthorisationURL: setGroupAuthorisationURL
    };
    //}(); //original way!!!
};