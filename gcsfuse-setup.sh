export GCSFUSE_REPO=gcsfuse-`lsb_release -c -s`
echo "deb http://packages.cloud.google.com/apt $GCSFUSE_REPO main" | sudo tee /etc/apt/sources.list.d/gcsfuse.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install gcsfuse
sudo groupadd fuse
sudo usermod -a -G fuse $USER
#
gcloud auth login
gcloud auth application-default login
gcsfuse object-detection-pipeline-demo /mnt/share