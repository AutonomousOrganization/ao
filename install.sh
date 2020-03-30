# update
sudo apt update -yqqq 2>/dev/null
sudo apt autoremove -yqqq
echo apt update complete

# upgrade
sudo apt upgrade -yqqq
echo apt upgrade complete

# more cleanup
#sudo apt-get dist-upgrade -yqqq
#sudo apt-get clean -yqqq
#sudo apt-get autoclean -yqqq

# install git
if [ $(dpkg-query -W -f='${Status}' git 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo git already installed
else
	sudo apt install -y git
fi

# install sqlite3
if [ $(dpkg-query -W -f='${Status}' sqlite3 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo sqlite3 already installed
else
	sudo apt install -y sqlite3
fi

cd ~
if [ ! -d "$HOME/.ao" ];
then
	mkdir -p $HOME/.ao
fi

# install npm
if [ $(dpkg-query -W -f='${Status}' npm 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	NPMVERSION=`npm -v`
	echo npm v$NPMVERSION already installed
else
	sudo apt install -y npm
fi

# install nvm
if [ -f "$HOME/.nvm/nvm.sh" ];
then
	. ~/.nvm/nvm.sh
fi

if [ $(command -v nvm | grep -c "nvm") -eq 1 ];
then
	NVMVERSION=`nvm --version`
	echo nvm v$NVMVERSION already installed
else
	git clone https://github.com/creationix/nvm.git ~/.nvm 2>/dev/null
	sudo echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
	sudo echo "source ~/.nvm/nvm.sh" >> ~/.profile
	source ~/.bashrc
	source ~/.profile
fi

NODEVERSION=`nvm current`

# install node
if [ $(echo $NODEVERSION) -eq 1 ];
then
	echo node $NODEVERSION already installed
else
	nvm install stable
	nvm use stable
fi

# install c-lightning
# test these to see which are optional. autodev-tools might be optional.
if [ $(dpkg-query -W -f='${Status}' zlib1g-dev 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo zlib1g-dev already installed
else
	sudo apt install -y zlib1g-dev
fi

if [ $(dpkg-query -W -f='${Status}' libtool 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo libtool already installed
else
	sudo apt install -y libtool
fi

if [ $(dpkg-query -W -f='${Status}' autoconf 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo autoconf already installed
else
	sudo apt install -y autoconf
fi

if [ $(dpkg-query -W -f='${Status}' automake 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo automake already installed
else
	sudo apt install -y automake
fi

if [ $(dpkg-query -W -f='${Status}' autotools-dev 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo autotools-dev already installed
else
	sudo apt install -y autotools-dev
fi

if [ $(dpkg-query -W -f='${Status}' libgmp-dev 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo libgmp-dev already installed
else
	sudo apt install -y libgmp-dev
fi

if [ $(dpkg-query -W -f='${Status}' libsqlite3-dev 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo libsqlite3-dev already installed
else
	sudo apt install -y libsqlite3-dev
fi

if [ $(dpkg-query -W -f='${Status}' python 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo python already installed
else
	sudo apt install -y python
fi

if [ $(dpkg-query -W -f='${Status}' python3 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo python3 already installed
else
	sudo apt install -y python3
fi

if [ $(dpkg-query -W -f='${Status}' python3-mako 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo python3-mako already installed
else
	sudo apt install -y python3-mako
fi

if [ $(dpkg-query -W -f='${Status}' libsodium-dev 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo libsodium-dev already installed
else
	sudo apt install -y libsodium-dev
fi

if [ $(lightning-cli --version 2>/dev/null | grep -c "v0\.8\.0") -eq 1 ];
then
	echo c-lightning v0.8.0 already installed
else
	cd ~
	git clone https://github.com/ElementsProject/lightning.git
	lightning=true
	cd lightning
	./configure
	make
	sudo make install
fi

# bitcoin: download a hosted copy of the current bitcoin executable for pi

# install tor
if [ $(tor --version  2>/dev/null | grep -c "0\.4\.0\.5") -eq 1 ];
then
	echo tor v0.4.0.5 already installed
else
	if [ $(dpkg-query -W -f='${Status}' build-essential 2>/dev/null | grep -c "ok installed") -eq 0 ];
	then
		sudo apt install -y build-essential
	fi

	if [ $(dpkg-query -W -f='${Status}' fakeroot 2>/dev/null | grep -c "ok installed") -eq 0 ];
	then
		sudo apt install -y fakeroot
	fi

	if [ $(dpkg-query -W -f='${Status}' devscripts 2>/dev/null | grep -c "ok installed") -eq 0 ];
	then
		sudo apt install -y devscripts
	fi

	if [ $(dpkg-query -W -f='${Status}' libevent-dev 2>/dev/null | grep -c "ok installed") -eq 0 ];
	then
		sudo apt install -y libevent-dev
	fi

	if [ $(dpkg-query -W -f='${Status}' libssl-dev 2>/dev/null | grep -c "ok installed") -eq 0 ];
	then
		sudo apt install -y libssl-dev
	fi

	cd ~
	wget https://dist.torproject.org/tor-0.4.0.5.tar.gz
	tor=true
	tar xf tor-0.4.0.5.tar.gz
	cd tor-0.4.0.5
	./configure
	make
	sudo make install
fi

# configure tor
TORRCPATH='/usr/local/etc/tor/torrc'
if [ ! -d "/usr/local/etc/tor" ];
then
	sudo mkdir -p /usr/local/etc/tor
fi

if [ ! -f $TORRCPATH ];
then
	wget https://raw.githubusercontent.com/torproject/tor/master/src/config/torrc.sample.in
	sudo mv torrc.sample.in $TORRCPATH
fi

if [ $(cat $TORRCPATH | grep -c "HiddenServiceDir /var/lib/tor/ao") -eq 0 ];
then
	echo "HiddenServiceDir /var/lib/tor/ao" | sudo tee -a $TORRCPATH 1>/dev/null 2>&1
fi

if [ $(cat $TORRCPATH | grep -c "HiddenServiceDir /var/lib/tor/ao") -eq 0 ];
then
	echo "HiddenServiceDir /var/lib/tor/ao" | sudo tee -a $TORRCPATH 1>/dev/null 2>&1
fi

if [ $(cat $TORRCPATH | grep -c "HiddenServicePort 80 127\.0\.0\.1:8003") -eq 0 ];
then
	echo "HiddenServicePort 80 127.0.0.1:8003" | sudo tee -a $TORRCPATH 1>/dev/null 2>&1
fi

if [ ! -d "/var/lib/tor" ];
then
	sudo mkdir -p /var/lib/tor
fi

if [ ! -d "/var/lib/tor/ao" ];
then
	sudo mkdir -p /var/lib/tor/ao
fi

sudo chown -R $USER:$USER /var/lib/tor
sudo chmod -R 700 /var/lib/tor

# get ao tor hostname for configuration.js
if [ -f "/var/lib/tor/ao/hostname" ];
then
	TORHOSTNAME=`cat /var/lib/tor/ao/hostname`
fi

# install borgbackup
if [ $(dpkg-query -W -f='${Status}' borgbackup 2>/dev/null | grep -c "ok installed") -eq 1 ];
then
	echo borgbackup already installed
else
	sudo apt install -y borgbackup
fi

# clone the AO repository
cd ~
if find "ao" -mindepth 1 -print -quit 2>/dev/null | grep -q .;
then
	echo ao git repository already cloned
else
	git clone https://github.com/autonomousorganization/ao
fi

# install project dependencies
cd ao
npm install

# create configuration.js
if [ -f "$HOME/ao/configuration.js" ];
then
	echo configuration.js already exists
else
	CONFIG="module.exports = {
		openAo: true,
    bitcoind: {
        network: 'mainnet'
    },
    bitcoinAverage: {
        pub: '',
        secret: ''
    },
    sqlite3: {
        file: '$HOME/.ao/database.sqlite3'
    },
    clightning: {
        dir: '$HOME/.lightning/bitcoin'
    },
    tor: {
    	hostname: '$TORHOSTNAME'
    }
}"
    echo "$CONFIG" > $HOME/ao/configuration.js
    echo configuration.js file created
fi

# set up tor to autostart as a daemon via systemd
if [ -f "/etc/systemd/system/tor.service" ];
then
	echo tor systemd startup file already exists
else
	TORUNIT="[Unit]
Description=Anonymizing overlay network for TCP (multi-instance-master)
After=network.target

[Service]
User=$USER
Group=$USER
Type=simple
#Type=forking
PrivateTmp=yes
PermissionsStartOnly=true

ExecStartPre=-/bin/mkdir /var/run/tor
ExecStartPre=/bin/cp $TORRCPATH /var/run/tor
ExecStartPre=/bin/chmod a-wx,go-rwx /var/run/tor/torrc
ExecStartPre=/bin/chown -R $USER:$USER /var/run/tor

ExecStart=/usr/local/bin/tor -f $TORRCPATH
ExecReload=/bin/kill -HUP $MAINPID

#LimitNPROC = 2
#DeviceAllow = /dev/null rw
#DeviceAllow = /dev/urandom r
#DeviceAllow = /dev/random r
#InaccessibleDirectories = /
#ReadOnlyDirectories = /etc /usr
#ReadWriteDirectories = /var/lib/tor /var/log/tor

#PIDFile=/var/run/tor/tor.pid
KillSignal=SIGINT
LimitNOFILE=8192
PrivateDevices=yes

#Type=oneshot
#RemainAfterExit=yes
#ExecStart=/bin/true
#ExecReload=/bin/true

[Install]
WantedBy=multi-user.target"
	echo "$TORUNIT" | sudo tee /etc/systemd/system/tor.service 1>/dev/null 2>&1
	sudo systemctl daemon-reload
	echo tor systemd startup file created
fi

# set up AO to autostart as a daemon via systemd
if [ -f "/etc/systemd/system/ao.service" ];
then
	echo ao systemd startup file already exists
else
	UNIT="[Unit]
Description=ao-daemon

[Service]
ExecStart=$HOME/.nvm/versions/node/v11.15.0/bin/node $HOME/ao/production/server/app.js
User=$USER
Type=simple
Restart=always
RestartSec=30
PrivateTmp=true

[Install]
WantedBy=multi-user.target"

	echo "$UNIT" | sudo tee -a /etc/systemd/system/ao.service 1>/dev/null 2>&1
	sudo systemctl daemon-reload
	echo ao systemd startup file created
fi

if [ $(sudo systemctl status tor | grep -c "disabled") -eq 0 ];
then
	echo tor systemd startup already enabled
else
	sudo systemctl enable tor
	echo tor systemd startup enabled
fi

if [ $(sudo systemctl status ao | grep -c "disabled") -eq 0 ];
then
	echo ao systemd startup already enabled
else
	sudo systemctl enable ao
	echo ao systemd startup enabled
fi

# cleanup c-lightning install
cd ~
if [ "$lightning" = true ];
then
	rm -rf lightning
fi

# cleanup tor install
if [ "$tor" = true ];
then
	rm -rf tor-*
	rm tor-0.4.0.5.tar.gz
fi

echo the AO is installed
