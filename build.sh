cd client
npm run build
rm -fr ../server/public
cp -fr build ../server/public
