import {createContext, useContext, useEffect, useState} from "react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {LocalDateTime} from "@js-joda/core";
import {enqueueSnackbar} from "notistack";

const ApiContext = createContext();
const API_URL = "ws://127.0.0.1:6969/";

export const ApiProvider = ({children}) => {
	const [socket, setSocket] = useState(null);
	// undefined -> we don't know yet | null -> no account | anything else -> yes account
	const [account, setAccount] = useState(undefined);
	const [{accessToken, accessTokenExpire, refreshToken, refreshTokenExpire}, setTokens] = useLocalStorage("tokens", {});
	const [handlers, setHandlers] = useState([
		["account", (message) => {
			// progressive updates: undefined keeps current values, null erases
			if (message.account) setAccount(message.account);
			else if (message.account === null) setAccount(null);
			if (message.tokens) setTokens(message.tokens);
			else if (message.tokens === null) setTokens(null);
		}], ["logout", (message) => {
			if (!!message.reason) enqueueSnackbar(`You have been logged out: ${message.reason}`, {variant: "info"});
			else enqueueSnackbar(`You have been logged out.`, {variant: "info"});
			setTokens(null);
			setAccount(null);
		}]
	]);
	
	const handleMessage = (message) => {
		const data = JSON.parse(message.data);
		console.log("received message:", data);
		const receivers = handlers.filter(it => it && it[0] === data.type);
		receivers.forEach(receiver => receiver[1](data));
	}
	
	useEffect(() => {
		if (accessToken) {
			const accessExpired = LocalDateTime.parse(accessTokenExpire).isBefore(LocalDateTime.now());
			const refreshInvalid = !refreshToken || LocalDateTime.parse(refreshTokenExpire).isBefore(LocalDateTime.now());
			
			if (accessExpired && refreshInvalid) {
				enqueueSnackbar("Your session expired.", {variant: "error"});
				setTokens(undefined);
				return;
			}
			
			const ws = new WebSocket(API_URL);
			setSocket(ws);
			
			if (accessExpired) { // use refresh endpoint
				ws.onopen = () => {
					ws.send(JSON.stringify({
						type: "refresh",
						refreshToken
					}));
				}
			} else {
				ws.onopen = () => {
					ws.send(JSON.stringify({
						type: "authorize",
						accessToken
					}));
				}
			}
			
			ws.onmessage = handleMessage
		} else {
			setAccount(null);
			setSocket(null);
		}
	}, [accessToken]);
	
	return <ApiContext.Provider value={{
		account,
		logout: () => socket.send(JSON.stringify({type: "logout"})),
		sendMessage: (message) => socket.send(JSON.stringify(message)),
		useHandlers: (handlersToAdd = {}) => {
			const entries = Object.entries(handlersToAdd);
			useEffect(() => {
				setHandlers((current) => [...entries, ...current]);
				return () => {
					setHandlers((current) => current.filter(item => entries.indexOf(item) < 0))
				}
			}, []);
		},
		login: (email, password, remember) => {
			if (socket) return;
			const ws = new WebSocket(API_URL);
			setSocket(ws);
			ws.onopen = () => {
				ws.send(JSON.stringify({
					type: "login",
					email, password, remember
				}));
			};
			ws.onmessage = handleMessage
		},
		signup: (email, password, remember) => {
			if (socket) return;
			const ws = new WebSocket(API_URL);
			setSocket(ws);
			ws.onopen = () => {
				ws.send(JSON.stringify({
					type: "signup",
					email, password, remember
				}));
			};
			ws.onmessage = handleMessage
		}
	}}>
		{children}
	</ApiContext.Provider>
}

export const useApi = (handlers = {}) => {
	const context = useContext(ApiContext);
	context.useHandlers(handlers);
	return context;
};