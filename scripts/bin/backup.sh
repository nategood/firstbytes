#! /bin/sh
cd ~/backups
mongodump
tar -czf `date '+%s'`.tgz dump
# todo: scp, push to S3 or something off of this server