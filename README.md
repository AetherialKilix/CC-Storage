# CC-Storage
This is a WIP project trying to create a storage system using CC: Tweaked (rework of Computercraft).
While this is mainly intended for myself, feel free to use, improve, fork or criticise it.

## Using IDEA-based IDEs
The project includes run configurations for IDEA-based IDEs.
Simply run "all", which starts up docker, both front- & backend aswell as open both browsertabs.
The only thing that needs to be re-run is the backend, since the frontend uses react it will auto-reload.

## Development
Set the NODE_ENV environment variable to "development" (this is already included in the idea run configuration).
During development (maildev)[https://github.com/maildev/maildev] should be used instead of a "real" mail server. For that simply run the docker compose file.

## Deployment
For deployment the environment variables MAIL_ADDR and MAIL_PASS must be set in order to connect to a mail server.
