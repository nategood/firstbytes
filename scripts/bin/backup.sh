#! /bin/sh
cd ~/backups
mongodump
tar -czf latest.tgz dump
cp latest.tgz `date '+%s'`.tgz
# todo: scp, push to S3 or something off of this server