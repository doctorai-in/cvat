# Type commands below into the terminal window to install docker. More instructions can be found here.
sudo apt-get update
sudo apt-get --no-install-recommends install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg-agent \
  software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
sudo apt-get update
sudo apt-get --no-install-recommends install -y docker-ce docker-ce-cli containerd.io
# Perform post-installation steps to run docker without root permissions.
sudo groupadd docker
sudo usermod -aG docker $USER

# Install docker-compose (1.19.0 or newer). Compose is a tool for defining and running multi-container docker applications.
sudo apt-get --no-install-recommends install -y python3-pip python3-setuptools
sudo python3 -m pip install setuptools docker-compose

# Clone CVAT source code from the GitHub repository.

sudo apt-get --no-install-recommends install -y git
git clone https://github.com/doctorai-in/cvat.git
cd cvat

# Build docker images by default. It will take some time to download public docker image ubuntu:16.04 and install all necessary ubuntu packages to run CVAT server.

sudo docker-compose build

# Run docker containers. It will take some time to download public docker images like postgres:10.3-alpine, redis:4.0.5-alpine and create containers.

sudo docker-compose up -d

# You can register a user but by default it will not have rights even to view list of tasks. Thus you should create a superuser. A superuser can use an admin panel to assign correct groups to the user. Please use the command below:

sudo docker exec -it cvat bash -ic 'python3 ~/manage.py createsuperuser'

