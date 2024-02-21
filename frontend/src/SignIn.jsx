import * as React from 'react';
import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Chip, Collapse, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Switch} from "@mui/material";
import {LockOutlined, Person} from "@mui/icons-material";
import {useApi} from "./hooks/ApiContext";

const [ defaultPW, defaultEmail ] = process.env.NODE_ENV === "development" ? ["69696969", "test@example.com"] : [];

function ConfirmationDialog({signupEmail, onConfirm}) {
	const [error, setError] = useState(null);
	
	return <Dialog open={signupEmail != null}>
		<DialogTitle>Verify Email Address</DialogTitle>
		<DialogContent>
			<DialogContentText sx={{mb: 4}} component={"div"}>
				Please check the inbox for <Chip label={signupEmail}/> and enter the code we sent you.
			</DialogContentText>
			<Box component="form" onSubmit={(event) => {
				event.preventDefault();
				if (onConfirm) onConfirm(event.target.code.value);
			}} noValidate sx={{mt: 1}}>
				<TextField
					autoFocus
					required
					id={"code"}
					name={"code"}
					type={"tel"}
					fullWidth
					label={"Verification Code"}
					onChange={(event) => {
						const value = event.target.value;
						if (value.length !== 8) setError("verification code is 8 digits.");
						else setError(null);
					}}
					helperText={error}
					error={error != null}
				/>
				<Grid container justifyContent={"end"}>
					<Button
						type="submit"
						variant={"contained"}
						sx={{mt: 3, mb: 2}}
						disabled={error != null}
					>Confirm</Button>
				</Grid>
			</Box>
		</DialogContent>
	</Dialog>
}

export default function SignIn() {
	const [isSignup, setSignup] = useState(false);
	const {sendMessage, login, signup} = useApi();
	const [pwMismatch, setPwMismatch] = useState(false);
	const [pwShort, setPwShort] = useState(false);
	const [loading, setLoading] = useState(false);
	
	const [signupEmail, setSignupEmail] = useState(null);
	
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const form = {};
		for (const pair of data.entries()) form[pair[0]] = pair[1]
		
		if (form["password"].length < 8) return setPwShort(true);
		
		if (form["signup"]) {
			if (form["password"] !== form["password-repeat"]) return setPwMismatch(true);
			setLoading(true);
			signup(form["email"], form["password"], form["remember"] != null)
			setSignupEmail(form["email"]);
		} else {
			setLoading(true);
			login(form["email"], form["password"], form["remember"] != null)
		}
	};
	
	return <>
		<Container component="main" maxWidth="xs">
			<ConfirmationDialog signupEmail={signupEmail} onConfirm={(code) => {
				sendMessage({type: "verify", code});
			}}/>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
					{isSignup ? <><Person/></> : <LockOutlined/>}
				</Avatar>
				<Typography component="h1" variant="h5">
					{isSignup ? "Sign Up" : "Sign In"}
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						disabled={loading}
						defaultValue={defaultEmail}
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						helperText={pwShort ? "minumum length: 8 characters" : undefined}
						error={pwMismatch || pwShort}
						disabled={loading}
						onChange={(e) => {
							setPwShort(e.target.value.length < 8)
							setPwMismatch(false)
						}}
						defaultValue={defaultPW}
					/>
					<Collapse in={isSignup}>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password-repeat"
							label="Repeat Password"
							type="password"
							id="password-repeat"
							autoComplete="current-password"
							error={pwMismatch}
							helperText={pwMismatch ? "Passwords do not match" : undefined}
							disabled={loading}
							onChange={() => setPwMismatch(false)}
							defaultValue={defaultPW}
						/>
					</Collapse>
					<Grid container spacing={2} justifyContent={"space-between"}>
						<Grid item>
							<FormControlLabel
								control={<Checkbox
									color="primary"
									defaultChecked
									inputProps={{name: "remember"}}
									disabled={loading}
								/>}
								label="Remember me"
							/>
						</Grid>
						<Grid item>
							<FormControlLabel
								control={<Switch
									color="primary"
									checked={isSignup}
									onChange={(e) => {
										setSignup(e.target.checked)
										setPwMismatch(false)
									}}
									disabled={loading}
									name="signup"
									inputProps={{name: "signup"}}
								/>}
								label="Signup"
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{mt: 3, mb: 2}}
						disabled={loading}
					>
						{
							(loading && "loading...") ||
							(isSignup && "Next") ||
							"Sign In"
						}
					</Button>
					<Link href="#" variant="body2">
						Forgot password?
					</Link>
				</Box>
			</Box>
		</Container>
	</>
}
