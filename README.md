# webcase-frontend

Frontend service for WebCASE (https://github.com/michaelwenk/webcase).

## Docker and Application Start/Stop

This project uses Docker containers (https://www.docker.com). Make sure that "docker" is installed.

#### Build

To build the container image use the following command:

    docker build -t webcase-frontend .

#### Start

To start this service (in detached mode) use:

    docker run -d -p 3001:3000 --name webcase-frontend webcase-frontend

#### Stop

To stop this application use

    docker stop webcase-frontend
