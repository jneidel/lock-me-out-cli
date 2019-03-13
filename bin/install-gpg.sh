echo "##### install gpg #####"
GPGV="2.2.13"; # see for new versions: https://gnupg.org/ftp/gcrypt/gnupg

echo "download v"$GPGV
wget https://gnupg.org/ftp/gcrypt/gnupg/gnupg-$GPGV.tar.bz2 -O ./gpg-$GPGV.tar.bz2;
tar xf gpg-$GPGV.tar.bz2;
rm gpg-$GPGV.tar.bz2;
cd gnupg-$GPGV;

echo "start install"
./configure --prefix=/usr/local/bin; # install location
make;
sudo make install;

echo "cleanup gpg install";
cd ..;
rm -rf gnupg-$GPGV;

