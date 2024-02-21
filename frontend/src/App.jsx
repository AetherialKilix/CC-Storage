import {useApi} from "./hooks/ApiContext";
import {
	AppBar,
	Divider,
	Grid,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Paper,
	styled,
	Tooltip
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import gravatarUrl from "gravatar-url";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import {Add, Logout} from "@mui/icons-material";
import Button from "@mui/material/Button";

function TitleBar({email, logout}) {
	const [anchor, setAnchor] = useState(null);
	const closeMenu = () => setAnchor(null);
	
	return <AppBar position="static">
		<Grid container justifyContent="space-between" alignItems="center" sx={{pl: 2}}>
			<Grid item>
				<Grid container gap={2} alignItems="center">
					<img src={"https://tweaked.cc/pack.png"} alt={""} height={40}/>
					<Typography sx={{display: "inline-block"}} variant="h5">CC: Tweaked Storage System</Typography>
				</Grid>
			</Grid>
			<Grid item>
				<IconButton id="user-button">
					<Avatar src={gravatarUrl(email)} onClick={(event) => setAnchor(event.currentTarget)}/>
				</IconButton>
				<Menu
					sx={{mt: 2, mr: 4}}
					id="user-menu"
					anchorEl={anchor}
					open={!!anchor}
					MenuListProps={{
						'aria-labelledby': 'user-button',
					}}
					onClose={closeMenu}
					dense
				>
					<MenuItem onClick={() => logout && logout()}>
						<ListItemIcon><Logout/></ListItemIcon>
						<ListItemText>Logout</ListItemText>
					</MenuItem>
					<Divider/>
					<Typography sx={{pl: 2, pr: 2}} color={"gray"} fontSize={10}>Version: 2024.02.14</Typography>
				</Menu>
			</Grid>
		</Grid>
	</AppBar>
}

const Item = styled(Paper)(({theme}) => ({
	padding: theme.spacing(2),
	minWidth: 150, minHeight: 150
}));

const colors = {
	online: "lime",
	offline: "gray",
	unresponsive: "orange",
	full: "red"
}
function Card({ name, status }) {
	return <Item>
			<Grid container direction={"column"}>
				<Grid item>
					<Avatar sx={{ maxWidth: "12px", maxHeight: "12px", display: "inline", background: colors[status] }}>&nbsp;</Avatar>{name}
				</Grid>
				<Grid item>Status: {status}</Grid>
			</Grid>
		</Item>
}

function App() {
	const {account, logout} = useApi();
	
	return <Grid container direction="column">
		<TitleBar email={account.email} logout={logout}/>
		<Grid container direction="row" gap={2} sx={{p: 2}}>
			<Card name={"lorem"} status={"online"}/>
			<Card name={"ipsum"} status={"unresponsive"}/>
			<Card name={"dolor"} status={"online"}/>
			<Card name={"sit"} status={"offline"}/>
			<Card name={"amet"} status={"full"}/>
			<Tooltip title={"connect new storage"}>
				<Button variant={"outlined"} sx={{ width: 150, height: 150 }}><Add/></Button>
			</Tooltip>
		</Grid>
	</Grid>;
}

export default App;