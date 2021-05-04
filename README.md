# webcase-frontend

Frontend service for WebCASE (https://github.com/michaelwenk/webcase).

## Docker and Application Start/Stop

This project uses Docker (https://www.docker.com). Make sure that docker is installed.

### Use pre-build Container Image

Use this command to download the pre-built image from Docker Hub:

    docker pull michaelwenk/webcase-frontend

### Build of Container Image

If you want to build the container image by yourself, you need to first clone this repository and change the directory:

    git clone https://github.com/michaelwenk/webcase-frontend.git
    cd webcase-frontend

Then build the container image using following command:

    docker build -t webcase-frontend .

### Start

To start this service (in detached mode) use:

    docker run -d -p 3001:3000 --name webcase-frontend michaelwenk/webcase-frontend

As configured above, the backend service does allow requests from port 3001 only.

### Stop

To stop this application use

    docker stop webcase-frontend
