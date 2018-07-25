
echo "##### install gpg #####"
GPGV="1.4.23";

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

