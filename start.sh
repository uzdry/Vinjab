if [ -f "src/tsnode/ServerStarter.js" ]
then
node src/tsnode/ServerStarter.js
else
echo "There are no Javascript files. Have you build the project yet?"
fi
