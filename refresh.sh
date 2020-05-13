#refresh all the chart repositories assuming they have been installed

#dont forget the chmod +x run this in unix bash land

#go back to modules from MMM-ChartUtilities
cd ../

#
cd MMM-ChartDisplay
git pull
cd ../
MMM-ChartProvider-JSON
git pull
cd ../
MMM-ChartProvider-Words
git pull
cd ../
MMM-ChartProvider-Finance
git pull
cd ../

#go back to mm root
#should be at /Magicmirror now

cd ../

#re-install all the dependencies here so we dont create humongous directories of copies of npm modules

# we dont install moment as it is already present by default in MM
# we dont install fs as it is part of core node-js apparently. On windows you may need to install it 

npm install linq

#Special install of require.js to support amcharts. Under the vendor directory as the MMM-ChartDisplay module needs to know where it is

cd ../vendor

npm install requirejs