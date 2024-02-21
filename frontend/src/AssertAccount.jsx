import SignIn from "./SignIn";
import {useApi} from "./hooks/ApiContext";
import {useSnackbar} from "notistack";
import App from "./App";

function AssertAccount() {
	const {enqueueSnackbar} = useSnackbar();
	const {account} = useApi({
		snackbar: (packet) => enqueueSnackbar(packet.message, {variant: packet.severity})
	});
	
	return <>
		{account === null && <SignIn/>}
		{account && <App/>}
	</>;
}

export default AssertAccount;
