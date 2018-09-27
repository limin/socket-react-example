cd server
npm install

cd ../client
npm install
npm run build
rm -fr ../server/public
cp -fr build ../server/public
