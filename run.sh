#!/bin/sh
echo '+++++++++++++++++++++++++run.sh START+++++++++++++++++++++++++++++++++++++++++++++'

if [ $# -le 1 ]
then
  echo "Please input service name as first parameter, deploy target folder as second parameter and zip file as third parameter!"
  exit -2
fi

servicename=$1
runfolder=$2
filename=$3

cd `dirname $0`
if [ -d ".tmp" ]
then
    rm -rf .tmp
fi
mkdir .tmp
cp $filename .tmp/
cd .tmp
unzip $filename

if [ -d "/opt/hp/propel/$runfolder/dist" ]
then
    rm -rf /opt/hp/propel/$runfolder/dist
fi
if [ -d "/opt/hp/propel/$runfolder/bower_components" ]
then
    rm -rf /opt/hp/propel/$runfolder/bower_components
fi

cp -R dist /opt/hp/propel/$runfolder
cp -R bower_components /opt/hp/propel/$runfolder

[ -n "`alias -p | grep '^alias cp='`" ] && unalias cp
cp -Rf node_modules /opt/hp/propel/$runfolder
alias cp='cp -i'

service $servicename restart


echo '+++++++++++++++++++++++++run.sh END+++++++++++++++++++++++++++++++++++++++++++++'