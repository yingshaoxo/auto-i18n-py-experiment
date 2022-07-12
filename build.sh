nvm use 14
npm link v-google-translate
npm run build:h5

cd dist
rm -f wap.zip
mv h5 wap
zip -r wap.zip wap
open .