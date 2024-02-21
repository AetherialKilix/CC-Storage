import {createContext, useContext} from "react";
import {useApi} from "./ApiContext";
import {useLocalStorage} from "@uidotdev/usehooks";

const StorageContext = createContext();

export const ApiProvider = ({children}) => {
	const { storage } = useLocalStorage("storage", null);
	const { sendMessage } = useApi({
		"storage": (message) => {
		
		}
	})
	
	return <StorageContext.Provider value={storage}>
		{children}
	</StorageContext.Provider>
}

export const useStorage = () => useContext(StorageContext);